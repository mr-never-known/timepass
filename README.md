# Timepass - Movie Explorer Web UI

Timepass is a visually stunning, responsive React web application that serves as a modern frontend interface for discovering and interacting with movie data available on the public internet. Built with Vite, Bun, and React.

---

## Running Locally

To run the application locally on your machine, you need [Bun](https://bun.sh/) installed:

```bash
# Install the project dependencies
bun install

# Start the local development server
bun run dev

# Build for production
bun run build
```

---

## Application Architecture & Data Sources

This application solely provides a frontend UI wrapper (HTML/CSS/JS) and does not possess its own backend or database.

It consumes public API endpoints provided by the external service **`moviesapi.to`**:

- **Search/Directory API:** `https://moviesapi.to/api/discover/movie`
- **Video Player Embed:** `https://moviesapi.to/movie/{id}`

All network requests made by this application are simply passing through user requests to these third-party endpoints.

---

## ⚖️ Legal Disclaimer & Terms of Use

> **NOTICE:** This application does NOT host, own, encode, or upload any media content, videos, streams, or copyright materials.

1. **Client-Side Indexing Only:** Timepass operates purely as an indexing UI (similar to a search engine) that executes client-side scripts to interact with publicly accessible third-party APIs. No media files are stored on our servers.
2. **Third-Party Content:** All streaming links, iframe embeds, and movie metadata are securely pulled from external services over which the creators and maintainers of this repository have zero control. 
3. **Intellectual Property:** All trademarks, logos, and images belong to their respective and rightful owners. We layout data adhering to international **Safe Harbor** provisions (e.g., DMCA). We are not responsible for the compliance, legality, copyright, or decency of the content found on third-party links or iframe implementations.
4. **Use at Your Own Risk:** Users are solely responsible for ensuring that their interaction with embedded APIs adheres to their local jurisdictional laws. We strongly recommend the use of ad-blockers and privacy-respecting browsers (like Brave) when interacting with external media iframes.
