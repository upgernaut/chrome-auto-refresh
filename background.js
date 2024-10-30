let activeUrl = null;
let refreshInterval = null;

chrome.action.onClicked.addListener(async (tab) => {
  const url = tab.url;

  if (activeUrl === url) {
    stopRefreshing();
    await clearData();
    chrome.action.setBadgeText({ text: "" });
  } else {
    await saveUrl(url);
    startRefreshing(tab.id);
    chrome.action.setBadgeText({ text: "On" });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url !== activeUrl) {
    stopRefreshing();
    await clearData();
    chrome.action.setBadgeText({ text: "" });
  }
});

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
