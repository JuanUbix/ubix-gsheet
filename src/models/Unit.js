/**
 * Represents a Unit.
 * @constructor
 * @param {string} index - The index or unique identifier of the unit.
 * @param {string} rep_id - The representative ID.
 * @param {string} dealer_id - The dealer ID.
 * @param {string} merchandiser - The merchandiser ID.
 * @param {string} po_name - The PO name.
 * @param {string} sku - The SKU.
 * @param {string} quantity - The quantity.
 * @param {string} size - The size.
 * @param {Date} preproduction_approval_date - The preproduction approval date.
 * @param {Date} created_at - The preproduction approval date.
 * @param {string} comments - Any comments.
 * @param {string|null} option - The option.
 * @param {string|null} custom_name - The custom name.
 * @param {string|null} custom_position - The custom position.
 * @param {string|null} custom_number - The custom number.
 * @param {string|null} notes - Any additional notes.
 * @param {string|null} production_number - Any additional notes.
 * @param {number} index
 */
class Unit {
    constructor(
        unit_id,
        rep_id,
        dealer_id,
        po_name,
        merchandiser,
        sku,
        quantity,
        size,
        preproduction_approval_date,
        comments,
        created_at,
        requested_shipdate,
        requested_delivery,
        option = null,
        custom_name = null,
        custom_number = null,
        custom_position = null,
        notes = null,
        production_number = null,
        index
    ) {
        this.id = this.processId(unit_id);
        this.rep_id = rep_id;
        this.dealer_id = dealer_id;
        this.po_name = po_name;
        this.merchandiser = merchandiser;
        this.sku = sku;
        this.quantity = quantity;
        this.size = size;
        this.preproduction_approval_date = DateServices.formatDateToCT(preproduction_approval_date);
        this.comments = comments;
        this.confirmation_date = DateServices.formatDateToCT(created_at);
        this.requested_shipdate = DateServices.formatDateToCT(requested_shipdate);
        this.requested_delivery = DateServices.formatDateToCT(requested_delivery);
        this.option = option;
        this.custom_name = custom_name;
        this.custom_position = custom_position;
        this.custom_number = custom_number;
        this.notes = notes;
        this.production_number = production_number;
        this.index = index.toString().trim()
    }

    /**
     * If unit id (sheet index) comes as defined in server with po_name and project_id, it only takes(
     * @param {string} unit_id
     * @return {string}
     */
    processId(unit_id) {
        /*const idParts = unit_id.split('-');
        if (unit_id.length > 4 && idParts.length >= 2) {
            return idParts[idParts.length - 1];
        } else {
            return unit_id.toString().trim();
        }*/
        return unit_id.toString().trim();
    }

    /**
     * Generates a unique key for a unit based on the fields used for comparison.
     * @return {string} - The unique key representing the unit.
     */
    generateUnitKey() {
        return `${this.option || ''}_${this.custom_name || ''}_${this.custom_position || ''}_${this.custom_number || ''}_${this.size || ''}_${this.sku || ''}`;
    }

    /**
     * Maps a single row to a Unit object if valid.
     * @param {Array} row - The row data from the sheet.
     * @return {Unit|null} A new Unit instance or null if invalid.
     */
    static map(row) {
        function parseUnitId() {
            try {
                let unitIdParts = row[keys.unit_id].split('-')
                if (unitIdParts.length >= 2) {
                    return row[keys.unit_id]
                } else {
                    return row[keys.project_id].toString().trim() + '-' + row[keys.po_name].toString().trim() + '-' + row[keys.unit_id].toString().trim();
                }
            } catch (e) {
                Logger.log(e)
                Logger.log(row[keys.unit_id])
                return row[keys.project_id].toString().trim() + '-' + row[keys.po_name].toString().trim() + '-' + row[keys.unit_id].toString().trim();
            }
        }

        if (Unit.isValidUnit(row)) {
            return new Unit(
                parseUnitId(),
                row[keys.rep_id],
                row[keys.dealer_id],
                row[keys.project_id] + '-' + row[keys.po_name],
                row[keys.merchandiser],
                row[keys.sku],
                row[keys.quantity],
                row[keys.size],
                row[keys.preproduction_approval_date],
                row[keys.comments],
                row[keys.created_at],
                row[keys.requested_shipdate],
                row[keys.requested_delivery],
                row[keys.option],
                row[keys.custom_name],
                row[keys.custom_number],
                row[keys.custom_position],
                row[keys.notes],
                row[keys.production_number],
                row[keys.unit_id],
            );
        } else {
            return null;
        }
    }

    /**
     * Maps an array of rows to an array of Unit objects.
     * @param {Array<Array<string | number>>} rows - The rows data from the sheet.
     * @return {Unit[]} An array of Unit instances.
     */
    static mapList(rows) {
        return rows.map(row => Unit.map(row));
    }

    /**
     * Validates if the essential fields are present and not empty in a row.
     * @param {Array} row - The row data from the sheet.
     * @return {boolean} True if the essential fields are present and not empty.
     */
    static isValidUnit(row) {
        return (
                ( (row[keys.unit_id]) && (row[keys.unit_id] !== '') && (row[keys.unit_id] !== undefined))
                && (row[keys.rep_id] || row[keys.dealer_id])
                && (row[keys.po_name] && row[keys.sku])
                && row[keys.quantity]              
                && (row[keys.created_at] === null || DateServices.isValidDate(row[keys.created_at]))
                /*&& row[keys.production_number]*/
            /*
            (row[keys.created_at] === null || DateServices.isValidDate(row[keys.created_at])) &&
            (row[keys.requested_delivery] === null || DateServices.isValidDate(row[keys.requested_delivery])) &&
            (row[keys.requested_shipdate] === null || DateServices.isValidDate(row[keys.requested_shipdate]))*/
        )
    }

    isConfirmed() {
        return this.production_number && this.merchandiser
    }
}
