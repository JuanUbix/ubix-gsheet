function getUnitsByPo(po_name = "121223RL") {
    let app = new App()
    let units = app.getUnits()

    units = units.filter(unit => unit.po_name === po_name)

    Logger.log(units)
}

function getOrdersByDealer(dealerId = "R0017") {
    let app = AppFactoryService.create(CHINA_DEVELOPMENT_SPREADSHEET_ID, UPLOADED_SHEET_NAME)

    return app.getOrdersByDealerId().execute(dealerId)
}

function deletePo() {
    let app = new App()
}