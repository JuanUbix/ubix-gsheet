const UrlFactory = {
    fromSpreadSheetId(spreadSheetId) {
        switch (spreadSheetId) {
            case CHINA_DEVELOPMENT_SPREADSHEET_ID:
            case THAILAND_DEVELOPMENT_SPREADSHEET_ID:
                return URL_DEVELOPMENT_JP;
            case CHINA_STAGING_SPREADSHEET_ID:
            case THAILAND_STAGING_SPREADSHEET_ID:
                return URL_STAGING;
            case THAILAND_PRODUCTION_SPREADSHEET_ID:
            case CHINA_PRODUCTION_SPREADSHEET_ID:
                return URL_LIVE;
        }
    }
};