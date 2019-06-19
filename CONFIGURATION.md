# CONFIGURATION

Korean version: [CONFIGURATION-ko.md](./CONFIGURATION-ko.md)

## <a name="config"></a>vvisp-config.js

`vvisp-config.js` is a file to set environment variables.
If there is no config file in root directory, some functions of vvisp don't work.

You can use your custom config file described as below by adding option like `--configFile custom-config.js`.

You can define those properties:

- `network`:
    The information of network you want to connect to.
    You can choose one of the networks below.
    Default is `development`.

- `networks`:
    The detail information of networks.
  &nbsp;- `platform`:
        The platform you want to connect with. (vvisp is supporting ethereum and klaytn)
        Default is `ethereum`.  
  &nbsp;- `url`:
        The URL you want to connect with.
        The `host` and` port` below are ignored when the corresponding item is present.  
  &nbsp;- `host`:
        The host name required to access the custom blockchain.
  &nbsp;- `port`:
        The port number required to access the custom blockchain.  
  &nbsp;- `websockets`:
        To connect `host` and` port` to websocket, set this item to `true`.  
  &nbsp;- `network_id`:
        The id of the network.    
  &nbsp;- `gasLimit`:
        The gas limit to pay for transactions.
        Default is `6721975`.  
  &nbsp;- `gasPrice`:
        The gas price to pay for transactions.
        Default is `10000000000`(10Gwei)` and unit is wei.
        In Klaytn, the gasPrice is fixed at 25ston(25000000000) and no other values are allowed.  

- `compilers`:
    The detail information of compilers.  
  &nbsp;- `version`:
        The version of solc compiler version you want to use and it needs network communication.
        You can keep it empty to use solc `0.5.0`.  
  &nbsp;- `settings`:
            The settings of the compiler.  
  &nbsp; &nbsp;- `optimizer.enabled`:
            If you don't want to optimize compile, set this `false`.  
  &nbsp; &nbsp;- `optimizer.run`:
            The number of times you intend to run the code for the optimization.
            Default is `200`.  
  &nbsp; &nbsp;- `evmVersion`:
            The version of EVM to use.
            Default version is `byzantium`.  

- `from`:
    The detail information of account to create transactions.
    This can be string type private key or an object about mnemonic.
    Please see to the example below.  
  &nbsp;- `mnemonic`:
        The mnemonic words of an account to make transaction.    
  &nbsp;- `index`:
        The index of private key generated from `from.mnemonic`.
        Default is 0.  

### Example

```javascript
module.exports = {
  network: 'development',
  networks: {
    development: {
      platform: 'ethereum',
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      url: "https://ropsten.infura.io/your_infura_api_key",
      gasLimit: 123123,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: '0.5.3',
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: 'byzantium'
      }
    }
  },
  from: { // or from: '0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d'
    mnemonic:
      'piano garage flag neglect spare title drill basic strong aware enforce fury',
    index: 0
  }
};
```

`vvisp-config.js` can be compatible with `truffle-config.js`.

If you want to use generated `truffle-config.js`, use as below:
```javascript
module.exports = {
  ...require('./truffle-config.js'),
  from: '0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d'
}
```

You can change some of the environment variables mentioned above by using option when you run command.
```
--configFile <fileName> // Read and use your custom configuration file.
-n, --network <network> // Change the network.
-p, --platform <platform> // Change the platform.
--gasLimit <gasLimit> // Change the gasLimit.
--gasPrice <gasPrice> // Change the gasPrice.
--from <privateKey> // Change the privateKey to use.
```

## <a name="service"></a>service.vvisp.json

`service.vvisp.json` is a configuration file that defines a service, a bundle of smart contracts that must be managed with the same versioning scheme.

### Example1
Normally, make file like below:
```
{
  "serviceName": "Haechi", (1)
  "variables" : { (2)
    "varName": "constant"
  },
  "contracts": { (3)
    "ContractKeyName1": { (4)
      "path": "./contracts/Contract1.sol", (5)
      "name": "Contract1" (6)
    },
    "ContractKeyName2": {
      "path": "./contracts/Contract2.sol",
      "name": "Contract2",
      "constructorArguments": [ (7)
        "${contracts.ContractKeyName1.address}", (8)
        "${variables.varName}" (9)
      ],
      "initialize": { (10)
        "functionName": "initialize", (11)
        "arguments": [ (12)
          "argument1",
          "argument2"
        ]
      }
    }
  }
}
```

1. Define the name of service.

1. Set some constant variables in `service.vvisp.json`.
Define a constant variable as a key-value pair.

1. Define the information of contracts as the json format.

1. Define the name of the contract.

1. Set the path to the source code of this contract file.

1. Set the name of the contract you want to deploy.
Default name is the name of the file.

1. If the contract has constructor arguments, write them as an array.
If it does not exist, it can be left as an empty array.

1. You can refer to the address of the contract that is being deployed or deployed.
**Please note cyclic dependency**

1. The value specified by `${variables.varName}` is replaced with `constant` by 3).

1. Define the information of initializing this contract.
`vvisp` calls the function after deployment.
If you do not have to initialize, you can omit this.

1. Write the name of the method responsible for the initialization function.

1. Write the arguments to initialize as an array.
If you do not have to the arguments to initialize, you can omit this.
