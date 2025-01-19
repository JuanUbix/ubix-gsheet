class DateServices {

    /**
     * Converts a timestamp to a Date object formatted as "mm/dd/yyyy".
     * @param {string} timestamp - The timestamp to convert.
     * @return {string} The formatted date string in "mm/dd/yyyy" format.
     */
    static formatTimestampToDateString(timestamp) {
        // Create a Date object from the timestamp
        if (!timestamp) return ''
        const date = new Date(parseInt(timestamp));

        // Extract month, day, and year
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        // Format the date as "mm/dd/yyyy"
        return `${month}/${day}/${year}`;
    }

    /**
     * Formats a Date object to a string in "MM/DD/YYYY" format.
     * Adjusts the date to New York timezone before formatting.
     * @param {Date} date - The Date object to format.
     * @return {string|null} The formatted date string.
     */
    static formatDate(date) {
        if (date === null || !(date instanceof Date) || isNaN(date)) {
            return null;
        }

        // Calculate New York timezone offset in hours
        // UTC-5 for standard time, UTC-4 for daylight saving time
        let nyOffset = -5; // Default to UTC-5
        if (date.getTimezoneOffset() > 300) { // Check if daylight saving is in effect
            nyOffset = -4;
        }

        // Adjust the date to New York timezone
        date.setHours(date.getHours() + date.getTimezoneOffset() / 60 - nyOffset);

        let day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }

    static formatToTimestamp(date) {
        if (date === null) return null;
        try {
            let date_ = Math.floor(new Date(date).getTime() / 1000)            
            if (isNaN(date_)) return null;
            return String(date_);
        } catch (e) {
          return null;
        }        
    }

    static convertToUTC(dateString) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
            return null;
        }

        // Parse the date in America/New_York timezone
        const [month, day, year] = dateString.split('/');
        const dateInNY = new Date(`${year}-${month}-${day}T00:00:00`);
        dateInNY.setMinutes(dateInNY.getMinutes() + dateInNY.getTimezoneOffset()); // Adjust for local timezone

        // Calculate New York timezone offset
        let nyOffset = -5 * 60; // UTC-5 for standard time
        if (dateInNY.toLocaleString('en-US', {timeZone: 'America/New_York'}).endsWith('AM')) {
            nyOffset = -4 * 60; // UTC-4 for daylight saving time
        }

        // Adjust the date to UTC
        const dateInUTC = new Date(dateInNY);
        dateInUTC.setMinutes(dateInNY.getMinutes() - nyOffset);

        // Format the UTC date
        let utcDay = ('0' + dateInUTC.getUTCDate()).slice(-2);
        const utcMonth = ('0' + (dateInUTC.getUTCMonth() + 1)).slice(-2);
        const utcYear = dateInUTC.getUTCFullYear();

        return `${utcMonth}/${utcDay}/${utcYear}`;
    }

    /**
     * Formats a Date object to a string in "MM/DD/YYYY" format considering USA time zone.
     * @param {Date} date - The Date object to format.
     * @param {string} timeZone - The USA time zone to consider.
     * @return {string|null} The formatted date string.
     */
    static formatUSTimeZoneDate(date, timeZone = 'America/New_York') {
        if (date === null || !(date instanceof Date) || isNaN(date)) {
            return null;
        }

        let usaDate = new Date(date.toLocaleString('en-US', {timeZone}));

        const day = ('0' + usaDate.getDate()).slice(-2);
        const month = ('0' + (usaDate.getMonth() + 1)).slice(-2);
        const year = usaDate.getFullYear();

        return `${month}/${day}/${year}`;
    }

    /**
     * Formats a local Date object to a string in "MM/DD/YYYY" format in Central Time (CT).
     * @param {Date} date - The local Date object to format.
     * @return {string|null} The formatted date string in CT.
     */
    static formatDateToCT(date) {
        const CENTRAL_TIME_ZONE = 'America/Chicago';
        return DateServices.formatUSTimeZoneDate(date, CENTRAL_TIME_ZONE);
    }

    /**
     * Checks if a given object is a valid Date and in the "MM/DD/YYYY" format.
     * @param {Date} dateInput - The Date object to validateInput.
     * @return {boolean} True if the dateInput is a valid Date object and in the "MM/DD/YYYY" format, false otherwise.
     */
    static isValidDate(dateInput = '\'11/10/2023') {
        if (typeof dateInput === 'string' && dateInput.charAt(0) === "'") {            
            dateInput = dateInput.slice(1)          
        }

        if (!(dateInput instanceof Date)) return false;
        const dateString = DateServices.formatDate(dateInput);
        let test =  /^(0[1-9]|1[0-2])\/([0-2][0-9]|3[0-1])\/[0-9]{4}$/.test(dateString);        
        return test
    }

}
