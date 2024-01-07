// function: main
// set up buttons
// get text from url
// use function: parse on text

// function: parse
// parse text and bionify them

import {bionify} from "../utils.js";

async function fetchAndExtractText(url, config = {}) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove unwanted elements
        const selectorsToRemove = config.selectorsToRemove || ['a','script', 'style', 'header', 'footer', 'nav', '.ad'];
        selectorsToRemove.forEach(selector => {
            doc.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Special handling for tables
        doc.querySelectorAll('table').forEach(table => {
            let tableText = '';
            table.querySelectorAll('tr').forEach(tr => {
                let rowText = Array.from(tr.cells).map(td => td.textContent.trim()).join('\t'); // Separate cells with a tab
                tableText += rowText + '\n';
            });
            table.replaceWith(document.createTextNode(tableText));
        });

        // Handle lists
        doc.querySelectorAll('ul, ol').forEach(list => {
            let itemsText = Array.from(list.children).map(li => `- ${li.textContent.trim()}`).join('\n');
            list.replaceWith(document.createTextNode(itemsText + '\n'));
        });

        // Extract text from specified elements
        const textElements = doc.querySelectorAll(config.textSelector || 'p, article, div');
        let extractedText = Array.from(textElements).map(el => el.innerText.trim()).join('\n\n');

        // Additional cleanup with regex if needed
        extractedText = extractedText.replace(/\s{2,}/g, ' ');

        document.getElementById("par").innerText = extractedText;

        bionify();

        return extractedText;
    } catch (error) {
        console.error('Error fetching or parsing:', error);
        return null;
    }
}


chrome.storage.session.get(['currentURL'], function(result) {
    let storedURL = result.currentURL;
    console.log('Retrieved URL from session storage:', storedURL);
    fetchAndExtractText(storedURL); 
  
  });
