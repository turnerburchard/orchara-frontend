# Orchara Frontend

## Setup
```bash
npm install
```

## Development
```bash
npm run dev
```

## Production Build & Deploy
```bash
npm run build
wrangler pages deploy dist --branch=main
```

## Environment Variables
Create `.env` file:
```
VITE_API_URL=your_api_url
```