class OrderProcessingError extends Error {
    /**
     * @constructor
     * @param {string} message
     * @param {string} poCode
     */
    constructor(message, poCode) {
        super(message);
        this.poCode = poCode
        this.at = new Date().getTime()
    }

    /**
     * Converts the error into a standardized webhook payload.
     * @return {object} Webhook payload containing error details.
     */
    toPayload() {
        return {
            error: {
                message: this.message,
                at: this.at,
                details: {
                    po_code: this.poCode,
                }
            }
        };
    }
}

const OrderProcessingErrors = {
    ORDER_UPDATING_ERROR : 'ORDER_UPDATING_ERROR'
}