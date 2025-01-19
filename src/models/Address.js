class Address {
    /**
     * Creates an instance of the Address class.
     * @param {string} unit_id - The unit ID.
     * @param {string} po_name - The PO name.
     * @param {string} street_address - The carrier name.
     * @param {number} index
     */
    constructor(unit_id, po_name, street_address, index) {
        this.unit_id = unit_id.toString().trim()
        this.po_name = po_name
        this.street_address = street_address
        this.index = index.toString().trim()
    }

    /**
     * Maps a single row to a Shipments object.
     * @param {Array} row - The row data from the sheet.
     * @return {Address}
     */
    static map(row) {
        if (row[keys.address] !== '' && row[keys.po_name] !== '' && row[keys.unit_id] !== '') {
            return new Address(
                row[keys.unit_id], //row[keys.project_id].toString().trim() + '-' + row[keys.po_name].toString().trim() + '-' + row[keys.unit_id].toString().trim(),
                row[keys.po_name].toString().trim(),
                row[keys.address],
                row[keys.unit_id]
            );
        } return null
    }

    /**
     * Maps an array of rows to an array of Shipments objects.
     * @param {Array<Array<string | number | Date>>} rows - The rows data from the sheet.
     * @return {Address[]} An array of Shipments instances.
     */
    static mapList(rows) {
        return rows.map(row => Address.map(row));
    }
}