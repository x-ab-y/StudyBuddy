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

const url = 'https://agilemanifesto.org/history.html'; // Replace with your URL
fetchAndExtractText(url);