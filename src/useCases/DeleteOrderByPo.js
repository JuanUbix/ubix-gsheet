class DeleteOrderByPo {
    /**
     * @constructor
     * @param {PoRepository} pos
     * @param {UnitsRepository} units
     * @param {ShipmentRepository} shipments
     * @param {StreetRepository} addresses
     */
    constructor(pos, units, shipments, addresses) {
        this.pos = pos
        this.units = units
        this.shipments = shipments
        this.addresses = addresses
    }

    /**
     *
     * @param {Po} po
     */
    execute(po) {
        this.pos.deleteByPo(po)
    }

}