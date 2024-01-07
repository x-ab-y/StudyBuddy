import {
  bionify,
  defaultHighlightSheet,
  defaultRestSheet,
  defaultAlgorithm,
  setGreyscale,
} from "../utils.js";

let applyButton = document.getElementById("applyButton");
let greyscale = document.getElementById("greyscale");
let makeFocusPage = document.getElementById("makeFocusPage");
let autoButton = document.getElementById("autoButton");
let excludePatternInput = document.getElementById("excludePattern");
let excludePageButton = document.getElementById("excludePageButton");
let restoreButton = document.getElementById("restore-button");
let highlightSheetInput = document.getElementById("highlight-input");
let restSheetInput = document.getElementById("rest-input");
let algorithmInput = document.getElementById("algorithmInput");
let fontSelect = document.getElementById("font-select");
let summarize = document.getElementById("summarize");

let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
let currentURL = tab.url;
chrome.storage.session.set({ 'currentURL': currentURL }, function() {
  console.log('Current URL saved to session storage');
});

var buttonEnabledClass = "button-enabled";
var buttonDisabledClass = "button-disabled";

function setClass(element, cls) {
  element.className = cls;
}

async function updatePatternText() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  excludePatternInput.value = tab.url;
  updateExcludeButtonText();
}

function updateExcludeButtonText() {
  var currentPattern = excludePatternInput.value;
  chrome.storage.sync.get(["excludedPatterns"], (data) => {
    if (data.excludedPatterns.indexOf(currentPattern) != -1) {
      excludePageButton.innerText = "Remove Pattern";
      setClass(excludePageButton, buttonDisabledClass);
    } else {
      excludePageButton.innerText = "Add Pattern";
      setClass(excludePageButton, buttonEnabledClass);
    }
  });
}

updatePatternText();

function toggleExcludedPattern(pattern) {
  chrome.storage.sync.get(["excludedPatterns"], (data) => {
    var patterns = data.excludedPatterns;

    var index = -1;
    for (var i = 0; i < data.excludedPatterns.length; i++) {
      if (patterns[i] === pattern) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      patterns.push(pattern);
    } else {
      patterns.splice(index, 1);
    }
    chrome.storage.sync.set({ excludedPatterns: patterns });
    updateExcludeButtonText();
  });
}

excludePageButton.addEventListener("click", async () => {
  toggleExcludedPattern(excludePatternInput.value);
});

function updateAutoApplyText(isAuto) {
  if (isAuto) {
    autoButton.innerText = "Disable Auto Apply";
    setClass(autoButton, buttonDisabledClass);
  } else {
    autoButton.innerText = "Enable Auto Apply";
    setClass(autoButton, buttonEnabledClass);
  }
}

chrome.storage.sync.get(
  ["highlightSheet", "restSheet", "autoApply", "isOn", "algorithm"],
  (data) => {
    highlightSheetInput.value = data.highlightSheet;
    restSheetInput.value = data.restSheet;
    algorithmInput.value = data.algorithm;
    updateAutoApplyText(data.autoApply);
    // updatebionifyToggle(data.isOn);
  }
);

highlightSheetInput.addEventListener("input", async (text) => {
  onHighlightInputChange();
});

restSheetInput.addEventListener("input", async (text) => {
  onRestInputChange();
});

algorithmInput.addEventListener("input", async (text) => {
  onAlgorithmInputChange();
});

excludePatternInput.addEventListener("input", async (text) => {
  updateExcludeButtonText();
});

restoreButton.addEventListener("click", async () => {
  chrome.storage.sync.set({
    highlightSheet: defaultHighlightSheet,
    restSheet: defaultRestSheet,
    algorithm: defaultAlgorithm,
  });
  highlightSheetInput.value = defaultHighlightSheet;
  restSheetInput.value = defaultRestSheet;
  algorithmInput.value = defaultAlgorithm;
});

function updatebionifyToggle(isOn) {
  if (isOn) {
    applyButton.innerText = "Bionify: On";
    setClass(applyButton, buttonEnabledClass);
  } else {
    applyButton.innerText = "Bionify: Off";
    setClass(applyButton, buttonDisabledClass);
  }
}

applyButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: bionify,
  });
  chrome.storage.sync.get(["isOn"], (data) => {
    // updatebionifyToggle(!data.isOn);
    chrome.storage.sync.set({ isOn: !data.isOn });
  });
});

fontSelect.addEventListener('change', async function(event) {
  var selectedFont = event.target.value;
  // Save the selected font to chrome.storage
  chrome.storage.sync.set({font: selectedFont}, function() {
    console.log('Font saved as ' + selectedFont);
  });

  // Get the current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: fontchange(),
  // });
  
  chrome.storage.sync.get(["isOn"], function(data) {
    if (data.isOn) {
      // Execute the bionify function in the active tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: bionify,
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: bionify,
      });
    }
  });
});

greyscale.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
 
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setGreyscale,
  });

  

  chrome.storage.sync.get(["isOn"], (data) => {
    // updatebionifyToggle(!data.isOn);
    chrome.storage.sync.set({ isOn: !data.isOn });
  });

});

makeFocusPage.addEventListener("click", async () => {
  window.open("../focusmode/focuswindow.html" );
})

summarize.addEventListener("click", async () => {
  window.open("../summarizer/summarize.html" );
})

autoButton.addEventListener("click", async () => {
  chrome.storage.sync.get(["autoApply"], (data) => {
    updateAutoApplyText(!data.autoApply);
    chrome.storage.sync.set({ autoApply: !data.autoApply });
  });
});

function onHighlightInputChange() {
  chrome.storage.sync.set({ highlightSheet: highlightSheetInput.value });
}

function onRestInputChange() {
  chrome.storage.sync.set({ restSheet: restSheetInput.value });
}

function onAlgorithmInputChange() {
  chrome.storage.sync.set({ algorithm: algorithmInput.value });
}

// document.querySelector('#go-to-options').addEventListener('click', function() {
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('options.html'));
//   }
// });
