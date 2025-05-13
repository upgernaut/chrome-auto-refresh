  // Load current setting
  chrome.storage.local.get('refreshInterval', (data) => {
    console.log("Loaded:", data.refreshInterval);
    const seconds = (data.refreshInterval || 2000) / 1000;
    document.getElementById('interval').value = seconds;
  });

  // Save new setting
  document.getElementById('save').addEventListener('click', () => {
    const seconds = parseInt(document.getElementById('interval').value, 10);
    console.log("Saving:", seconds * 1000);
    chrome.storage.local.set({ refreshInterval: seconds * 1000 });
  });