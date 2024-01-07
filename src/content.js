document.addEventListener('mouseup', () => {
  console.log('mouseup');
  let highlightedText = window.getSelection().toString().trim();
  if (highlightedText) {
    chrome.runtime.sendMessage({ type: 'HIGHLIGHTED_TEXT', text: highlightedText }, response => {
      if (response && response.message) {
        console.log('creating popup');
        let rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        let x = rect.left + (rect.width / 2) + window.scrollX;
        let y = rect.top + window.scrollY;
        createPopup(response.message, x, y);
      }
    });
  }
});

function createPopup(summaryText, x, y) {
  const popup = document.createElement('div');
  popup.style.position = 'absolute';
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  popup.style.padding = '10px';
  popup.style.background = 'grey';
  popup.style.border = '1px solid black';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
  popup.style.zIndex = '1000';
  popup.innerText = summaryText;

  document.body.appendChild(popup);
  window.addEventListener('click', function closePopup(event) {
      if (!popup.contains(event.target)) {
        popup.remove();
        window.removeEventListener('click', closePopup);
      }
    });
}
