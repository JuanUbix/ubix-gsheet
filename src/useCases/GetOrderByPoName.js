/**
 * @constructor
 * @param {OrderRepository} orderRepository
 * @param {PoRepository} poRepository
 * @param {UnitsRepository} unitRepository
 * @param {ShipmentRepository} shipmentRepository
 */
class GetOrderByPoName {
    constructor(orderRepository, poRepository, unitRepository, shipmentRepository) {
        this.orderRepository = orderRepository
        this.poRepository = poRepository
        this.unitRepository = unitRepository
        this.shipmentRepository = shipmentRepository
    }

    /**
     * @param {Po} po
     */
    execute(po) {
        try {
            let po_ = this.poRepository.getByProjectCode(po)
            if (po_) {
                let units = this.unitRepository.getByPo(po_)
                let shipments = this.shipmentRepository.getByPo(po_)

                return new Order(po_, units, shipments, [])
            } else  return null
        } catch (e) {
            Logger.log(e)
            return null
        }

    }
}