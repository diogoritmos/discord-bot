# Diogoritmos Discord Bot

Announces new videos on [diogoritmos YouTube channel](https://www.youtube.com/@diogoritmos)
and weekly updates of the "Desafio Semanal de Algoritmos" to the [diogoritmos Discord server](https://discord.gg/diogoritmos).

Project is deployed with [CloudFlare Workers](https://developers.cloudflare.com/workers/).

## Setup

Required in the OS:

- Node.js v22.14.0 (usage of [asdf](https://asdf-vm.com/) or [nvm](https://github.com/nvm-sh/nvm) are highly recommended)

Install dependencies:

```
npm install
```

Run format and lint:

```
npm run format
npm run lint
```

You can use this project to create your own bot, being required to deploy a `KV` and `Worker` on
their platform, updating the environment variables in `.dev.vars` and `wrangler.jsonc`.

To setup your custom Google Spreadsheets integration, its required to create document similar
to [this one](https://docs.google.com/spreadsheets/d/1GqC8z6vl9C4KA3nONZLLrgUuN9wuWUSPy12AWM1UbaA/edit?usp=sharing),
and lastly "Pubish in Web" only the page as CSV in "Share" under "File" menu.

You don't have to worry about that if you're developing within the "diogoritmos" community context,
the **only secrets required are of the Discord webhook tokens**, but if you're developing on related
features, hit `@dcdourado` a DM. You can also ask to be included in the project CloudFlare's organization
to gain access over cloud resources being utilized.

## Local development

Develop with:

```bash
npm run dev

# Set up a custom cron expression to evaluate different scheduled jobs
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

## Deployment

Deploy with:

```
npm run deploy
```

Requires access to the CloudFlare organization.

## Binding resources

Bind resources to the Worker in `wrangler.jsonc` (like adding a new env var). After adding bindings,
a type definition for the `Env` object can be regenerated with

```
npm run cf-typegen
```
