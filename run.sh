URL_SCAN="https://etherscan.io/address/" ADDRESS="0x1071316b698da9947b2f267a02fd77e17ef2fb5b" pm2 start -n ETH "node index.js" --log-date-format "YYYY-MM-DD HH:mm:ss"
# URL_SCAN="https://etherscan.io/address/" ADDRESS="0x1071316b698da9947b2f267a02fd77e17ef2fb5b" pm2 start -n ETH "node index.js" --watch --max-restarts=100 --log-date-format "YYYY-MM-DD HH:mm:ss"