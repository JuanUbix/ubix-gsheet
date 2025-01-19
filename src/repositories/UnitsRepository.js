class UnitsRepository {

    /**
     * @param {Repository} baseRepository
     */
    constructor(baseRepository) {
        this.baseRepo = baseRepository
    }

    /**
     * @return {Unit[]}
     */
    get() {
        let rows = this.baseRepo.readSheetData();
        return Unit.mapList(rows)
            .filter(unit => unit !== null)

    }

    /**
     * @param {Po} po - The Po object to match units against.
     * @return {Unit[]} Array of Unit instances matching the given Po's po_name.
     */
    getByPo(po) {
        let rows = this.baseRepo.readSheetData()
        return Unit.mapList(rows)
            .filter(unit => unit !== null && unit.po_name !== null)
            .filter(unit => unit.po_name === po?.po_code)
    }

    /**
     * @param {string} dealer_id - The Po object to match units against.
     * @return {Unit[]} Array of Unit instances matching the given Po's po_name.
     */
    getByDealerId(dealer_id) {
        let rows = this.baseRepo.readSheetData()
        return Unit.mapList(rows)
            .filter(unit => unit !== null)
            .filter(unit => unit.dealer_id === dealer_id)
    }
}
