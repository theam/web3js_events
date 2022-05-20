const Web3 = require('web3');
const abiDecoder = require('abi-decoder');
require('dotenv').config();
var fs = require('fs');
const rpcURL = process.env.NODE_URL;
const web3 = new Web3(rpcURL)

const jsonFile = process.env.ABI_PATH;
console.log(rpcURL);
const parsed= JSON.parse(fs.readFileSync(jsonFile));
const abi = parsed.abi;
abiDecoder.addABI(abi)

const options = {address: process.env.CONTRACT_ADDRESS};
const monitorAddresses = JSON.parse(process.env.MONITOR_ADDRESSES);

web3.eth.subscribe('logs', options, function(error, result){ 
  if (error) console.log(error);
}).on("data", function(log){
  const decodedLogs = abiDecoder.decodeLogs([log]);
  console.log('******** RECEIVED EVENT ********');
  console.log(decodedLogs)
  decodedLogs[0].events.forEach(event => {
    console.log(event)
  });
  console.log('*********** END ***********');
});

let blockSubscription = web3.eth.subscribe('newBlockHeaders')
blockSubscription.subscribe((error, result) => {
	if (error) {
		console.log("Error subscribing to event", error)
		process.exit()
	}
}).on('data', async blockHeader => {
	if (!blockHeader || !blockHeader.number) return
	console.log("Received Block: " + blockHeader.number);
  var block = await web3.eth.getBlock(blockHeader.number)
  if (block.transactions && block.transactions.length > 0) {
    block.transactions.forEach(async tx => {
      transaction = await web3.eth.getTransaction(tx)
      if (monitorAddresses.includes(transaction.to) || monitorAddresses.includes(transaction.from)) {
        console.log('******** RECEIVED TRANSACTION ********');
          console.log(transaction)
        console.log('*********** END ***********');
      }
      
    });
  }
})

