/**
 * @constructor
 * @param {string} spreadsheetId
 * @param {string} sheetName
 * @param {string} sheetId
 * @param {string} apiEndpoint
 * @param {Pagination|null} pagination
 * */
class App {
    constructor(
        spreadsheetId = CHINA_PRODUCTION_SPREADSHEET_ID,
        sheetName = CHINA_PRODUCTION_REPORT_EXAMPLE_SHEET_NAME,
        sheetId = REPORT_EXAMPLE_ID,
        apiEndpoint = URL_STAGING,
        pagination = null
    ) {
        FACTORY = UbixFactories.fromSpreadSheetId(spreadsheetId)
        this.spreadsheetId = spreadsheetId
        this.apiEndpoint = UrlFactory.fromSpreadSheetId(this.spreadsheetId)
        this.sheetId = sheetId
        this.sheetName = sheetName
        this.pagination = pagination
        this.baseRepository = new Repository(this.spreadsheetId, this.sheetName)
        this.poRepository = new PoRepository(this.baseRepository)
        this.unitRepository = new UnitsRepository(this.baseRepository)
        this.shipmentRepository = new ShipmentRepository(this.baseRepository)
        this.addressRepository = new StreetRepository(this.baseRepository)
        this.orderRepository = new OrderRepository(this.baseRepository)
        this.apiService = new ApiService(this.apiEndpoint)
        this.webHookService = new WebHookService(this.apiEndpoint)
        Logger.log(`Creating app for ${FACTORY}, spreadsheet: ${this.spreadsheetId}, sheet: ${this.sheetId} aiming to ${this.apiEndpoint}`)
    }

    /**
     * @return {Po[]}
     */
    getPos() {
        return this.poRepository.get(this.pagination)
    }

    /**
     * @return {Unit[]}
     */
    getUnits() {
        return this.unitRepository.get()
    }

    /**
     * @return {Shipment[]}
     */
    getShipments() {
        return this.shipmentRepository.get()
    }

    /**
     * @return {Address[]}
     */
    getAddresses() {
        return this.addressRepository.get()
    }

    /**
     * @return {GetOrdersByDealerId}
     */
    getOrdersByDealerId() {
        return new GetOrdersByDealerId(this.orderRepository, this.poRepository)
    }

    /**
     * @return {GetOrderByPoName}
     */
    getOrderByPoName() {
        return new GetOrderByPoName(this.orderRepository, this.poRepository, this.unitRepository, this.shipmentRepository)
    }

    /**
     * @return Order[]
     */
    getOrders() {
        let orders = []

        let pos = this.getPos().filter(po => po !== null)
        let units = this.getUnits().filter(unit => unit !== null)
        let shipments = this.getShipments().filter(shipment => shipment !== null)
        let addresses = this.getAddresses().filter(address => address !== null)

        pos.forEach(po => {
            orders.push(
                new Order(
                    po,
                    units.filter(unit => po.indexes.includes(unit.index)),
                    shipments.filter(ships => po.indexes.includes(ships.index)),
                    addresses.filter(address => po.indexes.includes(address.index)),
                )
            )
        })

        let orders_ = orders.filter(order => order !== null && order?.po !== null);
        Logger.log("Total orders in status sheet: " + orders_.length)
        return orders_
    }

    /**
     * Returns orders that contain only units with a production number.
     * @return {Order[]}
     */
    getOrdersUnderProduction() {
        return this.getOrders().map(order => {
            let unitsShippedOrUnderProduction = order.shipments.map(shipment => shipment.unit_id);

            const unitsWithMerchandiserOrProductionNumber = order.units
                .filter(unit => (unit.merchandiser !== null && unit.merchandiser !== '') || (unit.production_number !== null && unit.production_number !== ''))
                .map(unit => unit.id);

            unitsShippedOrUnderProduction = [
                ...unitsShippedOrUnderProduction,
                ...unitsWithMerchandiserOrProductionNumber
            ];

            if (unitsShippedOrUnderProduction.length === 0) return null;

            const filteredUnits = order.units.filter(unit => unitsShippedOrUnderProduction.includes(unit.index))

            const filteredAddresses = order.addresses.filter(address => unitsShippedOrUnderProduction.includes(address.index))

            return new Order(
                order.po,
                filteredUnits,
                order.shipments,
                filteredAddresses
            );
        }).filter(order => order !== null && order?.po !== null);
    }

    /**
     * @return { UpdateOrder }
     */
    updateOrder() {
        return new UpdateOrder(this.poRepository, this.unitRepository, this.shipmentRepository, this.addressRepository, this.webHookService)
    }

    writeOrder() {
        return new WriteOrder()
    }

    /**
     * Execute process of arranges and export orders to main server
     */
    async run() {
        if (!this.sheetId) {
            Logger.log('NO SE EXPORTA SIN SHEET ID')
            return false
        }

        let orders = [CHINA_PRODUCTION_UPLOADED_SHEET_NAME, CHINA_PRODUCTION_TEST_SHEET_NAME].includes(this.sheetName)  ? this.getOrdersUnderProduction() : this.getOrders();

        Logger.log(`Sending ${orders.length} orders to the server`)

        this.apiService.requestUpdateOrders(orders, this.sheetId)
    }

    /**
     * @return {DeleteOrderByPo}
     */
    deleteOrderByPo() {
        return new DeleteOrderByPo(this.poRepository, this.unitRepository, this.shipmentRepository, this.addressRepository)
    }
}
