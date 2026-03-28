# web4edu

This repository contains CTF-style exercises used in the JHU course "Web Security" (Fall 2025).

## Primary contents
- `l4-jobclobbering/` — a challenge that demonstrates job-hunting / agent-bot interactions and related web-security pitfalls. The challenge source and a small Node.js app are under `l4-jobclobbering/challenge/src`.

## Quick start

### Run the challenge locally (development)

The challenge app lives in `l4-jobclobbering/challenge/src` and is a small Node.js Express app.

### Basic steps to run it locally:

```bash
cd l4-jobclobbering/challenge/src
npm install        # install dependencies listed in package.json
node app.js        # start the server directly
# or use the provided start script (keeps restarting):
./start.sh
```

The server listens on port 8399 by default (or the value of the PORT environment variable).

### Docker

There is a `Dockerfile` under `l4-jobclobbering/challenge/src` if you prefer to containerize the challenge. Example (from that directory):

```bash
docker build -t l4-jobclobbering:latest .
docker run -p 8399:8399 l4-jobclobbering:latest
```