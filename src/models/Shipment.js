class Shipment {
    /**
     * Creates an instance of the Shipments class.
     * @param {string} unit_id - The unit ID.
     * @param {string} po_name - The PO name.
     * @param {string} carrier - The carrier name.
     * @param {string} tracking_code - The tracking code.
     * @param {Date} shipment_date - The shipment date.
     * @param {string} box - The box information.
     * @param {number} index
     * @param {Date} expected_delivery_date
     * @param {Date} actual_delivery_date
     */
    constructor(unit_id, po_name, carrier, tracking_code, shipment_date, box, index, expected_delivery_date = null, actual_delivery_date = null) {
        this.unit_id = unit_id.toString()
        this.po_name = po_name;
        this.carrier = carrier;
        this.tracking_code = tracking_code;
        this.shipment_date = DateServices.formatDateToCT(shipment_date);
        this.box = box;
        this.expected_delivery_date = DateServices.formatDateToCT(expected_delivery_date);
        this.actual_delivery_date = DateServices.formatDateToCT(actual_delivery_date)
        this.index = index.toString().trim()
        Logger.log(shipment_date)
        Logger.log(expected_delivery_date)
        Logger.log(actual_delivery_date)
    }

    /**
     * Validates if the essential fields for a shipment are present and not empty.
     * @param {Array} row - The row data from the sheet.
     * @return {boolean} True if the essential fields are valid, false otherwise.
     */
    static isValidShipment(row) {
      return row[keys.po_name] !== '' &&
          row[keys.po_name].toString().trim() !== '' &&
          row[keys.actual_shipdate] !== null && DateServices.isValidDate(row[keys.actual_shipdate]) &&
          (row[keys.fedex] !== null || row[keys.dhl] !== null || row[keys.ups] !== null || row[keys.ups_air] !== null)
    }

    /**
     * Maps a single row to a Shipments object.
     * @param {Array} row - The row data from the sheet.
     * @return {Shipment} A new Shipments instance.
     */
    static map(row) {
        if (Shipment.isValidShipment(row)) {
            const service = Shipment.selectFirstAvailableCarrier(row);
            return new Shipment(
                row[keys.unit_id], //row[keys.project_id].toString().trim() + '-' + row[keys.po_name].toString().trim() + '-' + row[keys.unit_id].toString().trim(),
                row[keys.po_name],
                service.carrier,
                service.code,
                row[keys.actual_shipdate],
                row[keys.box],
                row[keys.unit_id],
                row[keys.expected_delivery_date],
                row[keys.actual_delivery_date],
            );
        } else {
            return null
        }
    }

    /**
     * Maps an array of rows to an array of Shipments objects.
     * @param {Array<Array<string | number | Date>>} rows - The rows data from the sheet.
     * @return {Shipment[]} An array of Shipments instances.
     */
    static mapList(rows) {
        return rows.map(row => Shipment.map(row));
    }

    /**
     * Selects the first available carrier from the row data.
     * @param {Array} row - The row data from the sheet.
     * @return {{carrier: *, code: *}} The name of the first available carrier, or null if none.
     */
    static selectFirstAvailableCarrier(row) {
        const carrierOrder = [CarrierServices.FEDEX, CarrierServices.DHL, CarrierServices.UPS, CarrierServices.UPS_AIR];

        for (const carrier of carrierOrder) {
            if (row[keys[carrier]] && row[keys[carrier]].toString().trim() !== '') {
                return { carrier: carrier.toString(), code: row[keys[carrier.toString()]] };
            }
        }
        return { carrier: null, code: null };
    }

    isShipped() {
        return this.shipment_date && this.tracking_code && this.carrier
    }

}

const CarrierServices = {
    FEDEX: 'fedex',
    DHL: 'dhl',
    UPS: 'ups',
    UPS_AIR: 'ups_air'
};
