const Web3 = require('web3');
const axios = require('axios');

const web3 = new Web3('YOUR_ETHEREUM_NODE_URL');
const contractAddress = 'YOUR_LOCK_CONTRACT_ADDRESS';
const abi = [ /* YOUR_LOCK_CONTRACT_ABI */ ];

const lockContract = new web3.eth.Contract(abi, contractAddress);

async function monitorLockEvents() {
  lockContract.events.LockEvent({ fromBlock: 'latest' })
    .on('data', async (event) => {
      console.log('Lock Event Received:', event.returnValues);

      // Trigger the release process on the Solana side
      await triggerReleaseProcess(event.returnValues);
    })
    .on('error', (error) => {
      console.error('Error monitoring events:', error);
    });
}

async function triggerReleaseProcess(lockEventData) {
  const releaseUrl = 'http://localhost:3000/trigger-release'; // Replace with your Solana release endpoint
  try {
    const response = await axios.post(releaseUrl, lockEventData);
    console.log('Release process triggered successfully:', response.data);
  } catch (error) {
    console.error('Failed to trigger release process:', error.message);
  }
}

monitorLockEvents();

const { sign } = require('eth-crypto');

// Sign lock event data
const signature = await sign(privateKey, {
  type: 'LockEvent',
  sender: lockEventData.sender,
  amount: lockEventData.amount,
  targetChain: lockEventData.targetChain,
  targetAddress: lockEventData.targetAddress,
});

// Include the signature in the emitted event
lockContract.methods.emitLockEvent(lockEventData.amount, lockEventData.targetChain, lockEventData.targetAddress, signature).send({ from: sender });
