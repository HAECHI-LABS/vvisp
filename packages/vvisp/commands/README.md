# Commands

Korean version: [README-ko.md](./README-ko.md)  

- [init](#init): Initialize project directory
- [compile](#compile): Compile solidity contract files
- [deploy-contract](#deploy-contract): Deploy contract
- [deploy-service](#deploy-service): Deploy service
- [gen-script](#gen-script): Generate javascript APIs interacting with smart contract on blockchain
- [console](#console): Provides a console environment that can invoke contracts interactively.
- [flatten](#flatten): Flatten several contract files in one file


## init
> vvisp init [options]

Start the project through this command.

#### Examples

```shell
$ vvisp init
```

#### Outputs
```
root/
├── contracts/
├──── vvisp/
├────── VvispRegistry.sol
├──── Migrations.sol
├── migrations/
├──── 1_initial_migration.js
├── scripts/
├──── test.sh
├──── coverage.sh
├── test/
├──── Example.test.js
├── .solcover.js
├── .soliumignore
├── .soliumrc.json
├── .package.json
├── service.vvisp.json
├── truffle-config.json
└── vvisp-config.json
```
> - `package.json` will be created.
Several libraries used by HAECHI LABS have been added.
> - The `contracts` folder will be created.
Contract code, please work here.
> - The `contracts/Migrations.sol` file will be created.
This Contract is necessary for using truffle.
> - The `VvispRegistry.sol` file for registering information about contracts will be created in the `contracts/vvisp` folder.
> - The `vvisp-config.js` file will be created.
Set environment variables here.
[See details](../../../CONFIGURATION.md#config).
> - `.soliumignore`,` .solcover.js`, and `.soliumrc.json` files for [solium](https://github.com/duaraghav8/Solium), a proofing tool for solidity, will be created.
> - `scripts/test.sh` will be created and the` $ npm run test` script will be added to `package.json`.
This is useful for truffle contract testing.
> - `scripts/coverage.sh` will be created and the` $ npm run coverage` script will be added to `package.json`.
This shows the coverage of test codes about your contracts.
> - `truffle-config.js` will be created.
Required when using truffle and contains relevant configuration information.
> - `migrations/1_initial_migration.js` will be created.
Required for truffle testing.
> - `test` folder will be created.
Please create testcode for truffle test here. 
> - For information about truffle, see [truffle documentation](https://truffleframework.com/docs/truffle/overview).
> - You can use [openzeppelin-test-helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers) to help you create test cases.
> - A sample test file, `Example.test.js` will be created in `test/` directory.
> - The `service.vvisp.json` file will be created.
Before you run `$ vvisp deploy-service`, set the variables in the file.
[See details](../../../CONFIGURATION.md#service).


## compile
> vvisp compile [files...] [options]

Compile solidity source code.

#### Examples

```shell
$ vvisp compile contracts/A.sol contracts/B.sol
```

#### Outputs (Created at `build` folder)

```
build/contracts/
├── A.json
└── B.json
```
> If no file name is entered, all solidity files in the `contracts` folder are compiled.


## deploy-contract

> vvisp deploy-contract <file> [arguments...] [options]

Deploy the target contract.

#### Options

`-n, --network <network>`: specify the network to deploy on.  
`-p, --platform <platform>`: specify the platform to deploy on.  
`--gasLimit <gasLimit>` : specify gasLimit to use for deploying.  
`--gasPrice <privateKey>` : specify gasPrice to use for deploying.  
`--from <privateKey>` : specify privateKey to use for deploying.  

#### Examples

```shell
$ vvisp deploy-contract contracts/ContractA.sol input1 input2
```

#### Outputs 

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

#### Options

`-n, --network <network>`: specify the network to deploy on. 
`-p, --platform <platform>`: specify the platform to deploy on.   
`--gasLimit <gasLimit>` : specify gasLimit to use for deploying.  
`--gasPrice <privateKey>` : specify gasPrice to use for deploying.  
`--from <privateKey>` : specify privateKey to use for deploying.
`-f, --force` : remove existing `state.vvisp.json` and deploy.  

#### Example

```
$ vvisp deploy-service
```

#### Process


The deployment sequence is as follows.
If there is no target to deploy, skip that task.

1) Deploy the registry. (Not deployed again during upgrade)

1) Deploy contracts.

1) Save the information of contracts to the registry.

1) Perform initialization of contracts.

#### Outputs

__`state.vvisp.json`__

This is the file where you can view the status of the currently deployed service.

```
{
  "serviceName": "Haechi", (1)
  "registry": "0x00C...", (2)
  "contracts": { (3)
    "ContractKeyName3": { (4)
      "address": "0x863...", (5)
      "fileName": "Contract.sol" (6)
    },
    "ContractKeyName1": {
      "address": "0x73c...",
      "fileName": "Contract1_V0.sol",
    }
  }
}
```

1. The name of the configured service.

1. Indicates the address of the deployed registry.
If you defined not to use, it will be written as `noRegistry`.

1. Json format of the information of deployed contracts.

1. Indicates the name of the name of the deployed contract.

1. Represents the address of deployed contract.

1. Represents the file name (contract name) of the currently deployed contract version.

## gen-script

> vvisp gen-script [filesOrDirectory...] [options]

The `gen-script` is a command that automatically creates a javascript library to help you easily call deployed smart contracts.
The repository used in the tutorial is as follows.
(https://github.com/HAECHI-LABS/vvisp-sample)

If there is no filename entered, this command will automatically generate scripts for all the solidity files in the `contracts/` folder.

#### Usage

`vvisp gen-script [filesOrDirectory...] [options]` 

#### Options

`-f, --front <name>`: Generate JavaScript source code that can be executed in front-end (browser)



#### Example

```bash
$ vvisp gen-script contracts/HaechiV1.sol
Compiling...
compile contracts/HaechiV1.sol...

Generate Finished!

$ vvisp gen-script -f contracts/HaechiV1.sol
Compiling...
compile contracts/HaechiV1.sol...

Generate Finished!
```



#### Output

When you run `gen-script`, the `contractApis/` folder is created in the directory you have run.

```bash
$ ls
README.md           contracts           node_modules        package.json
service.vvisp.json  test                contractApis        migrations
package-lock.json   scripts             service2.vvisp.json truffle-config.js
```

The structure of the generated `contractApis/` folder is as follows:

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

> - The abi files of the contracts are created in `contractApis/front/abi/`.
> - The APIs are created in `contractApis/front/js/`.
**(not needed)**
> - The APIs are bundled in `contractApis/front/name.js`.
(The file name follows the name you entered)


In the case of the front API, it is set to [web3 old version](https://github.com/ethereum/wiki/wiki/wiki/JavaScript-API) for interacting with the Metamask.



#### How to use generated contractApis?

You can easily implement the function of invoking contract using the generated contractApis file.

```javascript
/*
HaechiV1 has following methods

velocities: function(input1) 
haechiIds: function(input1) 
distances: function(input1) 
gym: function()
makeNewHaechi: function(_id)
increaseVelocity: function(_haechiId, _diff)
run: function()
initialize: function(_gym)

*/
// You can give configuration arguments like below.
// If you described vvisp-config.json already, you don't have to give arguments.
const config = {
  from: PRIVATE_KEY,
  gasPrice: GAS_PRICE,
  gasLimit: GAS_LIMIT
};
// Write url or make provider object
const webSetter = 'URL_OR_PROVIDER';
const { HaechiV1 } = require('../contractApis/back')(config, webSetter);

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

> vvisp console <contract-apis> [options]

The `console` is a command providing an interactive and easy-to-use shell environment for contractApis generated by `gen-script`.
The repository used in the tutorial is as follows.
(https://github.com/HAECHI-LABS/vvisp-sample)

**Before starting console, contractApis must be created and contract used to create contractApis must be deployed.**



#### Usage

`vvisp console <contract-apis>` 

If you do not enter a `<contract-apis>` value, it will automatically find `contractApis/` in the current folder and run console.


#### Options

`-n, --network <network>`: specify the network to deploy on. 
`-p, --platform <platform>`: specify the platform to deploy on.   
`--gasLimit <gasLimit>` : specify gasLimit to use for deploying.  
`--gasPrice <privateKey>` : specify gasPrice to use for deploying.  
`--from <privateKey>` : specify privateKey to use for deploying.


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



- show \<Contract>

  ```
  >> show HaechiV1
  
  [Method]                                [Args]
  distances                               [uint256 _id]
  gym                                     []
  haechiIds                               [address _owner]
  increaseVelocity                        [uint256 _haechiId, uint256 _diff]
  initialize                              [address _gym]
  makeNewHaechi                           [uint256 _id]
  run                                     []
  velocities                              [uint256 _id]
  ```

  `show` command shows a list of methods that contract can use.



- call \<Contract> \<Method> \[Arguments]

  ```
  >> call HaechiV1 makeNewHaechi 123
  {
    "transactionHash": "0x8ee8273a95c8f9e09e56358bd0c05ff1bf81a1ce91ea0b212347fb42c08dbcc6",
    "transactionIndex": 1,
    "blockNumber": 2493275,
    "from": "0x0d4010164401111f7bcf862e95708dd0624a1115",
    "to": "0x3f2e170de66ca0ed6c66db38479a8f8c33835475",
    "gasUsed": 63753,
    "logs": [
      {
        "transactionHash": "0x8ee8273a95c8f9e09e56358bd0c05ff1bf81a1ce91ea0b212347fb42c08dbcc6",
        "name": "NewHaechi",
        "args": {
          "id": "123",
          "owner": "0x0D4010164401111f7bcF862e95708DD0624a1115"
        }
      }
    ]
  }
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

3. The name of automatically generated js files(such as `HaechiV1.js` and `HaechiGym.js` in `contractApis/back/js`) by `gen-script` must be the same as the contracts in `state.vvisp.json`.


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
