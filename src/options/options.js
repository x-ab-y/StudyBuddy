document.getElementById('options-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var selectedFont = document.getElementById('font-select').value;
    chrome.storage.sync.set({font: selectedFont}, function() {
      console.log('Font saved as ' + selectedFont);
    });
  });