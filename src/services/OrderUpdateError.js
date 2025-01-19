class OrderUpdateError extends OrderProcessingError {
    /**
     * @constructor
     * @param {string} message
     * @param {string} poCode
     */
    constructor(message, poCode) {
        super(message,poCode);
        this.eventType = OrderProcessingErrors.ORDER_UPDATING_ERROR
    }

    /**
     * Converts the error into a standardized webhook payload.
     * @return {object} Webhook payload containing error details.
     */
    toPayload() {
        let payload = super.toPayload();
        payload.error.eventType = this.eventType
        return payload
    }
}