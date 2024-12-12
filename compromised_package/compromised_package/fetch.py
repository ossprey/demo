# fetch.py

import requests

def fetch_posts():
    url = "https://jsonplaceholder.typicode.com/posts"
    try:
        # Sending a GET request to the API
        response = requests.get(url)
        
        # Check if the request was successful (status code 200)
        response.raise_for_status()

        # Parse the JSON response
        posts = response.json()

        # Display the fetched posts
        for post in posts[:5]:  # Limiting to first 5 posts for brevity
            print(f"Post ID: {post['id']}")
            print(f"Title: {post['title']}")
            print(f"Body: {post['body']}\n")
    
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"An error occurred: {err}")