let activeUrl = null;
let refreshInterval = null;

chrome.action.onClicked.addListener(async (tab) => {
  const url = tab.url;

  if (activeUrl === url) {
    stopRefreshing();
    await clearData();
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" }); // Set badge color to red
    chrome.action.setBadgeText({ text: "Off" });
  } else {
    await saveUrl(url);
    startRefreshing(tab.id);
    chrome.action.setBadgeBackgroundColor({ color: "#00FF00" }); // Set badge color to green
    chrome.action.setBadgeText({ text: "On" });
  }
});


// Stop refreshing if entering another website (if needed)
/*chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url !== activeUrl) {
    stopRefreshing();
    await clearData();
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" }); // Set badge color to red
    chrome.action.setBadgeText({ text: "Off" });
  }
})*/;

function startRefreshing(tabId) {
  if (refreshInterval) return;

  refreshInterval = setInterval(() => {
    chrome.tabs.reload(tabId);
  }, 2000);
}

function stopRefreshing() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

async function saveUrl(url) {
  activeUrl = url;
  await chrome.storage.local.set({ activeUrl: url });
}

async function clearData() {
  activeUrl = null;
  await chrome.storage.local.clear();
}
