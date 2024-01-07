// function: main
// set up buttons
// get text from url
// use function: parse on text

// function: parse
// parse text and bionify them

import {
    bionify
    } from "../utils.js";

async function fetchAndExtractText(url) {
    try {
        // Fetch the content of the webpage
        const response = await fetch(url);
        const html = await response.text();

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract text content
        const text = doc.body.textContent || "";

        document.getElementById("par").innerText = text;

        bionify();

        return text;
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
