/**
 * Represents a Po.
 * @constructor
 * @param {string} rep_id
 * @param {string} dealer_id
 * @param {string} po_name
 * @param {string} project_id
 * @param {Date} created_at
 * @param {Date} event_date
 * @param {number|string} unit_id
 * @param {string} unit_id
 * @param {string} unit_id
 */
class Po {
    constructor(rep_id, dealer_id, po_name, project_id, created_at, event_date, unit_id, rep_name = "", dealer_name = "") {
        this.rep_id = rep_id.toString().trim()
        this.dealer_id = dealer_id.toString().trim()
        this.po_name = po_name.toString().trim()
        this.po_code = `${project_id.toString().trim()}-${po_name.toString().trim()}`
        this.project_id = project_id.toString().trim()
        this.created_at = DateServices.formatToTimestamp(created_at)
        this.event_date = DateServices.formatToTimestamp(event_date)
        this.rep_name = rep_name
        this.dealer_name = dealer_name
        this.indexes = []
        this.factory = FACTORY
        this.addIndex(unit_id)
    }

    addIndex(index) {
        this.indexes = [...this.indexes, index.toString().trim()]
    }

    /**
     * Formats the created_at date to 'mm/dd/yyyy' format if not null.
     * @return {Date|null} Formatted date string or null if created_at is not set.
     */
    getFormattedCreatedAt() {
        if (!this.created_at) return null;
        let timestampMs = Number(this.created_at) * 1000;
        return new Date(timestampMs)
    }

    getFormattedEventDate() {
        if (!this.event_date || this.event_date === '') return null;
        let timestampMs = Number(this.event_date) * 1000;
        return new Date(timestampMs)
    }

    /**
     * Maps a single row to a Po object.
     * @param {Array<string | number>} row - The row data from the sheet.
     * @return {Po} A new Po instance.
     */
    static map(row ) {
        if ( Po.isValidPo(row)) {
            return new Po(
                row[keys.rep_id],
                row[keys.dealer_id],
                row[keys.po_name],
                row[keys.project_id],
                row[keys.created_at],
                row[keys.event_date],
                row[keys.unit_id],
                row[keys.rep_name],
                row[keys.dealer_name],
            );
        } else return null
    }

    /**
     * Validates if the required fields in a row are present and correctly formatted.
     * @param {Array<string|number|Date>} row - The row data from the sheet.
     * @return {boolean} True if the row is valid.
     */
    static isValidPo(row) {
        const hasValidRepOrDealerId = (
            (row[keys.rep_id] && row[keys.rep_id].toString().trim().length >= 1) ||
            (row[keys.dealer_id] && row[keys.dealer_id].toString().trim().length >= 1)
        );
        const hasValidPoName = row[keys.po_name] && row[keys.po_name].toString().trim().length > 2;
        const hasValidCreatedAt = !row[keys.created_at] || DateServices.isValidDate(row[keys.created_at]);
        const hasValidEventDate = !row[keys.event_date] || DateServices.isValidDate(row[keys.event_date]);
        const hasValidUnitIdAndProjectId = row[keys.unit_id] !== '' && row[keys.project_id];
        
        return hasValidRepOrDealerId && hasValidPoName && hasValidCreatedAt && hasValidEventDate && hasValidUnitIdAndProjectId
    }

    /**
     * Maps an array of rows to an array of Po objects.
     * @param {Array<Array<string | number>>} rows - The rows data from the sheet.
     * @return {Po[]} An array of Po instances.
     */
    static mapList(rows) {
        return rows.map(row => Po.map(row));
    }

}

const UbixFactories = {
    CHINA: 'china',
    THAILAND: 'thailand',
    fromSpreadSheetId(spreadSheetId) {
        switch (spreadSheetId.toLowerCase()) {
            case CHINA_PRODUCTION_SPREADSHEET_ID:
            case CHINA_STAGING_SPREADSHEET_ID:
            case CHINA_DEVELOPMENT_SPREADSHEET_ID:
                return UbixFactories.CHINA;
            case THAILAND_PRODUCTION_SPREADSHEET_ID:
            case THAILAND_STAGING_SPREADSHEET_ID:
            case THAILAND_DEVELOPMENT_SPREADSHEET_ID:
                return UbixFactories.THAILAND;
            default:
                return UbixFactories.CHINA;
        }
    }

};

