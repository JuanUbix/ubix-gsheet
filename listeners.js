function createOnChangeTrigger() {
    const spreadsheetIds = [        
        CHINA_STAGING_SPREADSHEET_ID,
        CHINA_DEVELOPMENT_SPREADSHEET_ID,        
        THAILAND_STAGING_SPREADSHEET_ID,
        THAILAND_DEVELOPMENT_SPREADSHEET_ID,
    ];

    spreadsheetIds.forEach(id => {
        const spreadsheet = SpreadsheetApp.openById(id);
        ScriptApp.newTrigger('onChangeListener')
            .forSpreadsheet(spreadsheet)
            .onChange()
            .create();
    });
}

async function onChangeListener(e) {
    let lock = LockService.getScriptLock();

    if (lock.tryLock(60000)) {
        try {
            let spreadsheet = e.source;
            let spreadSheetId = spreadsheet.getId()
            let sheet = spreadsheet.getActiveSheet();
            let sheetId = sheet.getSheetId().toString()
            let sheetName = sheet.getName()

            if (![CHINA_DEVELOPMENT_SPREADSHEET_ID, CHINA_STAGING_SPREADSHEET_ID, THAILAND_DEVELOPMENT_SPREADSHEET_ID, THAILAND_STAGING_SPREADSHEET_ID].includes(spreadSheetId)) return

            if (![EDIT_UPLOADED_SHEET_ID].includes(sheetId)) return
            const cache = CacheService.getScriptCache();

            Logger.log('PERFORMING ACTIONS ON ' + sheetName + ' ' + sheetId)
            let appForEditedUploadedSheet = AppFactoryService.create(spreadSheetId, sheetName)

            const poName = sheet.getRange("H2").getValue();
            const poProjectId = sheet.getRange("G2").getValue();
            const poCode = `${poProjectId}-${poName}`;
            cache.put('po_code', JSON.stringify(poCode), 600);

            Logger.log("LOGING CACHE VALUE ")
            Logger.log(cache.get('po_code'))

            function tryToRemoveProtectionFromUploadedSheet(uploadedSheetProtection) {
                try {
                    uploadedSheetProtection.remove();
                } catch (e) {
                    Logger.log("Error removing protection: " + e);
                }
            }

            spreadsheet = SpreadsheetApp.openById(spreadSheetId.toString());
            const uploadedSheet = spreadsheet.getSheetByName(UPLOADED_SHEET_NAME);

            const me = Session.getEffectiveUser();
            const uploadedSheetProtection = uploadedSheet.protect().setDescription('Script is running - Manual editing disabled');
            uploadedSheetProtection.addEditor(me);
            uploadedSheetProtection.setWarningOnly(false);

            try {
                let rebuiltOrder = appForEditedUploadedSheet.updateOrder().execute(spreadSheetId.toString());

                if (rebuiltOrder.po) {
                    Logger.log("TRYING TO DELETE ORDER IN UPLOADED_EDIT SHEET " + rebuiltOrder?.po?.po_name);
                    appForEditedUploadedSheet.deleteOrderByPo().execute(rebuiltOrder.po);

                    Logger.log("WRITING ORDER w units length: " + rebuiltOrder.units.length);
                    appForEditedUploadedSheet.writeOrder().execute(rebuiltOrder, spreadSheetId, UPLOADED_SHEET_NAME);
                }

            } catch (e) {
                Logger.log(e);
            } finally {
                tryToRemoveProtectionFromUploadedSheet(uploadedSheetProtection);
            }

        } finally {
            lock.releaseLock();
        }
    }
}

