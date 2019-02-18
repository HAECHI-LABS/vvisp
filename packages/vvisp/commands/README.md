# Commands

Korean version: [README-ko.md](./README-ko.md)  

- [init](#init): Initialize project directory
- [compile](#compile): Compile solidity contract files
- [deploy-contract](#deploy-contract): Deploy contract
- [deploy-service](#deploy-service): Deploy service according to Upgradeable Smart Contract Framework
- [abi-to-script](#abi-to-script): Generate javascript APIs interacting with smart contract on blockchain
- [console](#console): Provides a console environment that can invoke contracts interactively.
- [flatten](#flatten): Flatten several contract files in one file


## init
> vvisp init [options]

Start the project through this command.

__Examples__

```shell
$ vvisp init
```

__Outputs__
```
root/
├── contracts/
├──── upgradeable/
├────── VvispRegistry.sol
├──── Migrations.sol
├── migrations/
├──── 1_initial_migration.js
├── scripts/
├──── test.sh
├──── coverage.sh
├── test/
├──── Example.test.js
├── .env
├── .solcover.js
├── .soliumignore
├── .soliumrc.json
├── .package.json
├── service.vvisp.json
└── truffle-config.json
```
> - `package.json` is created. Several libraries used by HEACHI LABS have been added.
> - The `contracts` folder is created. Contract code, please work here.
> - The `contracts/Migrations.sol` file is created. This Contract is necessary for using truffle.
> - The `VvispRegistry.sol` file for the upgradeable smart contract framework are copied in the `contracts/upgradeable` folder.
> - The `.env` file is created. Set environment variables here. [See details](../../../CONFIGURATION.md#env).
> - `.soliumignore`,` .solcover.js`, and `.soliumrc.json` files for [solium](https://github.com/duaraghav8/Solium), a proofing tool for solidity, are created.
> - `scripts/test.sh` is created and the` $ npm run test` script is added to `package.json`. This is useful for truffle contract testing.
> - `scripts/coverage.sh` is created and the` $ npm run coverage` script is added to `package.json`. This shows the coverage of test codes about your contracts.
> - `truffle-config.js` will be created. Required when using truffle and contains relevant configuration information.
> - `migrations/1_initial_migration.js` will be created. Required for truffle testing.
> - `test` folder will be created. Please create testcode for truffle test here. 
> - For information about truffle, see [truffle documentation](https://truffleframework.com/docs/truffle/overview).
> - You can use [openzeppelin-test-helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers) to help you create test cases.
> - A sample test file, `Example.test.js` is created in `test/` directory.
> - The `service.vvisp.json` file is created. Before you run `$ vvisp deploy-service`, set the variables in the file. [See details](../../../CONFIGURATION-ko.md#service).


## compile
> vvisp compile [_files..._] [options]

Compile solidity source code.

__Examples__

```shell
$ vvisp compile contracts/Proxy.sol contracts/UpgradeabilityProxy.sol
```

__Outputs__ (Created at `build` folder)

```
build/contracts/
├── BytesLib.json
├── Ownable.json
├── OwnedUpgradeabilityProxy.json
├── Proxy.json
├── Registry.json
├── SafeMath.json
└── UpgradeabilityProxy.json
```
> If no file name is entered, all solidity files in the `contracts` folder are compiled.


## deploy-contract

> vvisp deploy-contract <_file_> [_arguments..._] [options]

Deploy the target contract.

__Examples__

```shell
$ vvisp deploy-contract contracts/ContractA.sol input1 input2
```
__Outputs__ 

```shell
ContractA Deploying...
ContractA Created!
Contract Address : 0xcfb...
```
> The contract is deployed according to the configured environment variable, and after waiting for confirmation, the generated contract address is printed out.


## deploy-service

> vvisp deploy-service [options]

Deploy the service described in `service.vvisp.json`.
First, we make sure that `service.vvisp.json` is defined.
If it is defined, we deploy the proxy contract corresponding to the contract and the registry contract corresponding to the service.
When it is first deployed, `state.vvisp.json` is created to save the deployment status.
If you upgrade to another version later, you can change `service.vvisp.json` and deploy again.
The service will be upgraded to the state defined in modified `service.vvisp.json`.

If deployment fails due to an unexpected problem during deployment, re-enter the command and redeploy it from the point of interruption.

**It is not recommended to change `state.vvisp.json` unless it is a special case.**

To create `service.vvisp.json`, see [here](../../../CONFIGURATION.md#service).

__Example__

```
$ vvisp deploy-service
```

__Process__


The deployment sequence is as follows. If there is no target to deploy, skip that task.

1) Deploy the registry. (Not deployed during upgrade)

2) Deploy business contracts of upgradeable contracts.

3) Deploy proxy contracts of upgradeable contracts.

4) Deploy nonUpgradeable contracts.

5) Save the information of nonUpgradeable contracts to the registry.

6) Connect upgradeable contracts with the registry. This is a real upgrade, and it happens atomically in one transaction.

7) Save additional information of upgradeable contracts to the Registry.

8) Perform initialization of nonUpgradeable contracts.

__Outputs__

__`state.vvisp.json`__

This is the file where you can view the status of the currently deployed service.

```
{
  "serviceName": "Haechi", (1)
  "registry": "0x00C...", (2)
  "contracts": { (3)
    "ContractKeyName1": { (4)
      "address": "0x73c...", (5)
      "proxy": "0x8d7...", (6)
      "fileName": "Contract1_V0.sol", (7)
      "upgradeable": true (8)
    },
    "ContractKeyName2": {
      "address": "0x67B...",
      "proxy": "0xcf2...",
      "fileName": "Contract2_V1.sol",
      "upgradeable": true
    },
    "ContractKeyName3": {
      "address": "0x863...",
      "fileName": "Contract.sol"
    }
  }
}
```

1) The name of the configured service.

2) Indicates the address of the deployed registry.

3) Define the information of contracts deployed in json format.

4) Indicates the name of the name of the deployed contract.

