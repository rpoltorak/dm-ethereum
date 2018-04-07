const fetch = require('isomorphic-fetch');

run();

function intToHex(number) {
  return '0x' + number.toString(16);
}

async function runRPCCall(method, params) {
  const res = await fetch('http://localhost:8545/', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params
    })
  });

  const json = await res.json();

  return json.result;
}

async function getBlockByNumber(number) {
  return runRPCCall('eth_getBlockByNumber', [number, false]);
}

async function getLatestBlocks(number) {
  const latestBlockNumber = await getLatestBlockNumber();
  const latestIntNumber = parseInt(latestBlockNumber);

  let latestBlocks = [];
  let i = number;

  while (i--) {
    const currentNumber = intToHex(latestIntNumber - i);
    const block = await getBlockByNumber(currentNumber);

    latestBlocks.push(block);
  }

  return latestBlocks;
}

async function getLatestBlockNumber() {
  return runRPCCall('eth_blockNumber', []);
}

async function getTransactionByHash(hash) {
  return runRPCCall('eth_getTransactionByHash', [hash]);
}

async function getTransactions(transactions) {
  return Promise.all(transactions.map(async hash => await getTransactionByHash(hash)));
}

async function run() {
  const latestBlocks = await getLatestBlocks(3);
  const mappedBlocks = latestBlocks.reverse().map(({ hash, number, parentHash }) => ({ hash, number, parentHash }));

  const latestBlock = latestBlocks[0];
  const latestTransactions = await getTransactions(latestBlock.transactions);

  const mappedTransactions = latestTransactions.map(({ gas, gasPrice }) => ({ gas, gasPrice }))

  console.log(mappedTransactions);
}

