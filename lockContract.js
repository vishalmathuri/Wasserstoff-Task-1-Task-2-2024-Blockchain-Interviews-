// Using web3.js to sign and send lock event
const { sign } = require('eth-crypto');
const Web3 = require('web3');

const privateKey = 'YOUR_ETHEREUM_PRIVATE_KEY'; // Replace with your Ethereum private key
const web3 = new Web3('YOUR_INFURA_ENDPOINT'); // Replace with your Infura endpoint

const lockEventData = {
  sender: '0xYourSenderAddress',
  amount: 100,
  targetChain: 'Solana',
  targetAddress: '0xYourSolanaRecipientAddress',
};

const signature = await sign(privateKey, {
  type: 'LockEvent',
  ...lockEventData,
});

const lockContract = new web3.eth.Contract(abi, 'YOUR_LOCK_CONTRACT_ADDRESS'); // Replace with your deployed contract address

await lockContract.methods.lockTokens(lockEventData.amount, lockEventData.targetChain, lockEventData.targetAddress, signature).send({ from: lockEventData.sender });
