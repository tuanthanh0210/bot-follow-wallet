const axios = require("axios");
const cheerio = require("cheerio");
const { sentMessageGoogleChat } = require("./ggchat");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ETHERSCAN = "https://etherscan.io/address/";
const URL_SCAN = process.env.URL_SCAN || ETHERSCAN;
console.log("process.env.URL_SCAN: ", process.env.URL_SCAN);
const ADDRESS =
  process.env.ADDRESS || "0x1071316b698da9947b2f267a02fd77e17ef2fb5b";
console.log("process.env.ADDRESS: ", process.env.ADDRESS);

const getNumbersOfTxs = async (url) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const data = $($("div#ContentPlaceHolder1_divTxDataInfo").find("p")[0])
    .text()
    .replaceAll(",", "")
    .trim();
  console.log("data: ", data);
  const numbers_of_transactions = Number(
    data.split(" ")[data.split(" ").length - 2]
  );
  return numbers_of_transactions;
};

let old_numbers_of_transactions = 0;
const run = async () => {
  while (true) {
    const res = await getNumbersOfTxs(URL_SCAN + ADDRESS);
    old_numbers_of_transactions = res;
    if (res > old_numbers_of_transactions) {
      // await sentMessageGoogleChat(
      //   `New transaction of ${ADDRESS}: ${res - old_numbers_of_transactions}`
      // );
      console.log("New transaction: ", res - old_numbers_of_transactions);
    }
    await sleep(60 * 1000);
  }
};

run();
