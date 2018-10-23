#!/bin/bash

ganache-cli --account="0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d,100000000000000000000000"  > /dev/null &
yarn test test/lib/getWeb3.test.js
yarn test test/lib/getWeb3.test.js
yarn test test/lib/mnemonicToPrivateKey.test.js
yarn test test/lib/privateKeyToAddress.test.js
yarn test test/scripts/deploy-service