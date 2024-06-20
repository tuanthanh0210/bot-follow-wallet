const { Web3 } = require("web3");

const web3_ETH = new Web3("https://ethereum.rpc.subquery.network/public");
// const web3 = new Web3("https://binance.llamarpc.com");

// module.exports = { web3 };

const getAllTxsInToWallet = async (address) => {
  const rs = await web3_ETH.eth.getTransactionCount(address);
  console.log("rs: ", await web3_ETH.utils.toNumber(rs));
};

getAllTxsInToWallet("0x1071316b698da9947b2f267a02fd77e17ef2fb5b");
