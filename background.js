function normalizeUrl(url) {
    [
        "slack.com/messages",
        "web.telegram.org",
        "music.163.com",
        "app.futurenda.com",
    ].forEach((end) => {
        if (url.indexOf(end) > -1) {
            url = url.substring(0, url.indexOf(end) + end.length);
        }
    });
    return url;
}

function preferNew(url) {
    return [
        "jd.com",
        "github.com"
    ].some((domain) => url.indexOf(domain) > -1)
}

function removeDuplicateTab(newTab) {
    chrome.tabs.getAllInWindow(newTab.windowId, function(tabs) {
        var duplicateTab = null;
        tabs.forEach(function(otherTab) {
            if (otherTab.id !== newTab.id) {
                if (normalizeUrl(otherTab.url) == normalizeUrl(newTab.url)) {
                    duplicateTab = otherTab;
                }
            }
        });
        if (duplicateTab) {
            if (preferNew(newTab.url)) {
                chrome.tabs.remove(duplicateTab.id);
            } else {
                chrome.tabs.update(duplicateTab.id, {"selected": true});
                chrome.tabs.remove(newTab.id);
            }
        }
    });
}

chrome.tabs.onCreated.addListener(function(newTab) {
    removeDuplicateTab(newTab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        removeDuplicateTab(tab);
    }
});
