
# CONFIGURATION

Korean version: [CONFIGURATION-ko.md](./CONFIGURATION-ko.md)

## <a name="config"></a>vvisp-config.js

> `vvisp-config.js` is a file to set environment variables. If there is no config file in root directory, some functions of vvisp don't work and print ```vvisp-config.js file does not exist``` error message.

- `network`: The information of network you want to connect to. You can choose one of the networks below. Default is development.

- `networks`: The detail informaion of networks.
&nbsp;- `host`: The host name required to access the custom blockchain. To connect to a specific testnet, just enter the URL. 
&nbsp;- `port`: The port number required to access the custom blockchain. 
&nbsp;- `network_id`: The id of the network. Default is * and this means that it can match any network id.
&nbsp;- `gasLimit`: The gas limit to pay for transactions. Default is 4600000.
&nbsp;- `gasPrice`: The gas price to pay for transactions. Default is 10Gwei and unit is wei. 

- `compilers`: The detail informaion of networks. 
&nbsp;- `version`: The version of solc compiler version you want to use and it needs network communication. You can keep it empty to use solc 0.5.0. 
&nbsp;- `settings`: The settings of the compiler. 
&nbsp; &nbsp;- `optimizer.enabled`: If you don't want to optimize compile, set this false.
&nbsp; &nbsp;- `optimizer.run`: The number of times you intend to run the code for the optimization.
&nbsp; &nbsp;- `evmVersion`: The version of EVM to use.

- `from`: The detail information of transaction.
&nbsp;- `mnemonic`: The mnemonic key of an account to make transaction.
&nbsp;- `index`: The index of private key generated from MNEMONIC. Default is 0.

### Example

```vvisp-config.js
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
      version: '0.4.25', 
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: 'byzantium'
      }
    }
  },
  from: {
    mnemonic:
      'piano garage flag neglect spare title drill basic strong aware enforce fury',
    index: 0
  }
};
```


## <a name="service"></a>service.vvisp.json

`service.vvisp.json` is a configuration file that defines a service, a bundle of smart contracts that must be managed with the same versioning scheme. 

### Example

```
{
  "serviceName": "Haechi", (1)
  "variables" : { (2)
    "varName": "constant" (3)
  },
  "registry" : true, (4)
  "contracts": { (5) 
    "ContractKeyName1": { (6)
      "upgradeable": true, (7)
      "path": "path/to/your/contract/Contract1_V0.sol", (8)
      "initialize": { (9)
        "functionName": "initialize", (10)
        "arguments": [ (11)
          "argument1",
          "argument2"
        ]
      }
    },
    "ContractKeyName2": { (12)
      "upgradeable": true,
      "path": "contracts/Contract2_V1.sol"
    },
    "ContractKeyName3": {
      "path": "path/to/your/contract/Contract.sol",
      "constructorArguments": [ (13)
        "${contracts.ContractKeyName1.address}", (14)
        "${variables.varName}" (15)
      ],
      "initialize": { (16)
        "functionName": "initialize",
        "arguments": [
          "argument1",
          "argument2"
        ]
      }
    }
  }
}

```

1) Define the name of service.

1) Set some constant variables in`service.vvisp.json`. We recommend defining constant values ​​to be used repeatedly in here.

1) Define a constant variable as a key-value pair.

1) If you don't have any upgradeable contracts, you can omit registry.
If you want, set `registry` property `false`.
Default is `true`.

1) Define the information of contracts as the json format.

1) Define the name of the contract.

1) If you want an upgradeable contract, set `upgradeable` property `true`.

1) Set the path to the source code of this contract file. 

1) Define the information of initializing this contract. In the case of an upgradeable smart contract, instead of using the constructor, you need to place a separate method, such as `initialize`, to perform the initialization logic here.

1) Write the name of the method responsible for the initialization function. We recommend using an intuitively understandable method name such as `initialize`.

1) Write an array of arguments to initialize.

1) If you do not have an argument to initialize, you can omit this.

1) For a nonUpgradeable contract, you can use a constructor. For that attribute, enter constructor arguments. If it does not exist, it can be left as an empty array.

1) You can refer to the address of the contract that is being deployed or deployed. For an upgradeable contract, the address of the proxy is entered. **Please note cyclic dependency** 

1) The value specified by `${variables.varName}` is replaced with `constant` by 3). 

1) You can also specify `initialize` for a nonUpgradeable contract. vvisp calls the function after deployment.
