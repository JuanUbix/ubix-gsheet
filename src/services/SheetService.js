const SheetIds = {
    fromSheet(sheetName) {
        switch (sheetName) {
            case UPLOADED_SHEET_NAME:
                return UPLOADED_SHEET_ID
            case EDIT_UPLOADED_SHEET_NAME:
                return EDIT_UPLOADED_SHEET_ID
            default:
                throw new Error("Error building app for " + sheetName)
        }
    }
}