5) Represents the address of deployed contract.
The entry point for a nonUpgradeable contract.

6) Represents the proxy address of deployed upgradeable contract.
For an upgradeable contract, proxy is the entry point.
For nonUpgradeable contract, there is no such property.

7) Represents the file name (contract name) of the currently deployed contract version.

8) This property represents upgradeable contract.

## abi-to-script

> vvisp abi-to-script <_files..._> [options]

The `abi-to-script` is a command that automatically creates a javascript library to help you easily call deployed smart contracts. The repository used in the tutorial is as follows.(https://github.com/HAECHI-LABS/vvisp-sample)

#### Usage

`vvisp abi-to-script <contract-files...> [options]` 

#### options

`-f, --front <name>`: Generate JavaScript source code that can be executed in front-end (browser)



#### Example

```bash
$ vvisp abi-to-script contracts/HaechiV1.sol
Compiling...
compile contracts/HaechiV1.sol...

Generate Finished!

$ vvisp abi-to-script -f contracts/HaechiV1.sol
Compiling...
compile contracts/HaechiV1.sol...

Generate Finished!
```



#### Output

When you run `abi-to-script`, the `contractApis` folder is created in the directory you have run.

```bash
$ ls
README.md           contracts           node_modules        package.json        service.vvisp.json  test                contractApis        migrations          package-lock.json   scripts             service2.vvisp.json truffle-config.js
```

 The structure of the generated `contractApi` folder is as follows.

```
contractApis/
├── back/
├──── abi/
├────── HaechiV1.json
├────── ...
├──── js/
├────── HaechiV1.js
├────── ...
├── front/
├──── abi/
├────── HaechiV1.json
├────── ...
├──── js/
├────── HaechiV1.js
├────── ...
└──── index.js
```

> - The abi files of the contracts are created in `contractApis/back/abi/`.
> - The APIs are created in `contractApis/back/js/`.



- `-f, --front <name>` option

> - The abi files of the contracts are created in `contractApis / front / abi /`.
> - The APIs are created in `contractApis/front/js/`. **(not needed)**
> - The APIs are bundled in `contractApis/front/name.js`. (The file name follows the name you entered)



In the case of the front API, it is set to [web3 old version](https://github.com/ethereum/wiki/wiki/wiki/JavaScript-API) for interacting with the Metamask.



#### How to use generated contractApis?

You can easily implement the function of invoking contract using the generated contractApis file.

```javascript
// Set the environment variable in the .env file.
require('dotenv').config();

/*
HaechiV1 has following methods

velocities: function(_input1) 
haechiIds: function(_input1) 
distances: function(_input1) 
gym: function()
makeNewHaechi: function(__id, options)
increaseVelocity: function(__haechiId, __diff, options)
run: function(options)
initialize: function(__gym, options)

*/
const { HaechiV1 } = require('../contractApis/back');

main();

async function main() {
  // HaechiV1_ADDRESS is a address of HaechiV1 contract
  const haechiV1 = new HaechiV1(HaechiV1_ADDRESS);

  // call the run method in the HaechiV1 contract
  const receipt = await haechiV1.methods.run();
  console.log(receipt);
}
```



## console

> vvisp console <_contract-apis_> [options]

The `console` is a command providing an interactive and easy-to-use shell environment for contractApis generated by abi-to-script. The repository used in the tutorial is as follows.(https://github.com/HAECHI-LABS/vvisp-sample)

**Before starting console, contractApis must be created and contract used to create contractApis must be deployed.**



#### Usage

`vvisp console <contract-apis>` 

If you do not enter a `<contract-apis>` value, it will automatically find contractApis in the current folder and run console.



#### Example

```bash
$ vvisp console
Available contract contracts:

Index				Contract				Address
[0]				HaechiGym				0x5c06aa41561Ef806dA109B1e9c6271208e203758
[1]				HaechiV1				0xc95663de3398D74972c16Ad34aCd0c31baa6859e
[2]				SampleToken				0x8C894a56e0B036Af7308A01B5d8EE0F718B03554


If you are wondering how to use it, type help command.
Use exit or Ctrl-c to exit
>>
```

Once you start the vvisp console, you can easily invoke the registered contract using the vvisp console command.



#### Command

The commands available in the vvisp console are call, show list help exit.

- help

  ```
  >> help
  Usage: <command> [<args...>]
  
  where <command> is one of: call, show, list, help
  
  Commands:
  
  list                                 - list the available smart contracts
  
  show <Contract>                      - show the available method of a smart contract
  
  call <Contract> <Method> [Params...] - call a smart contract api method
  ```

  `Help` command shows currently available commands.

	

- list

  ```
  >> list
  Index			Contract				Address
  [0]			HaechiGym				0x5c06aa41561Ef806dA109B1e9c6271208e203758
  [1]			HaechiV1				0xc95663de3398D74972c16Ad34aCd0c31baa6859e
  [2]			SampleToken				0x8C894a56e0B036Af7308A01B5d8EE0F718B03554
  
  ```

  `list` command shows the list of contract and address



- show <Contract>

  ```
  >> show HaechiV1
  
  [Method]				[Args]
  velocities                              [_input1]
  haechiIds                               [_input1]
  distances                               [_input1]
  gym                                     []
  makeNewHaechi                           [__id, options]
  increaseVelocity                        [__haechiId, __diff, options]
  run                                     [options]
  initialize                              [__gym, options]
  ```

  `show` command shows a list of methods that contract can use.



- call <Contract> <Method>

  ```
  >> call HaechiV1 run
  { transactionHash: '0xeb16014e4cfe6129ebfd66cb4577e864d3f79ceb087a590595872bde45822b7f',
    transactionIndex: 0,
    blockHash: '0xd21bdcbee4f797446afef49c7a63231168cc7f7410a59e1e98b09aba5c00a9e0',
    blockNumber: 11,
    from: '0x9f2a369f37f20a5c8d1ca7a2aaae216bc57c3b1f',
    to: '0xc95663de3398d74972c16ad34acd0c31baa6859e',
    gasUsed: 28800,
    cumulativeGasUsed: 28800,
    contractAddress: null,
    logs:
     [ { logIndex: 0,
         transactionIndex: 0,
         transactionHash: '0xeb16014e4cfe6129ebfd66cb4577e864d3f79ceb087a590595872bde45822b7f',
         blockHash: '0xd21bdcbee4f797446afef49c7a63231168cc7f7410a59e1e98b09aba5c00a9e0',
         blockNumber: 11,
         address: '0xc95663de3398D74972c16Ad34aCd0c31baa6859e',
         data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
         topics: [Array],
         type: 'mined',
         id: 'log_17beff72' } ],
    status: true,
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    v: '0x1b',
    r: '0x91f248cc00b8e65f4f0bdb2f9e97e2b9d4dfe34428b81402b6719b605c1f40a1',
    s: '0x5aab1c8bdbd1acb14397928fe951a906b1420ed7c287fa6db39b706513d93f85' }
  ```

  `call` command executes the contract's method.


#### Tips

1. There should be no inconsistency with the `state.vvisp.json` file and `contractApis/`.

2. If only `contractApis/` exists and the `state.vvisp.json` file does not exist, the address of contract will be entered via stdin.

   ```bash
   $ vvisp console
   'state.vvisp.json' does not existing in current path(/Users/jun/workspace/haechi/vvisp-sample)
   
   Run 'vvisp deploy-service' command to create state.vvisp.json and rerun 'vvisp console' again,
   or enter the address of the currently registered contract
   
   Available contract contracts:
   HaechiGym
   HaechiV1
   SampleToken
   
   Enter the address of HaechiGym: 0x5c06aa41561Ef806dA109B1e9c6271208e203758
   
   Enter the address of HaechiV1: 0xc95663de3398D74972c16Ad34aCd0c31baa6859e
   
   Enter the address of SampleToken: 
   ```

3. The name of automatically generated js files(such as `HaechiV1.js` and `HaechiGym.js` in contractApis/back/js) by `abi-to-script` must be the same as the contracts in state.vvisp.json.


## flatten
> vvisp flatten <_files..._> [options]

It bundles target contracts and imported contracts into one file. 

__Options__

`-o, --output <name>` : Create a flatten result in the current directory as a file with a file name of `name`.

__Examples__

```shell
$ vvisp flatten contracts/ContractA.sol -o Output.sol
```
__Outputs__ 
> It bundles the target contracts and all the files that depend on each contract into a single console window.

 - `-o, --output <name>` option
> The information to be output to the console is written to a file with the name you entered.
