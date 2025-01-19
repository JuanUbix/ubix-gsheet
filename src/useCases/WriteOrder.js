class WriteOrder {
    constructor() { }

    /**
     * @param {Order} order
     * @param {string} spreadsheetId
     * @param {string} sheetName
     */
    execute(order, spreadsheetId, sheetName) {

        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        const sheet = spreadsheet.getSheetByName(sheetName);

        let rows = this.formatOrderIntoRows(order);

        if (!sheet) {
            Logger.log(`Sheet with name "${sheetName}" not found.`);
            return;
        }

        const indexColumnValues = sheet.getRange('A:A').getValues();
        let firstEmptyRow = indexColumnValues.findIndex(row => row[0] === '') + 1;

        if (firstEmptyRow === 0) firstEmptyRow = indexColumnValues.length + 1;

        const startColumn = 1; // A corresponds to column 1
        const range = sheet.getRange(firstEmptyRow, startColumn, rows.length, rows[0].length);

        range.setValues(rows)
            .setFontWeight('bold')
            .setBackground('#FFFF00'); // Sets the background color to yellow
    }

    /**
     *
     * @param {Order}order
     * @return {Array[]}
     */
    formatOrderIntoRows(order) {
        return order.units.map(unit => {
            let matchingShipment = order.shipments.find(it => it.index === unit.index)
            let matchingAddress = order.addresses.find(it => it.index === unit.index)
            let po = order.po
            return [
                unit.index,
                unit.merchandiser,
                po.rep_name,
                po.rep_id,
                po.dealer_name,
                po.dealer_id,
                po.po_name,
                po.project_id,
                unit.sku,
                unit.option,
                unit.production_number,
                unit.size,
                unit.quantity,
                unit.custom_name,
                unit.custom_number,
                unit.custom_position,
                unit.notes,
                false, //HIGH PRIORITY
                po.getFormattedCreatedAt(),
                unit.comments,
                unit.preproduction_approval_date,
                '',//PREPRODUCTION SAMPLE APPROVAL STATUS
                this.getRequestedShipDateByPo(po),//unit.requested_shipdate,
                this.getRequestedDeliveryDateByPo(po), //unit.requested_delivery,
                po.getFormattedEventDate(),
                '', //APPROVED BY
                '', //FAST VESSEL
                matchingShipment?.shipment_date,
                matchingShipment?.expected_delivery_date,
                matchingShipment?.actual_delivery_date,
                matchingAddress?.street_address,//order.addresses.find(it => it.index === unit.index)?.street_address,
                '', //SECOND COMMENTS
                '', //UBIX COMU COL
                matchingShipment?.carrier === CarrierServices.FEDEX ? matchingShipment?.tracking_code : '',
                '', //DO NOT DELETE THIS COLUMN,
                matchingShipment?.carrier === CarrierServices.DHL ? matchingShipment?.tracking_code : '',
                matchingShipment?.box,
                matchingShipment?.carrier === CarrierServices.UPS_AIR ? matchingShipment?.tracking_code : '',
            ];
        });
    }

    /**
     * Calculates the requested ship date for a given Po.
     * If event_date is not set, it adds 21 days to created_at.
     * @param {Po} po - The Po object.
     * @return {string} The formatted requested ship date in M/D/YYYY format or an empty string.
     */
    getRequestedShipDateByPo(po) {
        if (!po.getFormattedEventDate() && !po.getFormattedCreatedAt()) return '';
        let requestedDeliveryDate;
        if (!po.getFormattedEventDate()) {
            const createdAt = po.getFormattedCreatedAt();
            requestedDeliveryDate = new Date(createdAt.getTime() + 21 * 24 * 60 * 60 * 1000); // Add 21 days
        } else {
            requestedDeliveryDate = new Date(po.getFormattedEventDate().getTime()); // Clone the event_date
        }

        return requestedDeliveryDate.toLocaleDateString('en-US');
    }

    /**
     * Calculates the requested delivery date for a given Po.
     * If event_date is not set, it adds 21 days to created_at.
     * Then subtracts 7 days from the result.
     * @param {Po} po - The Po object.
     * @return {string} The formatted requested delivery date in M/D/YYYY format or an empty string.
     */
    getRequestedDeliveryDateByPo(po) {
        if (!po.getFormattedEventDate() && !po.getFormattedCreatedAt()) return '';
        let requestedDeliveryDate;
        if (!po.getFormattedEventDate()) {
            const createdAt = po.getFormattedCreatedAt();
            requestedDeliveryDate = new Date(createdAt.getTime() + 21 * 24 * 60 * 60 * 1000); // Add 21 days
        } else {
            requestedDeliveryDate = new Date(po.getFormattedEventDate().getTime()); // Clone the event_date
        }

        requestedDeliveryDate.setDate(requestedDeliveryDate.getDate() - 7);

        return requestedDeliveryDate.toLocaleDateString('en-US');
    }
}