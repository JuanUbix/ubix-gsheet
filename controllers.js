async function exportOrdersUnderProduction() {
    let app = new App(
        CHINA_PRODUCTION_SPREADSHEET_ID,
        CHINA_PRODUCTION_UPLOADED_SHEET_NAME,
        CHINA_PRODUCTION_UPLOADED_SHEET_ID,
        URL_LIVE,
        null
    )

    await app.run()
}

async function exportOrdersUnderProductionSTAGING() {
    let app = new App(
        CHINA_PRODUCTION_SPREADSHEET_ID,
        CHINA_PRODUCTION_TEST_SHEET_NAME,
        CHINA_PRODUCTION_TEST_SHEET_ID,
        URL_LIVE,
        null
    )

    await app.run()
}

async function exportOrdersUnderProductionDevelopment() {

    let app = new App(
        CHINA_DEVELOPMENT_SPREADSHEET_ID,
        TEST_SHEET_NAME,
        TEST_SHEET_ID,
        URL_DEVELOPMENT_JP,
        null
    )

    await app.run()
}

async function exportTest() {
    let app = new App(
        CHINA_PRODUCTION_SPREADSHEET_ID,
        CHINA_PRODUCTION_TEST_SHEET_NAME,
        CHINA_PRODUCTION_TEST_SHEET_ID,
        URL_STAGING,
        null
    )
    await app.run()
}

async function exportToLive() {
    let app = new App(
        CHINA_PRODUCTION_SPREADSHEET_ID,
        CHINA_PRODUCTION_MIGRATION_SHEET_NAME,
        CHINA_PRODUCTION_MIGRATION_SHEET_ID,
        URL_LIVE,
        null
    )
    await app.run()
}

async function exportToStaging() {
    let app = new App(
        CHINA_PRODUCTION_SPREADSHEET_ID,
        CHINA_PRODUCTION_REPORT_EXAMPLE_SHEET_NAME,
        REPORT_EXAMPLE_ID,
        URL_STAGING,
        null
    )
    await app.run()
}
