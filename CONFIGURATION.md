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
  &nbsp;- `host`:
        The host name required to access the custom blockchain.
        To connect to a specific testnet, just enter the URL.  
  &nbsp;- `port`:
        The port number required to access the custom blockchain.  
  &nbsp;- `network_id`:
        The id of the network.    
  &nbsp;- `gasLimit`:
        The gas limit to pay for transactions.
        Default is `6721975`.  
  &nbsp;- `gasPrice`:
        The gas price to pay for transactions.
        Default is `10000000000`(10Gwei)` and unit is wei.  

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
  network: "development",
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    coverage: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
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
      "path": "path/to/your/contract/Contract1.sol" (5)
    },
    "ContractKeyName2": {
      "path": "contracts/Contract2.sol",
      "constructorArguments": [ (6)
        "${contracts.ContractKeyName1.address}", (7)
        "${variables.varName}" (8)
      ],
      "initialize": { (9)
        "functionName": "initialize", (10)
        "arguments": [ (11)
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


### Example2
If you want to add upgradeability to your service, see this file:
```
{
  "serviceName": "Haechi",
  "variables" : {
    "varName": "constant"
  },
  "registry" : true, (1)
  "contracts": {
    "ContractKeyName1": {
      "upgradeable": true, (2)
      "path": "path/to/your/contract/Contract1_V0.sol",
      "initialize": { (3)
        "functionName": "initialize",
        "arguments": [
          "${contracts.ContractKeyName2.address}", (4)
          "argument2"
        ]
      }
    },
    "ContractKeyName2": {
      "upgradeable": true,
      "path": "contracts/Contract2_V1.sol"
    }
  }
}
```

1. If you set `registry` property `true` to adopt upgradeability to your service.
   Default is `false`.

1. If you want an upgradeable contract, set `upgradeable` property `true`.
vvisp will generate proxy and connect to your business logic automatically.

1. In the case of an upgradeable smart contract, instead of using the constructor, you need to place a separate method, such as `initialize`, to perform the initialization logic here.

1. If the referenced contract is upgradeable, it brings proxy address.
