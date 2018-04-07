// Importujemy klasę web3
const Web3 = require('web3');

run();

async function run() {
  // Tworzymy nową instancję i podajemy adres nodea
  const web3 = new Web3('http://localhost:8545');
  // Pobieramy block
  const block = await web3.eth.getBlock('latest');

  console.log(block);

  // Dane w otrzymanym obiekcie są już przetworzone, nie musimy parsować heksów.
  const { number, hash, transactions, timestamp } = block

  console.log(`
    Block number: ${number}
    Block hash: ${hash}
    Block date: ${new Date(timestamp * 1000)}
    Number of transactions: ${transactions.length}
  `);
}