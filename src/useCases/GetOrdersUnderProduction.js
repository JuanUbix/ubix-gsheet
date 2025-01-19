/**
 * @constructor
 * @param {PoRepository} pos
 * @param {UnitsRepository} units
 * @param {ShipmentRepository} shipments
 * @param {StreetRepository} addresses
 */
class GetOrdersUnderProduction {
    constructor(pos, units, shipments, addresses) {
        this.pos = pos
        this.units = units
        this.shipments = shipments
        this.addresses = addresses
    }

    /**
     * @return {Order[]}
     */
    execute() {

    }
}