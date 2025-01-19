class PoRepository {

    /**
     * @param {Repository} baseRepository
     */
    constructor(baseRepository) {
        this.baseRepo = baseRepository
    }

    /**
     * @param{Pagination|null} pagination
     * @return {Po[]}
     */
    get(pagination = null) {
        let rows = this.baseRepo.readSheetData();
        let pos = new Map();

        for (let row of rows) {

            if (Po.isValidPo(row)) {

                const po = Po.map(row);
                const id = this.createUniqueId(po);

                if (pos.has(id)) {
                    let existingPo = pos.get(id);
                    existingPo.addIndex(row[keys.unit_id]);
                    pos.set(id, existingPo);
                } else {
                    pos.set(id, po);
                }
            } else {

            }

            if (pagination && pos.size === pagination.limit) {
                Logger.log(pagination.limit + ' ' + pos.size)
                break;
            }
        }

        return Array.from(pos.values());
    }

    /**
     * @param {string} po_name
     * @return {Po}
     */
    getByName(po_name) {
        let rowIndex = this.baseRepo.getRowIndex(po_name, keys.po_name)
        let row = this.baseRepo.getRow(rowIndex)
        return Po.map(row)
    }

    /**
     * @param {Po} po
     * @return {Po}
     */
    getByProjectCode(po) {
        let pos = this.get()

        return pos.find(po_ => po_.po_code === po.po_code)
    }

    /**
     * @param {string} dealer_id
     * @return {Po[]}
     */
    getByDealerId(dealer_id) {
        return this.get()
            .filter(po => po !== null)
            .filter(po => po.dealer_id === dealer_id)
    }

    /**
     * @param {Po} po
     */
    deleteByPo(po) {
        try {
            if (!po) { return }

            const spreadsheet = SpreadsheetApp.openById(this.baseRepo.spreadSheetId);
            const sheet = spreadsheet.getSheetByName(this.baseRepo.sheetName);

            if (!sheet) throw new Error(`Sheet ${this.baseRepo.sheetName} not found in spreadsheet.`);

            Logger.log("DELETING INDEXES FOR PO " + po.po_name)
            Logger.log(po.indexes)

            let rows = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();

            const rowsToDelete = [];

            rows.forEach((row, index) => {
                if (po.indexes.includes(row[0])) {
                    Logger.log("UNIT ID/INDEX " + row[0])
                    rowsToDelete.push(index + 1);
                }
            });

            rowsToDelete.sort((a, b) => b - a);

            rowsToDelete.length > 0 && rowsToDelete.forEach(rowIndex => {
                sheet.deleteRow(rowIndex);
            });

            this.baseRepo.cachedSheetData = null;
        } catch (e) {
            Logger.log("ERROR DELETING ORDER")
            Logger.log(e)
        }
    }


    /*--------------------HELPERS--------------*/
    /**
     * Creates a unique identifier for a Po.
     * @param {Po} po - The Po object.
     * @return {string} A unique identifier.
     */
    createUniqueId(po) {
        return `${po.po_name.trim()}-${po.project_id.trim()}`;
    }
}