window.onload = () => {
    setDateTime();
    loadData();

    // Focus on search input
    const search = document.querySelector('input');
    
    search.focus();
    search.value = "";
    search.oninput = event => engineHandler(event);
    search.onkeyup = event => searchHandler(event);
    search.onkeydown = event => engineBackspaceHandler(event);
    
    // Update date and time every second
    setInterval(() => {
        setDateTime();
    }, 1000);
}


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
  
    if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }

    return time.join('');
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

    document.getElementsByTagName('h4')[0].innerText = formatted;
}


/**
 * 
 */
 async function loadData() {
    const { applications } = await (await fetch('/data/applications.json')).json();
    const { bookmarks } = await (await fetch('/data/bookmarks.json')).json();
    const { profile } = await (await fetch('/data/profile.json')).json();

    loadProfile(profile);
    loadApplications(applications);
    loadBookmarks(bookmarks);
}


/**
 * 
 * @param {*} applications 
 */
function loadApplications(applications) {
    const list = document.querySelector('.applications');

    if (applications.length === 0) {
        return list.innerHTML = `<div class="subtext">You don't have any applications...</div>`;
    }

    applications.forEach(application => addApplication(application));
}


/**
 * 
 * @param {*} application 
 */
function addApplication(application) {
    const list = document.querySelector('.applications');
    const { name, description, url, icon, interval } = application;

    let { protocol, port } = new URL(url);

    if (!port) {
        if (protocol.endsWith('p:')) port = 80;
        if (protocol.endsWith('s:')) port = 443;
    }

    list.innerHTML += `
        <a class="item timeout col" id="${url}" href="${url}">
            <div class="item-top">
                <i class="item-icon ph-${icon}-bold"></i>
                <div class="item-title">${name}</div>
            </div>
            <div class="item-bottom">
                <div class="item-status"></div>
                <div class="item-description">${description}</div>
                <div class="item-port">/${port}</div>
            </div>
        </a>
    `;

    // Initally check status
    checkStatus(url);

    // Set timer to check status, default is 10 seconds
    setInterval(() => {
        checkStatus(url);
    }, (interval || 5) * 1000);
}


/**
 * 
 * @param {*} url 
 */
 function checkStatus(url) {
    const controller = new AbortController();
    const timeout = 2000; // 2 second timeout for all requests 

    // Set timeout for the fetch request
    setTimeout(() => controller.abort(), timeout);

    // Attempt to get a response from endpoint
    fetch(url, { mode: 'no-cors', signal: controller.signal }).then(() => {
        const item = document.getElementById(url);

        item.classList.remove('timeout');
        item.classList.remove('down');
        item.classList.add('up');
    }).catch(() => {
        const item = document.getElementById(url);

        item.classList.remove('timeout');
        item.classList.remove('up');
        item.classList.add('down');
    });
}


/**
 * 
 * @param {*} bookmarks 
 */
function loadBookmarks(bookmarks) {
    const list = document.querySelector('.bookmarks');
   
    if (bookmarks.length === 0) {
        return list.innerHTML += `<div class="subtext">You don't have any bookmarks...</div>`;
    }

    bookmarks.forEach(category => {
        const { name, links } = category;

        // Create category
        addBookmarkCategory(name);

        links.forEach(link => {
            addBookmarkLink(link, name);
        });
    });
}


/**
 * 
 * @param {*} category 
 */
function addBookmarkCategory(category) {
    const list = document.querySelector('.bookmarks');

    list.innerHTML += `
        <div class="col-3" id="${category}">
            <h3>${category}</h3>	
        </div>
    `;
}


/**
 * 
 * @param {*} link 
 * @param {*} category 
 */
function addBookmarkLink(link, category) {
    const list = document.getElementById(category);
    const { name, url, icon } = link;

    list.innerHTML += `
        <a class="item bookmark col" id="${url}" href=${url}>
            <div class="item-top">
                <i class="item-icon ph-${icon}"></i>
                <div class="item-title">${name}</div>
            </div>
        </a>
    `;
}


/**
 * 
 * @param {*} user 
 */
 function loadProfile(profile) {
    const username = document.querySelector('h1').querySelector('span');
    const { name, theme } = profile;

    setTheme(theme);
    username.innerText = name;
}


/**
 * 
 * @param {*} theme 
 */
 function setTheme(theme) {
    const page = document.getElementsByTagName('html')[0];

    page.classList.add('theme-' + theme);
}


const PREFIXES = {
    'g:': ['GitHub', 'https://github.com/search?q='],
    'r:': ['Reddit', 'https://www.reddit.com/search?q='],
    'd:': ['DuckDuckGo', 'https://duckduckgo.com/?q='],
    'y:': ['YouTube', 'https://www.youtube.com/results?search_query='],
};


/**
 * 
 * @param {*} search 
 */
let currentEngine;

function engineHandler(event) {
    const engine = document.querySelector('.engine');
    const search = event.target;

    // Capture all key presses and look for prefix's
    if (search.value.length > 0) {
        if (PREFIXES[search.value]) {
            engine.innerText = PREFIXES[search.value][0];
            engine.classList.remove('hidden');

            currentEngine = search.value;
            search.value = "";
        }
    }
}


/**
 * 
 * @param {*} event 
 */
function searchHandler(event) {
    const search = event.target;

    // If the enter key is pressed to start search
    if (event.key === 'Enter') {
        const url = getSearchQuery();

        if (url && search.value) loadPage(url, search.value);
    }
}


/**
 * 
 * @param {*} event 
 */
function engineBackspaceHandler(event) {
    const engine = document.querySelector('.engine');
    const search = event.target;

    // If the backspace key is pressed and there is no text
    if (event.key === 'Backspace' && !event.ctrlKey && search.value.length === 0) {
        engine.classList.add('hidden');
    }
}


/**
 * 
 * @param {*} search
 * @returns {*}
 */
function getSearchQuery() {
    return PREFIXES[currentEngine] ? PREFIXES[currentEngine][1] : 'https://www.google.com/search?q=';
}


/**
 * 
 * @param {*} query 
 * @param {*} term 
 */
function loadPage(query, term) {
    window.location.href = query + term;
}