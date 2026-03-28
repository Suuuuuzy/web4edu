# web4edu

This repository contains CTF-style exercises used in the JHU course "Web Security" (Fall 2025).

## Primary contents
- `jobasking/` — a challenge that demonstrates job-hunting / agent-bot interactions and related web-security pitfalls. The challenge source and a small Node.js app are under `jobasking/challenge/src`.

## Quick start

### Run the challenge locally (development)

The challenge app lives in `jobasking/challenge/src` and is a small Node.js Express app.

### Basic steps to run it locally:

```bash
cd jobasking/challenge/src
npm install        # install dependencies listed in package.json
node app.js        # start the server directly
# or use the provided start script (keeps restarting):
./start.sh
```

The server listens on port 8399 by default (or the value of the PORT environment variable).

### Docker

There is a `Dockerfile` under `jobasking/challenge/src` if you prefer to containerize the challenge. Example (from that directory):

```bash
docker build -t jobasking:latest .
docker run -p 8399:8399 jobasking:latest
```