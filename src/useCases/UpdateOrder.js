class UpdateOrder {
    /**
     * @constructor
     * @param {PoRepository} pos
     * @param {UnitsRepository} units
     * @param {ShipmentRepository} shipments
     * @param {StreetRepository} addresses
     * @param {WebHookService} webHookService
     */
    constructor(pos, units, shipments, addresses, webHookService) {
        this.pos = pos
        this.units = units
        this.shipments = shipments
        this.addresses = addresses
        this.appForUploadedSheet = null
        this.spreadSheetId = null
        this.webHookService = webHookService
        this.cacheService = CacheService.getScriptCache()
    }

    /**
     * @param {string} targetSpreadSheetId
     * return {Order}
     */
    execute(targetSpreadSheetId) {
        this.spreadSheetId = targetSpreadSheetId
        this.appForUploadedSheet = AppFactoryService.create(this.spreadSheetId, UPLOADED_SHEET_NAME)

        let newOrder = this.identifyLastUploadedOrder()

        if (newOrder.po) {
            let prevOrder = this.getPrevOrder(newOrder)

            this.deletePreviousOrder(prevOrder)

            return this.rebuildOrder(newOrder, prevOrder)
        } else {
            let po = this.cacheService.get('po_code')
            Logger.log(po + ' AWANTIAA')
            this.webHookService.notifyError(new OrderUpdateError("Po not build", po))
            return null
        }
    }

    /**
     * return {Order}
     */
    identifyLastUploadedOrder() {
        let pos = this.pos.get()
        let po = pos[pos.length - 1]
        let units = this.units.getByPo(po)
        let shipments = this.shipments.getByPo(po)
        let addresses = this.addresses.getByPo(po)
        let firstUnit = units.find(it => it.po_name)


        return new Order(po, units, shipments, addresses)
    }

    /**
     *
     * @param {Order} order
     * @return {Order}
     */
    getPrevOrder(order) {
        return this.appForUploadedSheet.getOrderByPoName().execute(order.po);
    }

    /**
     *
     * @param {Order} newOrder
     * @param {Order|null} prevOrder
     * @return {Order}
     */
    rebuildOrder(newOrder, prevOrder) {
        if (!prevOrder) return newOrder

        /**
         * @type {Map<string, Unit>}
         */
        const prevUnitsMap = new Map();

        /**
         * @type {Shipment[]}
         */
        let preexistingShipments = []

        prevOrder.units.forEach((prevUnit) => {
            const key = prevUnit.generateUnitKey();
            prevUnitsMap.set(key, prevUnit);
        });

        newOrder.units.forEach((newUnit) => {
            const key = newUnit.generateUnitKey();
            const matchedPrevUnit = prevUnitsMap.get(key);

            if (matchedPrevUnit) {
                newUnit.merchandiser = matchedPrevUnit.merchandiser
                newUnit.production_number = matchedPrevUnit.production_number

                let prevShipment = prevOrder.shipments.find(it => it.index === matchedPrevUnit.index)

                if (prevShipment) {
                    prevShipment.index = newUnit.index

                    preexistingShipments = [...preexistingShipments, prevShipment]
                }
            }
        });

        newOrder.shipments = preexistingShipments

        return newOrder;
    }

    /**
     * @param {Order} prevOrder
     */
    deletePreviousOrder(prevOrder) {
        if (prevOrder) {
            this.appForUploadedSheet.deleteOrderByPo().execute(prevOrder.po)
        }
    }
}