/**
 * @param {string} api_endpoint
 */
class ApiService {
    constructor(api_endpoint) {
        this.api_endpoint = api_endpoint
    }

    /**
     * @param {Order[]} orders
     * @param {string} source
     */
    requestUpdateOrders(orders, source) {
        const BATCH_SIZE = 100;

        Logger.log('Exporting from sheet_id: ' + source)

        for (let i = 0; i < orders.length; i += BATCH_SIZE) {
            const batch = orders.slice(i, i + BATCH_SIZE);
            try {
                this.updateOrders(batch, source);
            } catch (e) {
                Logger.log(e)
                Logger.log(batch)
            }
        }
    }

    /**
     * @param {Order[]} orders
     * @param {string} source
     */
    updateOrders(orders, source) {
        let action = [CHINA_PRODUCTION_UPLOADED_SHEET_ID, CHINA_PRODUCTION_TEST_SHEET_ID].includes(source) ?  'update_production_orders' : 'update_orders'

        let data = {
            action: action,
            orders: orders,
            source: source
          };

        let options = {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify(data),
        };

        try {
            UrlFetchApp.fetch(`${this.api_endpoint}/${action}`, options);
        } catch (e) {
            Logger.log(e);
        }
    }
}
