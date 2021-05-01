window.onload = () => {
    setDateTime();

    // Update date and time every minute
    setInterval(() => {
        setDateTime();
    }, 60000);
}


/**
 * 
 */
function setDateTime() {
    const d = new Date();

    const time = convertTime(`${d.getHours()}:${d.getMinutes()}`);
    const day = DATE_TIME.days[d.getDay()];
    const month = DATE_TIME.months[d.getMonth()];
    const date = formatDate(d.getDate());

    const formatted = `${time} ${day}, ${month} ${date}`;

    document.getElementsByTagName('h3')[0].innerText = formatted;
}