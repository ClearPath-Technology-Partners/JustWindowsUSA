# Just Windows USA Website

This is a static marketing site for Just Windows USA. It includes Home, Windows, Doors, Gallery, Reviews, About, and Contact pages. It can be hosted with Azure Static Web Apps, Azure App Service, or Azure Storage static website hosting.

## Local Preview

Open `index.html` in a browser, or run a simple local server from this folder.

## Azure Notes

- For Azure Static Web Apps, deploy the folder as the app root.
- The included `staticwebapp.config.json` adds a basic fallback route and security headers.
- The quote form currently confirms on the page only. Connect it to Azure Functions, Logic Apps, or a CRM endpoint before using it for live lead capture.
