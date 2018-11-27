# Commands

Korean version: [README-ko.md](./README-ko.md)  

- [init](#init): Initialize project directory
- [compile](#compile): Compile solidity contract files
- [deploy-contract](#deploy-contract): Deploy contract
- [deploy-service](#deploy-service): Deploy service according to Upgradeable Smart Contract Framework
- [abi-to-script](#abi-to-script): Generate javascript APIs interacting with smart contract on blockchain
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
├── migrations/
├──── 1_initial_migration.js
├── scripts/
├──── test.sh
├── test/
├──── helpers/
├────── advanceToBlock.js
├────── ...
├── .babelrc
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
> - The necessary libraries for the upgradeable smart contract framework are copied into the `contracts/upgradeable` and` contracts/libs` folders. We do not recommend revision.
> - A `.babelrc` file is created. Supports ES6 grammar.
> - The `.env` file is created. Set environment variables here. [See details](../../../CONFIGURATION.md#env).
> - `.soliumignore`,` .solcover.js`, and `.soliumrc.json` files for [solium](https://github.com/duaraghav8/Solium), a proofing tool for solidity, are created.
> - `scripts/test.sh` is created and the` $ npm run test` script is added to `package.json`. This is useful for truffle contract testing.
> - `truffle-config.js` will be created. Required when using truffle and contains relevant configuration information.
> - `migrations/1_initial_migration.js` will be created. Required for truffle testing.
> - `test` folder will be created. Please create testcode for truffle test here. 
> - For information about truffle, see [truffle documentation](https://truffleframework.com/docs/truffle/overview).
> - The useful libraries provided by HAECHI LABS for contract testing are created in the `test/helpers` folder.
> - The `service.vvisp.json` file is created. Before you run `$ vvisp deploy-service`, set the variables in the file. [See details](../CONFIGURATION-ko.md#service).


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

Automatically generate JavaScript source code to interact with the deployed contracts.

__Options__

`-f, --front <name>`: Generate JavaScript source code that can be executed in front-end (browser)

__Examples__

```shell
$ vvisp abi-to-script contracts/OwnedUpgradeabilityProxy.sol...
$ vvisp abi-to-script -f service contracts/OwnedUpgradeabilityProxy.sol...
```

__Outputs__

```
contractApis/
├── back/
├──── abi/
├────── Contract1.json
├────── ...
├──── js/
├────── Contract1.js
├────── ...
├──── utils/
├──── index.js
├── front/
├──── abi/
├────── Contract1.json
├────── ...
├──── js/
├────── name.js
├────── Contract1.js
├────── ...
├──── name.es.js
└──── name.js
```

> - The abi files of the contracts are created in `contractApis/back/abi/`.
> - The APIs are created in `contractApis/back/js/`.
> - The libraries needed for APIs are created in `contractApis/back/utils/`.

 - `-f, --front <name>` option
> - The abi files of the contracts are created in `contractApis / front / abi /`.
> - The APIs are created in `contractApis/front/js/`. **(not needed)**
> - The APIs are bundled in `contractApis/front/name.js`. (The file name follows the name you entered)

In the case of the front API, it is set to [web3 old version](https://github.com/ethereum/wiki/wiki/wiki/JavaScript-API) for interacting with the Metamask.


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
