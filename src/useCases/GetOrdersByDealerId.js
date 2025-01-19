/**
 * @constructor
 * @param {OrderRepository} orderRepository
 * @param {PoRepository} poRepository
 */
class GetOrdersByDealerId {
    constructor(orderRepository, poRepository) {
        this.orderRepository = orderRepository
        this.poRepository = poRepository
    }

    /**
     * @param {string} dealerId
     * @return {Order[]}
     */
    execute(dealerId) {
        let pos = this.poRepository.getByDealerId(dealerId)
        return this.orderRepository.getOrdersByPo(pos)
    }
}