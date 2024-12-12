# sample_malpack/main.py

from fetch import fetch_posts

def main():
    print("Starting the application...")
    
    # Fetching posts from an API
    fetch_posts()

    print("Application finished.")
    
if __name__ == "__main__":
    main()