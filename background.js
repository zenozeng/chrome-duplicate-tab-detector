function removeDuplicateTab(newTab) {
    chrome.tabs.getAllInWindow(newTab.windowId, function(tabs) {
        var duplicateTab = null;
        tabs.forEach(function(otherTab) {
            console.log({otherTab})
            if (otherTab.id !== newTab.id && otherTab.url === newTab.url) {
                duplicateTab = otherTab;
            }
        });
        if (duplicateTab) {
            chrome.tabs.update(duplicateTab.id, {"selected": true});
            chrome.tabs.remove(newTab.id);
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
