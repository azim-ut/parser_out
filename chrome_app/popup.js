console.log('This is a popup!');
const tabsUrl = [
    'https://*.leroymerlin.ru/*',
]

const domains = [
    'https://spb.leroymerlin.ru/',
    // 'https://pskov.leroymerlin.ru/',
]

function saveName(){
    let name = document.getElementById("BotNameText").value;
    chrome.storage.local.set({name: name});
}

function fetchName(){
    chrome.storage.local.get("name").then(data => {
        document.getElementById("BotNameText").value = data.name;
        httpGetAsync("https://proftrud.ru/parser/api/agents/leroy/report/agent/" + data.name, (response) => {
            let root = document.getElementById("ReportPlate");
                root.innerHTML = "";
            let list = JSON.parse(response);
            list.forEach(row => {
                let rowNode = document.createElement("div");
                    rowNode.setAttribute("class", "grid grid123")
                let rowColumnTotal = document.createElement("div");
                let rowColumnRate = document.createElement("div");
                let rowColumnTm = document.createElement("div");

                rowColumnTotal.textContent = row.totalProcessed;
                rowColumnRate.textContent = Math.round(row.perSec*1000)/1000 + "/sec";
                rowColumnTm.textContent = row.tm;

                rowNode.append(rowColumnTotal);
                rowNode.append(rowColumnRate);
                rowNode.append(rowColumnTm);

                root.append(rowNode);
            })
        })
        httpGetAsync("https://proftrud.ru/parser/api/agents/leroy/report/last/" + data.name, (response) => {
            let root = document.getElementById("LastRecordPlate");
                root.innerHTML = "";
            let row = JSON.parse(response);
                let rowNode = document.createElement("div");
                    rowNode.setAttribute("class", "grid grid221")
                let rowColumnAssigned = document.createElement("div");
                let rowColumnProcessed = document.createElement("div");
                let rowColumnLink = document.createElement("div");

                let link = document.createElement("a");
                    link.setAttribute("href", row.link);
                    link.setAttribute("target", "_blank");
                    link.textContent = "Link";
                    rowColumnLink.append(link);

                rowColumnAssigned.textContent = row.assigned;
                rowColumnProcessed.textContent = row.processed;

                rowNode.append(rowColumnAssigned);
                rowNode.append(rowColumnProcessed);
                rowNode.append(rowColumnLink);

                root.append(rowNode);
        })
    })
}
fetchName();
document.getElementById("BotNameSubmit").addEventListener("click", saveName);

function saveCatalogsLinks(){
    console.log(1);
    chrome.tabs.query({currentWindow: true, active: true}).then(tabs => {
        let tab = tabs[0];

        console.log(2);
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (items) => {

                console.log(3);
                let links = [];
                let elements = document.getElementsByTagName('a');
                for(let i=0; i<elements.length; i++){
                    let href = elements[i].href;
                    if(!href.includes("/catalogue") || links.indexOf(href) >= 0){continue;}
                    links.push(href);
                }
            }
        })
    })
}

function httpGetAsync(theUrl, callback)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Content-Type', 'application/json')
    xmlHttp.send();
}

/**
chrome.tabs.executeScript({
    code: 'performance.getEntriesByType("resource").map(e => e.name)',
}, data => {
    if (chrome.runtime.lastError || !data || !data[0]) return;
    const urls = data[0].map(url => url.split(/[#?]/)[0]);
    const uniqueUrls = [...new Set(urls).values()].filter(Boolean);
    Promise.all(
        uniqueUrls.map(url =>
            new Promise(resolve => {
                chrome.cookies.getAll({url}, resolve);
            })
        )
    ).then(results => {
        // convert the array of arrays into a deduplicated flat array of cookies
        const cookies = [
            ...new Map(
                [].concat(...results)
                    .map(c => [JSON.stringify(c), c])
            ).values()
        ];
        localStorage.setItem('cookies', JSON.stringify(cookies));
        // do something with the cookies here
        console.log(uniqueUrls, cookies);
    });
});
 */