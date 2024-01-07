import {
  bionify,
  patternsInclude,
  defaultHighlightSheet,
  defaultRestSheet,
  defaultAlgorithm,
} from "./utils.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    highlightSheet: defaultHighlightSheet,
    restSheet: defaultRestSheet,
    autoApply: false,
    excludedPatterns: [],
    algorithm: defaultAlgorithm,
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == "complete") {
    chrome.storage.sync.get(["autoApply", "excludedPatterns"], async (data) => {
      if (data.autoApply) {
        let tab = await chrome.tabs.get(tabId);
        if (!patternsInclude(data.excludedPatterns, tab.url)) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: bionify,
          });
        }
      }
    });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-auto-bionify") {
    chrome.storage.sync.get(["autoApply"], (data) => {
      chrome.storage.sync.set({ autoApply: !data.autoApply });
    });
  }
  if (command === "toggle-bionify") {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: bionify,
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message received in background.js: ", message);
  if (message.type === 'HIGHLIGHTED_TEXT') {
    fetch('http://localhost:3000/generate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ highlightedText: message.text })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      sendResponse({ message: data.message }); // Send response back
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ error: error.message });
    });
    return true; // Indicates you want to send a response asynchronously
  }
});
