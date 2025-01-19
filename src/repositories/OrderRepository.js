class OrderRepository {

    /**
     * @param {Repository} baseRepository
     */
    constructor(baseRepository) {
        this.baseRepo = baseRepository
    }

    /**
     * @param {Po[]} pos
     * @param {Order[]} orders
     * @return {Order[]}
     */
    getOrdersByPo(pos, orders = []) {
        let rows = this.baseRepo.readSheetData();

        let combinedIndexes = pos.reduce((accumulator, po) => {
            return accumulator.concat(po.indexes);
        }, []);

        let units = Unit.mapList(rows)
            .filter(unit => unit !== null)
            .filter(unit => combinedIndexes.includes(unit.index))

        let shipments = Shipment.mapList(rows)
            .filter(ship => ship !== null)
            .filter(ship => combinedIndexes.includes(ship.index))

        let addresses = Address.mapList(rows)
            .filter(address => address !== null)
            .filter(address => combinedIndexes.includes(address.index))


        pos.forEach(po => {
            orders.push(
                new Order(
                    po,
                    units.filter(unit => po.indexes.includes(unit.index)),
                    shipments.filter(ships => po.indexes.includes(ships.index) || ships.po_name === po.po_name),
                    addresses.filter(address => po.indexes.includes(address.index)),
                )
            )
        })

        return orders
    }
}