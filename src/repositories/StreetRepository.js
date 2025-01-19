class StreetRepository {

    /**
     * @param {Repository} baseRepository
     */
    constructor(baseRepository) {
        this.baseRepo = baseRepository
    }

    /**
     * @return {Address[]} Array of Unit instances matching the given Po's po_name.
     */
    get() {
        let rows = this.baseRepo.readSheetData()
        return Address.mapList(rows)
            .filter(address => address !== null)
    }

    /**
     * Fetches addresses by the given Po object's po_name.
     * @param {Po} po - The Po object to match units against.
     * @return {Address[]} Array of Addresses instances matching the given Po's po_name.
     */
    getByPo(po) {
        let rows = this.baseRepo.readSheetData()
        if (po && po.po_name !== '') {
            return Address.mapList(rows)
                .filter(address => address !== null)
                .filter(address => address.po_name === po.po_name)
        } else {
            return []
        }
    }
}