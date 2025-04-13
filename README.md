# Diogoritmos Discord Bot

Announces new videos in the [Diogoritmos YouTube channel](https://www.youtube.com/@diogoritmos) to the [Diogoritmos Discord server](https://discord.gg/diogoritmos). You can use it to create your own bot by setting the environment variables.

Project developed with [CloudFlare Workers](https://developers.cloudflare.com/workers/).

## Setup

Install dependencies:

```
npm install
```

Copy `.dev.vars.example` to `.dev.vars` and set the environment variables.

Create a Worker application in CloudFlare dashboard and update its "name" in `wrangler.jsonc`.
You're also going to need to create a KV and attach its "id" in the same configuration file.

To setup the Google Spreadsheets integration, its required to create document similar to [this one](https://docs.google.com/spreadsheets/d/1GqC8z6vl9C4KA3nONZLLrgUuN9wuWUSPy12AWM1UbaA/edit?usp=sharing),
and lastly "Pubish in Web" only the page as CSV in "Share" under "File" menu.

## Local development

Develop with:

```
npm run dev
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

## Deployment

Deploy with:

```
npm run deploy
```

## Binding resources

Bind resources to the Worker in `wrangler.jsonc`. After adding bindings, a type definition for the `Env` object can be regenerated with `npm run cf-typegen`.
