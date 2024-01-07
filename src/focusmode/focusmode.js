// function: main
// set up buttons
// get text from url
// use function: parse on text

// function: parse
// parse text and bionify them

import {bionify} from "../utils.js";

async function fetchAndExtractText(currentPageUrl) {
    const url = `https://article-extractor-and-summarizer.p.rapidapi.com/extract?url=${currentPageUrl}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '6fc530cb65msh5fb149757aa8ef2p1b2972jsn5c99c6b47390',
            'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        const parsed = JSON.parse(result)
        const extracted = parsed.title + parsed.description + parsed.content;
        // Open the summarized text in a new window
        document.getElementById("title").innerText = parsed.title;
        document.getElementById("desc").innerText = parsed.description;
        document.getElementById("par").innerText = parsed.content;
        bionify();
    } catch (error) {
        console.error(error);
    }
}


chrome.storage.session.get(['currentURL'], function(result) {
    let storedURL = result.currentURL;
    console.log('Retrieved URL from session storage:', storedURL);
    fetchAndExtractText(storedURL); 
  
  });
