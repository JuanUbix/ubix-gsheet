class ShipmentRepository {

    /**
     * @param {Repository} baseRepository
     */
    constructor(baseRepository) {
        this.baseRepo = baseRepository
    }

    /**
     * @return {Shipment[]} Array of Unit instances matching the given Po's po_name.
     */
    get() {
        let rows = this.baseRepo.readSheetData()
        return Shipment.mapList(rows)
            .filter(ship => ship !== null)
    }

    /**
     * Fetches units by the given Po object's po_name.
     * @param {Po} po - The Po object to match units against.
     * @return {Shipment[]} Array of Unit instances matching the given Po's po_name.
     */
    getByPo(po) {
        let rows = this.baseRepo.readSheetData()
        if (po && po.po_name !== '') {
            return Shipment.mapList(rows)
                .filter(ship => ship !== null)
                .filter(ship => ship.po_name === po.po_name)
        } else {
            return []
        }
    }
}
