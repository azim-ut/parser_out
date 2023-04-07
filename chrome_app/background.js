const tabsUrl = [
	'https://*.leroymerlin.ru/*',
	'https://leroymerlin.ru/*',
	'https://spb.leroymerlin.ru/*',
	'https://pskov.leroymerlin.ru/*',
	'https://www.ozon.ru/*',
	'https://ozon.ru/*',
]

let CURRENT_LINK_ID = null;
const LINKS_LIMIT = 1;
const linksToParse = [];
let botName = "NO_NAME";
let lastUpload = new Date();
let ERROR_MODE = false;
function fetchName(){
	chrome.storage.local.get("name").then((data)=> {if(data.name){botName = data.name}})
}
function checkTab(){
	let now   = new Date();
	let sinceLastParse = (now.getTime() - lastUpload.getTime()) / 1000;
	ERROR_MODE = false;

	console.log("CHECK ERROR MODE: ", ERROR_MODE);
	chrome.tabs.query({url: tabsUrl}).then(tabs => {
		if (tabs.length === 0) {
			chrome.tabs.create({ url: "https://leroymerlin.ru", index: 0 });
		}else if(sinceLastParse > 30){
			const tab = tabs[0];
			chrome.tabs.update(tab.id, {url: "https://leroymerlin.ru"}).then((a, b) => {

			});
		}
	});
}

chrome.tabs.onUpdated.addListener((tabId, state, tab) => {
	if(state.status === 'complete'){
		chrome.tabs.query({url: tabsUrl}).then(tabs => {
			if(tabs.length > 0){
				const tab = tabs[0];

				if(tab.id !== tabId){
					return;
				}

				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					injectImmediately: true,
					args: [CURRENT_LINK_ID],
					func: (linkId) => {
						function randomValue(upTo) {
							return Math.floor(Math.random() * upTo) + 1;
						}

						function markAsParsed(){
							document.title = "DONE";
						}

						async function delay(time) {
							await new Promise(resolve => setTimeout(resolve, time));
						}

						let stockStorageButtons = document.querySelectorAll('[data-qa="stocks-in-stores-title"]');
						console.log("CHECK STOCK");
						for(let btn of stockStorageButtons){
							btn.click();
							console.log("CHECK STOCK CLICK");
							delay(2);
							break;
						}

						let linksToFollow = [];
						let waitTime = randomValue(2);
						let scrollNumber = randomValue(5);
						let links = document.getElementsByTagName("a")
						for (let link of links) {
							const href = link.getAttribute("href");
							if(href.match("^\/product") && link.offsetTop>10){
								linksToFollow.push(link);
							}
						}

						let linkIndex = randomValue(linksToFollow.length);
						let linkToScroll = linksToFollow.at(linkIndex);
						let yScroll = 0;
						let scrollTo = 100;
						if(linkToScroll && linkToScroll.offsetTop){
							scrollTo = linkToScroll;
						}
						while(yScroll < scrollTo) {
							yScroll += 10;
							window.scrollTo(0, yScroll);
						}

						GFG_Fun();
						function GFG_Fun() {
							let url = window.location.href;
							let iframes = document.getElementsByTagName("iframe");
							for (let iframe of iframes) {
								iframe.remove();
							}
							let domHtml = document.getElementById('root').innerHTML;
							let data = {url: url, id: linkId, html: decodeHTMLEntities(domHtml)};
							httpPostAsync("https://proftrud.ru/parser/api/agents/leroy/content/html", JSON.stringify(data), markAsParsed)
						}

						function httpPostAsync(theUrl, data, callback)
						{

							let xmlHttp = new XMLHttpRequest();
							xmlHttp.onreadystatechange = () => {
								console.log(xmlHttp);
								if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
									// callback(xmlHttp.responseText);
									callback();
								}
							}
							xmlHttp.onerror = callback;
							xmlHttp.onabort = callback;
							xmlHttp.ontimeout = callback;
							xmlHttp.open("POST", theUrl, true); // true for asynchronous
							xmlHttp.setRequestHeader('Content-Type', 'application/json')
							xmlHttp.send(data);
						}

						function decodeHTMLEntities(text) {
							var entities = [
								['amp', '&'],
								['apos', '\''],
								['#x27', '\''],
								['#x2F', '/'],
								['#39', '\''],
								['#47', '/'],
								['lt', '<'],
								['gt', '>'],
								['nbsp', ' '],
								['quot', '"']
							];

							for (var i = 0, max = entities.length; i < max; ++i)
								text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

							return text;
						}

					}
				}).catch((a, b) => {
					ERROR_MODE = true
				})

				chrome.history.deleteUrl(
					{url: tab.url},
					() => {}
				)
			}
		})
		lastUpload = new Date();
	}
});


const MINUTES_15 = 1000 * 60 * 15;
const MINUTES_10 = 1000 * 60 * 10;
const MINUTES_5 = 1000 * 60 * 5;
const MINUTES_2 = 1000 * 60 * 2;

// setInterval(() => { loadProductTab() }, 10000);
setInterval(() => { fetchLinks() }, 2000);
setInterval(() => { fetchName() }, 4000);
setInterval(() => { checkTab() }, 10000);
checkTab();
fetchName();
function fetchLinks(){
	if(ERROR_MODE){
		return;
	}
	chrome.tabs.query({url: tabsUrl}).then(tabs => {
		if(tabs.length>0) {
			const tab = tabs[0];
			let agentName = botName;
			if(agentName === "" || !agentName){
				agentName = tab.id;
			}
			let endPoint = "https://proftrud.ru/parser/api/agents/leroy/links/list/" + agentName + "/" + LINKS_LIMIT;
			endpointCall(endPoint, (response) => {
				let incomeList = JSON.parse(response);
				if (incomeList.length > 0) {
					incomeList.forEach(link => linksToParse.push(link));
				}
			})

			if(tab.title === "DONE" && linksToParse.length > 0){
				const link = linksToParse.pop();
				CURRENT_LINK_ID = link.id;
				if(!link.path || link.path === "null"){
					return;
				}
				chrome.tabs.update(tab.id, {url: "https://" + link.domain + link.path}).then((a, b) => {

				})
			}
		}
	});
}

function endpointCall(endPoint, callback){
	fetch(endPoint)
		.then(response => response.text())
		.then(callback);
}
