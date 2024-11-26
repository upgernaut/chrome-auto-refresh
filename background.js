let activeTabs = {}; // Store active URLs and intervals for each tab

chrome.action.onClicked.addListener(async (tab) => {
  const url = tab.url;
  const tabId = tab.id;

  if (activeTabs[tabId]) {
    stopRefreshing(tabId);
    await clearData(tabId);
    updateBadge(tabId, false); // Update badge to show "Off" for this tab
  } else {
    await saveUrl(tabId, url);
    startRefreshing(tabId);
    updateBadge(tabId, true); // Update badge to show "On" for this tab
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tabId = activeInfo.tabId;
  const tab = await chrome.tabs.get(tabId);

  if (activeTabs[tabId]) {
    updateBadge(tabId, true); // Update badge to show "On" for this tab
  } else {
    updateBadge(tabId, false); // Update badge to show "Off" for this tab
  }
});

function startRefreshing(tabId) {
  if (activeTabs[tabId] && activeTabs[tabId].interval) return;

  const interval = setInterval(() => {
    chrome.tabs.reload(tabId);
  }, 2000);

  activeTabs[tabId] = { interval, url: activeTabs[tabId] ? activeTabs[tabId].url : null };
}

function stopRefreshing(tabId) {
  if (activeTabs[tabId] && activeTabs[tabId].interval) {
    clearInterval(activeTabs[tabId].interval);
    delete activeTabs[tabId];
  }
}

async function saveUrl(tabId, url) {
  activeTabs[tabId] = { interval: activeTabs[tabId] ? activeTabs[tabId].interval : null, url };
  await chrome.storage.local.set({ [tabId]: url });
}

async function clearData(tabId) {
  if (activeTabs[tabId]) {
    delete activeTabs[tabId];
    await chrome.storage.local.remove(tabId);
  }
}

function updateBadge(tabId, isOn) {
  if (isOn) {
    chrome.action.setBadgeBackgroundColor({ color: "#00FF00" }); // Set badge color to green
    chrome.action.setBadgeText({ text: "On" });
  } else {
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" }); // Set badge color to red
    chrome.action.setBadgeText({ text: "Off" });
  }
}
