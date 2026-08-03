# By His Light

A quiet digital chapel on the internet - a Catholic and Christian sanctuary offering Scripture, prayer, and a place to light a candle.

When a visitor lights a candle on this website, an electronic relay on a Raspberry Pi Zero 2 W physically lights votive candles on Paul's home altar in Inverclyde, Scotland, for 15 minutes.

## Features

- Daily blessing and holy scripture
- Daily gospel reading
- Traditional Catholic prayers (English and Latin)
- Holy Rosary with guided decades
- Light a Candle - virtual sanctuary candles plus real physical altar votives
- The Ten Commandments
- Liturgical calendar
- Saint of the day
- Daily reflection
- Silence Mode for distraction-free prayer
- Quiet chapel bell (offline Web Audio synthesis)

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Express server
- File-backed JSON database (`data/sanctuary-db.json`)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

The dev server runs on `http://localhost:3000`.

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - build the frontend and bundle the server
- `npm run start` - run the production server
- `npm run lint` - type-check with `tsc --noEmit`
- `npm run clean` - remove build output

## API

- `GET /api/health` - server and chapel node status
- `GET /api/status` - candle slots, queue, and totals
- `GET /api/candles/stats` - candle stats
- `POST /api/candles/light` - offer a candle (rate limited)
- `GET /api/altar/status` - physical altar connection status
- `GET /api/prayers/wall` - approved prayer wall
- `POST /api/prayers/request` - submit a prayer intention
