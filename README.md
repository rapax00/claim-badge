# Claim Badge

UI and back for claim nostr badge through QR code using NIP-05.

## Table of Contents

- [Flow](#flow)
- [Configuration](#configuration)
- [To Do](#to-do)

## Flow

1. User scans QR code with the badge ID
2. Is redirected to the claim page
3. Fills the form with your NIP-05
4. Sumbit and call the API to award the badge
5. Back Award badge
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

### Front

- [ ] _Main page_ with QR to redirect to the claim page
- [ ] _Claim page_

### Back

- [ ] Send award event
