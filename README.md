# Diogoritmos Discord Bot

Announces new videos in the [Diogoritmos YouTube channel](https://www.youtube.com/@diogoritmos) to the [Diogoritmos Discord server](https://discord.gg/diogoritmos).

## Setup

```
npm install
```

## Local development

Project developed with [CloudFlare Workers](https://developers.cloudflare.com/workers/).

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
