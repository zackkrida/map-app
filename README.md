<div class="logo" style="width: 400px; margin: 0 auto;"><a href="https://marshall-map.zack.cat"><img src="logo.svg"></a></div>

# Marshall Job Map

This is an application to show completed and in-progress jobs from Marshall Building & Remodeling. Requires authentication via password to view customer data and jobs.

Built with TypeScript, React, Tailwind CSS and Next.js. Also integrates with ImproveIt360 (Salesforce) and Google Maps APIs (places, maps, geocode).


## Running Locally

Depends on node.js > 12.

```bash
# Install dependencies
yarn

# Then create a .env file and populate values
cp .env.example .env

# Now you can run locally
yarn dev # or, vc dev with the vercel cli
```
