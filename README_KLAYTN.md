# vvisp

 - [Sample repository utilizing vvisp](https://github.com/HAECHI-LABS/vvisp-sample)

## Quick Usage

**1. Install vvisp**
```bash
$ npm install -g @haechi-labs/vvisp
#or if you use yarn
$ yarn global add @haechi-labs/vvisp
```
Use version >= v2.0.0

**2. Initialize your directory**
```bash
$ vvisp init my-project
$ cd my-project

$ npm install #or yarn install
```
**3. Make your Contracts at `contracts/`**

Now, you can use `gen-script`, `compile` and `flatten` commands.

**4. Set `vvisp-config.js` file**

Please set environment variables in `vvisp-config.js` file.

_Example_
```javascript
const MNEMONIC = 'YOUR_MNEMONIC';

module.exports = {
  networks: {
    development: {
      platform: 'klaytn',
      url: 'URL_TO_KLAYTN_NODE',
      gasLimit: 10000000, // increase if you need
    }
  },
  compilers: {
    solc: {
      version: '0.4.24'
    }
  },
  from: { // or from: 'YOUR_PRIVATE_KEY'
    mnemonic: MNEMONIC,
    index: 0
  },
};
```

See more information at [here](./CONFIGURATION.md#config) for more information about `vvisp-config.js`.
Now you can use `deploy-contract` command.

**5. Set `service.vvisp.json` file**

Please set information about your DApp service in `service.vvisp.json`.

_Example_
```json
{
  "serviceName": "Haechi",
  "variables" : {
    "exampleVarName": 123
  },
  "contracts": {
    "ContractKeyName1": {
      "path": "path/to/your/contract/Contract1.sol",
      "name": "Contract1",
      "constructorArguments": [
        "${contracts.ContractKeyName1.address}",
        "${variables.exampleVarName}"
      ],
      "initialize": {
        "functionName": "initialize",
        "arguments": ["argument1", "argument2"]
      }
    },
    "ContractKeyName2": {
      "path": "path/to/your/contract/Contract2.sol",
      "name": "Contract2",
      "initialize": {
        "functionName": "initialize",
        "arguments": ["argument1", "argument2"]
      }
    }
  }
}

```
See more information at [here](./CONFIGURATION.md#service) for more information about `service.vvisp.json`.
Now you can use `deploy-service` command.

### Deploy First Version

1. Write `service.vvisp.json` file.
1. Make `from` variable in `vvisp-config.js`.
See more details at [here](./CONFIGURATION.md#vvisp-configjs).
1. Run `vvisp deploy-service` at root directory.
It will act like [this demo](https://youtu.be/tEpBaaZDGpw).
1. Wait for deploying the sample app.
Then, `state.vvisp.json` will be generated.
**This file is necessary to upgrade your service**

### Upgrade to Second Version
Add contract property at `service.vvisp.json#contracts` like:
```json
"contracts": {
  ...
  "NewContract": {
    "path": "contracts/NewContract.sol",
    "name": "NewContract"
  }
}
```

Then, run `vvisp deploy-service`.
It will act like [this demo](https://youtu.be/f4WaBhsk_IQ).

> See more details about `vvisp deploy-service` at [here](./packages/vvisp/commands/README.md#deploy-service)

### Use console
If the service is already deployed and has `state.vvisp.json`(**necessary**), you can operate your contracts with `vvisp console`.

First, make apis of contracts which are written in `state.vvisp.json`.
```bash
 $ vvisp gen-script
```

Then run `vvisp console` and operate functions of your contracts.

> See more details about `vvisp console` at [here](./packages/vvisp/commands/README.md#console)

## Contract

- Create your own contracts in `contracts/` directory.
- Not recommend modifying contracts in `vvsip/` directory.

## Test

- We support use [truffle](https://truffleframework.com/truffle) framework.
- Create test files in `test/` directory.
- Run `npm run test` to test all test files in `test/` directory or `npm run test <fileName>` to test specific file.

## Commands

Please see [here](./packages/vvisp/commands/README.md) for details.

## Contact 

- General Contact: hello@haechi.io
- [Facebook](https://www.facebook.com/HAECHILABS/)
- [Medium](https://medium.com/haechi-labs)
