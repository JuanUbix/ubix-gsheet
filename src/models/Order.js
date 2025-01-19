class Order {
    /**
     * Creates an instance of the Shipments class.
     * @param {Po} po
     * @param {Unit[]} units
     * @param {Shipment[]} shipments
     * @param {Address[]} addresses
     */
    constructor(po, units, shipments, addresses) {
        this.po = po
        this.units = units
        this.shipments = shipments
        this.addresses = addresses
    }

    /**
     * Returns a new order instance with only confirmed units and valid shipments.
     *
     * @returns {Order|null} A new Order instance with filtered units and shipments.
     */
    buildProductionOrder() {
        const confirmedUnits = this.units.filter(unit => unit.isConfirmed());

        const validShipments = this.shipments.filter(shipment => shipment.isShipped());

        if (this.po !== null && (confirmedUnits.length > 0 || validShipments.length > 0)) {
            return new Order(this.po, confirmedUnits, validShipments, this.addresses);
        } else {
            return null
        }
    }
}