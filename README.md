# Multisafe backend

This repo exists to connect the [Multisafe UI](https://github.com/multi-safe/ui.multisafe) to the NEAR Indexer for Explorer database.

The connection to the read-only postgres database is detailed here:

https://github.com/near/near-indexer-for-explorer#shared-public-access

Note there are two environment variables:

- NEAR_NETWORK
- PORT

That can be used to modify how this Express app behaves.

## Start

```
npm i
node server.js
```

or connect to mainnet:

```
INDEXER_CONNECTION_STRING=postgres://public_readonly:nearprotocol@testnet.db.explorer.indexer.near.dev/testnet_explorer node server.js
```
