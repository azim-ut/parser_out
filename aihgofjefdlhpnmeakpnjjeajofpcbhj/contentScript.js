"storage" in navigator && "estimate" in navigator.storage ? navigator.storage.estimate().then(a => {
    chrome.runtime.sendMessage({estimate: a, origin: location.origin})
}) : chrome.runtime.sendMessage({origin: location.origin});
