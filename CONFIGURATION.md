
# CONFIGURATION

Korean version: [CONFIGURATION-ko.md](./CONFIGURATION-ko.md)

## <a name="env"></a>.env

We use [dotenv](https://github.com/motdotla/dotenv) that loads environment variables from a `.env` file into [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env).

> `.env` is a file to set environment variables. If there is no `.env` file in root directory, some functions of vvisp don't work and print ```.env file does not exist``` error message.

- `NETWORK`: The name of network you want to connect to. We use [infura](https://infura.io/) except local network. Choose one of [local, mainnet, ropsten, kovan, rinkeby, custom]. ***REQUIRED***
- `URL`: the URL address required to access the custom blockchain.
- `PORT`: The port number you want to connect to when local network is chosen.
- `INFURA_API_KEY`: It is the api key required connect to an external network. You can sign in and get key at [infura](https://infura.io/).
- `MNEMONIC`: The mnemonic key of an account to make transaction. ***REQUIRED***
- `PRIV_INDEX`: The index of private key generated from MNEMONIC. Default is 0.
- `GAS_PRICE`: The gas price to pay for transactions. Default is 10Gwei and unit is wei. 
- `GAS_LIMIT`: The gas limit to pay for transactions. Default is 4600000.
- `SOLC_VERSION`: The version of solc compiler version you want to use and it needs network communication. You can keep it empty to use local compiler in vvisp. 
- `SOLC_OPTIMIZATION`: If you don't want to optimize compile, set this false. Default is true.
- PRIVATE_KEY: private key for specific account. *IT OVERRIDES MNEMONIC OPTIONS!!!*

### Example

```.dotenv
NETWORK= 'local'                // Network you want to connect to
URL=                            // Required in custom network.
PORT= '7545'                    // Port number of local network
INFURA_API_KEY=                 // Not required in local or custom network 
MNEMONIC= "royal pact globe..." // Mnemonic key words for private key of ethereum wallet
GAS_PRICE= 20000000000          // 20Gwei
GAS_LIMIT= 5000000              // 5 million
SOLC_VERSION=                   // Use local compiler
SOLC_OPTIMIZATION=              // Use optimization
PRIVATE_KEY=                    // private key
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
