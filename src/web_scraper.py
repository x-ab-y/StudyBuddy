import requests
from bs4 import BeautifulSoup
import json
import sys


def fetch_webpage(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching webpage: {e}")
        return None


def extract_text(html):
    soup = BeautifulSoup(html, "html.parser")
    elements = soup.find_all(["p", "li"])  # Find all <p> and <li> tags
    extracted_text = [
        element.get_text().strip()
        for element in elements
        if len(element.get_text().strip()) > 50
    ]
    return extracted_text


def save_to_json(data, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python web_scraper.py <URL>")
        sys.exit(1)

    url = sys.argv[1]
    html = fetch_webpage(url)
    if html:
        text_elements = extract_text(html)
        save_to_json(text_elements, "scraped_data.json")
