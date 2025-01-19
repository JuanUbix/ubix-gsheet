/**
 * @constructor
 * @param {string} api_endpoint
 */
class WebHookService {
    constructor(api_endpoint) {
        this.api_endpoint = api_endpoint
    }

    /**
     * @constructor
     * @param {OrderProcessingError} error
     */
    notifyError(error) {
        let action = 'report-error'

        let data = {
            data: error.toPayload()
        };

        let options = {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify(data),
        };
        Logger.log("AIMING DEV SERVER")
        Logger.log(`${this.api_endpoint}/${action}`)
        try {
            UrlFetchApp.fetch(`${this.api_endpoint}/${action}`, options);
        } catch (e) {
            Logger.log(e);
        }
    }
}
