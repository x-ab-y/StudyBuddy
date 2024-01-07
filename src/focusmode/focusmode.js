// set up buttons and variables
let themeNight = document.getElementById("night");
let themeDay = document.getElementById("day");
let themeForest = document.getElementById("forest");
let themeRoses = document.getElementById("roses");
let themeOcean = document.getElementById("ocean");
let fonts = document.getElementById("fonts");
let size = document.getElementById("size");
let background = document.getElementById("background");
let paragraph = document.getElementById("paragraph");
let cButton = document.getElementById("cButton");
let themeList = [document.getElementById("par"), document.getElementById("defaultColor"), document.getElementById("indentColor"), document.getElementById("cButton")]
const themeCollection = document.getElementsByClassName("theme");
var nightThemeColor = ["rgb(21, 21, 73)", "rgb(17, 17, 43)", "rgb(196, 196, 196)", "rgb(41, 41, 142)"]
var dayThemeColor = ["rgb(252, 245, 237)", "white", "rgb(0, 0, 0)", "rgb(255, 228, 196)"];
var forestThemeColor = ["rgb(199, 237, 204)", "rgb(207, 243, 214)", "rgb(37, 97, 53)", "rgb(120, 234, 133)"];
var rosesThemeColor = ["rgb(235, 176, 189)", "rgb(249, 212, 225)", "rgb(107, 44, 66)","rgb(216,112,147"];
var oceanThemeColor = ["rgb(200, 226, 255)", "rgb(177, 214, 255)","rgb(21, 21, 103)", "rgb(61, 171, 244)"];

// set up button listeners
themeNight.addEventListener("click", function() {
    changeTheme(nightThemeColor);
})

themeDay.addEventListener("click", function() {
    changeTheme(dayThemeColor);
})

themeForest.addEventListener("click", function() {
    changeTheme(forestThemeColor);
})

themeRoses.addEventListener("click", function() {
    changeTheme(rosesThemeColor);
})

themeOcean.addEventListener("click", function() {
    changeTheme(oceanThemeColor);
})

cButton.addEventListener("click", function() {
    // check for line spacing
    paragraph.style.lineHeight = Number(fonts.value);
    document.getElementById("par").style.fontSize = size.value.toString() + "px";
})

function changeTheme(theme) {
    background.style.backgroundColor = theme[0];
    paragraph.style.backgroundColor = theme[1];
    for (let i = 0; i < themeCollection.length; i++) {
        themeCollection[i].style.color = theme[2];
        }
    for (let i = 0; i < themeList.length; i++) {
        themeList[i].style.color = theme[2];
        }
    cButton.style.backgroundColor = theme[3];
}

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

        return text;
    } catch (error) {
        console.error('Error fetching or parsing:', error);
        return null;
    }
}

function main() {
    const url = 'https://agilemanifesto.org/history.html'; // Replace with your URL
    var text = fetchAndExtractText(url);
}

main();