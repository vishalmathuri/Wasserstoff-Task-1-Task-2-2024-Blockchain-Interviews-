const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const solanaWeb3 = require('@solana/web3.js'); // Make sure to install the @solana/web3.js package

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const solanaEndpoint = 'https://api.devnet.solana.com'; // Replace with your Solana cluster endpoint
const solanaProgramId = 'YOUR_SOLANA_PROGRAM_ID'; // Replace with your Solana program ID
const senderPrivateKey = 'YOUR_SENDER_PRIVATE_KEY'; // Replace with the private key of the account triggering the release

async function sendSolanaTransaction(lockEventData) {
  const connection = new solanaWeb3.Connection(solanaEndpoint, 'confirmed');
  const senderAccount = new solanaWeb3.Account(Buffer.from(senderPrivateKey, 'hex'));

  // Create a Solana transaction to interact with your program
  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: senderAccount.publicKey,
      toPubkey: solanaWeb3.PublicKey.default, // Replace with your recipient's Solana address
      lamports: solanaWeb3.LAMPORTS_PER_SOL, // Sending 1 SOL as an example
    }),
  );

  // Sign the transaction with the sender's private key
  transaction.sign(senderAccount);

  // Send the transaction
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [senderAccount],
  );

  console.log('Solana transaction sent:', signature);
}

app.post('/trigger-release', async (req, res) => {
  const lockEventData = req.body;

  // Implement your Solana release logic here
  // This could include sending a transaction to the Solana program
  try {
    await sendSolanaTransaction(lockEventData);
    console.log('Release process triggered for:', lockEventData);
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to trigger release process:', error.message);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Solana release endpoint listening at http://localhost:${PORT}`);
});

const solanaWeb3 = require('@solana/web3.js');

// Verify Ethereum signature on Solana side
const ethSignature = lockEventData.signature; // Assume the signature is included in the lock event data

const verified = solanaWeb3.PublicKey.verify(
  Buffer.from(lockEventData.serialize()), // Serialize lock event data
  Buffer.from(ethSignature, 'hex'), // Convert Ethereum signature from hex
  Buffer.from(ethereumPublicKey, 'hex') // Replace with the public key of the Ethereum contract
);

if (!verified) {
  throw new Error('Ethereum signature verification failed');
}
