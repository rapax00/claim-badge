# Claim Badge

<!-- ![Latest Release](https://badgen.net/github/release/rapax00/claim-badge/stable/?color=blue&icon=bitcoin-lightning) -->

![License](https://badgen.net/github/license/rapax00/claim-badge/?color=cyan)
![Stars](https://badgen.net/github/stars/rapax00/claim-badge/?color=yellow)
![Forks](https://badgen.net/github/forks/rapax00/claim-badge/?color=grey)

UI and back for claim nostr badge through QR code using NIP-05.

## Table of Contents

- [Flow](#flow)
- [Configuration](#configuration)
- [To Do](#to-do)

## Flow

1. User scans QR code
2. This redirected to the claim page
3. Fills the form with your NIP-05
4. Sumbit and call the API to award the badge
5. Backend award badge
6. Success message

![claim badge flow](./public/claim-badge-flow.svg)

## Configuration

### 1. Setup environment variables

Copy `.env.example` to `.env` and fill the `NOSTR_SIGNER` with the private key of Nostr Badges emitter.

```bash
cp .env.example .env
```

### 2. Setup

Use correct node version

```bash
nvm use
```

Install the dependencies

```bash
pnpm i
```

### 3. Run in dev mode

```bash
pnpm dev
```

## To Do

### Priority

1. Claim badge from NIP-05
2. Claim badge from LaWallet
3. Claim badge using LaCard

### Front

- [ ] _Main page_ with QR to redirect to the claim page
- [ ] _Claim page_

### Back

- [ ] Send award event
