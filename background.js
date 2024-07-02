function checkLoginStatus(sendResponse) {
    chrome.cookies.get({ url: "https://www.linkedin.com", name: "li_at" }, function (cookie) {
       // console.log("cookie: ",cookie.value);
        if (cookie) {
            sendResponse({ loggedIn: true, cookie: cookie.value });
        } else {
            sendResponse({ loggedIn: false });
        }
    });
}

function monitorLogin() {
    chrome.tabs.create({ url: "https://www.linkedin.com" }, function (tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
            if (tabId === tab.id && changeInfo.status === "complete" && updatedTab.url.includes("https://www.linkedin.com/feed/")) {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.cookies.get({ url: "https://www.linkedin.com", name: "li_at" }, function (cookie) {
                    if (cookie) {
                        chrome.runtime.sendMessage({ action: "loginDetected", cookie: cookie.value });
                    }
                });
            }
        });
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "checkLogin") {
        checkLoginStatus(sendResponse);
        return true;
    } else if (request.action === "monitorLogin") {
        monitorLogin();
    }
});
