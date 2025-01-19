/**
 * @constructor
 * @param {string} spreadSheetId
 * @param {string} sheet_name
 * */
class Repository {
    constructor(spreadSheetId, sheetName) {
        this.spreadSheetId = spreadSheetId
        this.sheetName = sheetName
        this.cachedSheetData = null;
        keys = [CHINA_PRODUCTION_UPLOADED_SHEET_TEST_NAME, CHINA_PRODUCTION_EDIT_UPLOADED_SHEET_NAME, CHINA_PRODUCTION_UPLOADED_SHEET_NAME, CHINA_PRODUCTION_TEST_SHEET_NAME].includes(this.sheetName) ? new_keys : prev_keys;
    }

    /**
     * Lazy loads and caches data from the sheet.
     * @return {Array<Array<string | number | boolean>>} 2D array of sheet data.
     */
    readSheetData() {
        if (this.cachedSheetData === null) {
            const spreadsheet = SpreadsheetApp.openById(this.spreadSheetId);
            const sheet = spreadsheet.getSheetByName(this.sheetName);

            if (!sheet) throw new Error(`Sheet ${this.sheetName} not found in spreadsheet.`);

            const range = sheet.getDataRange();
            this.cachedSheetData = range.getValues().slice(1); // Cache the data
        }
        return this.cachedSheetData;
    }

    /**
     * Finds the index of the first row where the given value matches in the specified column.
     * @param {string | number | boolean} value - The value to search for.
     * @param {number} columnIndex - The index of the column to check.
     * @return {number|null} The index of the first matching row, or null if no match is found.
     */
    getRowIndex(value, columnIndex) {
        const sheetData = this.readSheetData();

        for (let i = 0; i < sheetData.length; i++) {
            if (String(sheetData[i][columnIndex]).toLowerCase() === value.toString().toLowerCase()) {
                return i + 1; // +1 to account for header row
            }
        }

        return null;
    }

    /**
     * Finds the indexes of rows where the given value matches in the specified column.
     * @param {string | number | boolean} value - The value to search for.
     * @param {number} columnIndex - The index of the column to check.
     * @return {number[]} Array of row indexes where the condition is matched.
     */
    getRowsIndexes(value, columnIndex) {
        const sheetData = this.readSheetData();
        const rowIndexes = [];

        sheetData.forEach((row, index) => {
            if (row[columnIndex] === value) {
                rowIndexes.push(index + 1); // +1 to account for header row
            }
        });

        return rowIndexes;
    }

    /**
     * Retrieves the row data for a given index.
     * @param {number} rowIndex - The index of the row to retrieve.
     * @return {Array<string | number | boolean>} Row data.
     */
    getRow(rowIndex) {
        const sheetData = this.readSheetData();
        return sheetData[rowIndex - 1];
    }

    /**
     * Retrieves rows for the given array of row indexes.
     * @param {number[]} rowIndexes - The array of row indexes to retrieve.
     * @return {Array<Array<string | number | boolean>>} Array of rows.
     */
    getRowsByIndexes(rowIndexes) {
        const sheetData = this.readSheetData();
        let rows = [];

        rowIndexes.forEach(rowIndex => {
            // Adjust for zero-based index of the array
            const adjustedIndex = rowIndex - 1;
            if (adjustedIndex >= 0 && adjustedIndex < sheetData.length) {
                rows.push(sheetData[adjustedIndex]);
            }
        });

        return rows;
    }

    /**
     * Creates a unique identifier for a Po.
     * @return {Array<string | number | boolean>} Row data.
     * @return {string} A unique identifier.
     */
    createUniqueId(row) {
        // Assuming rep_id and po_name together make a Po unique
        return `${row[this.keys.po_name]}`;
    }


    deleteRow(index) {
        const spreadsheet = SpreadsheetApp.openById(this.spreadSheetId);
        const sheet = spreadsheet.getSheetByName(this.sheetName);
        sheet.deleteRow(index)
    }

    /**
     * Deletes rows where the specified values match in the `project_id` and `po_name` columns.
     * @param {Po} po - The value to search for in the `project_id` column.
     * @return {Array<number>}
     */
    getRowsForMatchingPo(po) {
        const sheetData = this.readSheetData();
        const spreadsheet = SpreadsheetApp.openById(this.spreadSheetId);
        const sheet = spreadsheet.getSheetByName(this.sheetName);

        if (!sheet) throw new Error(`Sheet ${this.sheetName} not found in spreadsheet.`);

        const rowsToDelete = [];
        for (let i = 0; i < sheetData.length; i++) {
            let incrementedIndex = i
            const row = sheetData[incrementedIndex];
            const projectIdValue = String(row[keys.project_id]).toLowerCase();
            const poNameValue = String(row[keys.po_name]).toLowerCase();

            if (projectIdValue === String(po.project_id).toLowerCase() && poNameValue === po.po_name.toLowerCase()) {
                rowsToDelete.push(incrementedIndex);
            }
        }

        return rowsToDelete
    }


}

function testDeleteByPo() {
    let appForEditedUploadedSheet = new App(CHINA_PRODUCTION_SPREADSHEET_ID, CHINA_PRODUCTION_UPLOADED_SHEET_NAME, CHINA_PRODUCTION_UPLOADED_SHEET_ID, URL_STAGING)
    let fake_po = new Po('R0026', 'X1585', 'JUANCHO', '77777', null, null, '')

    Logger.log(fake_po)

    appForEditedUploadedSheet.baseRepository.getRowsForMatchingPo(fake_po)
}