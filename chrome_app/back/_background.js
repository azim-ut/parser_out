const tabsUrl = [
	'https://*.leroymerlin.ru/*',
	'https://leroymerlin.ru/*',
	// 'https://proftrud.ru/*'
]

const domains = [
	'https://spb.leroymerlin.ru/',
	// 'https://pskov.leroymerlin.ru/',
]

domains.forEach(domain => {tabsUrl.push(domain + "*")})


let currentDomainPosition = 0;
let walkPerSiteCounter = 0;
let maximumWalkSteps = 2;
let cookiesUpdated = false;
function reloadTab() {
	chrome.tabs.query({url: tabsUrl}).then(tabs => {
		if(tabs.length > 0){
			const tab = tabs[0];


			if(walkPerSiteCounter > maximumWalkSteps){
				walkPerSiteCounter = 0;

				currentDomainPosition++;
				if(currentDomainPosition > domains.length - 1){
					currentDomainPosition = 0;
				}
				console.log('tab change to: ' + domains[currentDomainPosition])
				chrome.tabs.update(tab.id, { url: domains[currentDomainPosition] });
				return;
			}
			console.log(walkPerSiteCounter, domains[currentDomainPosition])
			walkPerSiteCounter++;

			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: (items) => {
					function randomValue(upTo) {
						return Math.floor(Math.random() * upTo) + 1;
					}
					async function delay(time) {
						await new Promise(resolve => setTimeout(resolve, time));
					}

					let waitTime = randomValue(10);
					let links = document.getElementsByTagName("a")
					let linksToFollow = [];

					for (let link of links) {
						const href = link.getAttribute("href");
						if(href.match("^\/product")){
							linksToFollow.push(link);
						}
					}

					let linkIndex = randomValue(linksToFollow.length);
					let linkToFollow = linksToFollow.at(linkIndex);
					if(linkToFollow){
						window.scrollTo(0, linkToFollow.offsetTop + 100)
						delay(waitTime).then(r => {
							linkToFollow.click();
						})
					}else{
						delay(waitTime).then(r => {
							location.href = "/";
						})
					}
				}
			}).then(res => {
				cookiesUpdated = false;
			})
		}
	})

}


const MINUTES_15 = 1000 * 60 * 15;
const MINUTES_10 = 1000 * 60 * 10;
const MINUTES_5 = 1000 * 60 * 5;
const MINUTES_2 = 1000 * 60 * 2;
reloadTab()
setInterval(() => { reloadTab() }, MINUTES_2);
setInterval(() => { execParser() }, 5000);
function execParser(){
	if(cookiesUpdated){
		return;
	}
	chrome.tabs.query({url: tabsUrl}).then(tabs => {
		if (tabs.length > 0) {
			const tab = tabs[0];
			chrome.scripting.executeScript({
				target: {tabId: tab.id},
				func: (items) => {

					let cookiesList = [];
					document.cookie.split("; ").forEach(row => cookiesList.push("cookie=" + row));
					httpGetAsync("http://localhost:9100/parser/api/lerua/cookies?domain=" + window.location.hostname + "&" + cookiesList.join("&"), () => {
					});

					function httpGetAsync(theUrl, callback) {
						let xmlHttp = new XMLHttpRequest();
						xmlHttp.onreadystatechange = () => {
							if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
								callback(xmlHttp.responseText);
							}
						}
						xmlHttp.open("GET", theUrl, true); // true for asynchronous
						xmlHttp.send(null);
					}
				}
			}).then(res => cookiesUpdated = true);
		}
	});

}