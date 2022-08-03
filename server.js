const express = require('express')
const cors = require('cors')
const { Pool } = require('pg');
const app = express()
app.use(cors())

const getIndexerConnection = async () => {
  const connection = new Pool({ connectionString: process.env.INDEXER_CONNECTION_STRING })
  return connection
}

app.get('/getRequestTxs', async (req, res) => {
  try {
    const multisafeId = req.query.multisafeId
    const connection = await getIndexerConnection()
    const results = await connection.query(`SELECT
       t.transaction_hash,
       t.block_timestamp,
       t.signer_account_id,
       ta.args
     FROM transactions t
     INNER JOIN transaction_actions ta ON t.transaction_hash = ta.transaction_hash
     WHERE t.receiver_account_id = $1
     AND (
       ta.args ->> 'method_name' = 'add_request' OR
       ta.args ->> 'method_name' = 'add_request_and_confirm' OR
       ta.args ->> 'method_name' = 'delete_request' OR
       ta.args ->> 'method_name' = 'confirm'
     )`, [ multisafeId ]
    )
    res.status(200).send(results.rows)
  } catch (err) {
    console.error('Error at getRequestTxs', err)
    res.status(400).send({ error: "Error getting request transactions"})
  }
})

app.get('/getAddRequestTxs', async (req, res) => {
  try {
    const multisafeId = req.query.multisafeId
    const connection = await getIndexerConnection()
    const results = await connection.query(`SELECT
          t.transaction_hash,
          t.block_timestamp,
          t.status,
          t.signer_account_id,
          ta.args
      FROM transactions t
               INNER JOIN transaction_actions ta ON t.transaction_hash = ta.transaction_hash
      WHERE t.receiver_account_id = $1
        AND (
              ta.args ->> 'method_name' = 'add_request'
              OR ta.args ->> 'method_name' = 'add_request_and_confirm'
          )`,
      [ multisafeId ]
    )
    res.status(200).send(results.rows)
  } catch (err) {
    console.error('Error at getAddRequestTxs', err)
    res.status(400).send({error:"Error getting add request transactions"})
  }
})

// TODO: use CURL commands or Postman to hit this API and try to break it (put, delete, etc…)

const PORT = process.env.PORT || 8666
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
