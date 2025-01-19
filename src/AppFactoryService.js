class AppFactoryService {

    /**
     * @constructor
     * @param {string} spreadsheetId
     * @param {string} sheet
     * @return {App}
     * */
    static create(spreadsheetId, sheet = UPLOADED_SHEET_NAME) {
        return new App(
        spreadsheetId,
        sheet,
        SheetIds.fromSheet(sheet),
        UrlFactory.fromSpreadSheetId(spreadsheetId),
        null
        )
    }
}