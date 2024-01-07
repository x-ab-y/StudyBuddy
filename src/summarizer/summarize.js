async function summarizeCurrentPage(currentPageUrl) {
    // const currentPageUrl = encodeURIComponent(window.location.href);
    const url = `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${currentPageUrl}&length=3`;
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
        const summary = JSON.parse(result).summary;
        // Open the summarized text in a new window
        document.getElementById("summary-par").innerText = summary;
    } catch (error) {
        console.error(error);
    }
}

chrome.storage.session.get(['currentURL'], function(result) {
    let storedURL = result.currentURL;
    console.log('Retrieved URL from session storage:', storedURL);
    summarizeCurrentPage(storedURL); 
  
  });