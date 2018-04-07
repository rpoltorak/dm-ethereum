const fetch = require('isomorphic-fetch');

run();

function intToHex(number) {
    return '0x' + number.toString(16);
}

async function runRPCCall(method, params) {
    const res = await fetch('http://localhost:8545/', {
        // Metoda POST
        method: 'post',
        // 3/ Ustawiamy content-type
        headers: {
        'Content-Type': 'application/json'
        },
        // 6/ I wysyłamy zserializowany request o najnowszy blok
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

    while(i--) {
        const currentNumber = intToHex(latestIntNumber - i);
        const block = await getBlockByNumber(currentNumber);
        
        latestBlocks.push(block);
    }

    return latestBlocks;
}

async function getLatestBlockNumber() {
    return runRPCCall('eth_blockNumber', []);
}

async function run() {
  const latestBlocks = await getLatestBlocks(3);
  const results = latestBlocks.reverse().map(({ hash, number, parentHash}) => ({ hash, number, parentHash}));

  console.log(results);
}

