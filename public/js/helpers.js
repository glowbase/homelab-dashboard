const DATE_TIME = {
    days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
};


/**
 * 
 * @param {*} date 
 * @returns 
 */
function formatDate(date) {
    if (date === 1 || date.toString()[1] == 1) return date + 'st';
    if (date === 2 || date.toString()[1] == 2) return date + 'nd';
    if (date === 3 || date.toString()[1] == 3) return date + 'rd';
    
    return date + 'th';
}


/**
 * 
 * @param {*} time 
 * @returns 
 */
function convertTime(time) {
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length < 1) return;

    time = time.slice (1);
    time[5] = +time[0] < 12 ? ' AM' : ' PM';
    time[0] = +time[0] % 12 || 12;
    
    return time.join ('');
}