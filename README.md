# Digital Banking System API

A backend banking API built with Node.js, Express and MongoDB. It handles customer onboarding with BVN/NIN verification, account creation, transfers, and transaction history. It integrates with the NibssByPhoenix API.

**Live API:** [Not yet live]

## Features
- Customer registration and login with JWT authentication
- BVN / NIN identity verification through NibssByPhoenix
- One account per verified customer, pre-funded with ₦15,000
- Name enquiry before a transfer
- Intra-bank and inter-bank transfers
- Transaction status lookup by reference
- Transaction history, where each customer sees only their own transactions

## Tech stack
Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Axios

## Endpoints

| Method |                  Route                   | Auth | Description |
|--------|------------------------------------------|------|-------------|
| POST | `/api/customers/register`                  | No   | Create a customer |
| POST | `/api/customers/login`                     | No   | Log in and receive a token |
| POST | `/api/customers/verify`                    | Yes  | Verify identity with BVN or NIN |
| POST | `/api/accounts/create`                     | Yes  | Create an account (verified customers only) |
| GET | `/api/accounts/balance`                     | Yes  | Check your balance |
| GET | `/api/accounts/name-enquiry/:accountNumber` | Yes  | Look up an account name |
| POST | `/api/accounts/transfer`                   | Yes  | Transfer funds |
| GET | `/api/accounts/transaction/:ref`            | Yes  | Check a transaction by reference |
| GET | `/api/accounts/transactions`                | Yes  | Your transaction history |

Protected routes need the header `Authorization: Bearer <token>`.

## Run locally

```bash
git clone [your repo URL]
cd [your repo folder]
npm install
npm run dev
```

Create a `.env` file with:

```
PORT=
MONGO_URI=
JWT_SECRET=
NIBSS_BASE_URL=
NIBSS_API_KEY=
NIBSS_API_SECRET=
NIBSS_BANK_CODE=
NIBSS_BANK_NAME=
```

## Design notes
- The sender account is always taken from the logged-in customer, never from the request body.
- Customer details (name, date of birth, phone) used for verification come from the stored record, not client input.
- The Nibss auth token is cached in memory and refreshed before it expires.
- Local balances are updated only after Nibss confirms the transfer.

## Known limitation
Transfers are not yet atomic across the Nibss call and the local database writes. A planned improvement is to use MongoDB transactions or a relational database for the ledger.

## Author
[Faderin Daniel Ayodeji] — [www.linkedin.com/in/oluwajomiloju-faderin-222ab0386]
