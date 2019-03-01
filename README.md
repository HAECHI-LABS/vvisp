# vvisp

[![CircleCI](https://circleci.com/gh/HAECHI-LABS/vvisp.svg?style=svg)](https://circleci.com/gh/HAECHI-LABS/vvisp)
[![Coverage Status](https://coveralls.io/repos/github/HAECHI-LABS/vvisp/badge.svg?branch=dev)](https://coveralls.io/github/HAECHI-LABS/vvisp?branch=dev)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

> The most convenient smart contract development framework and command line interface on EVM based blockchain. 

**Simple and fast smart contract deployment and execution with a single command line**

###Key Benefits
 - Improving Blockchain Service Development Environment
 - Shortening Operating Time of Blockchain Service Development 
 - Shortening the Running Curve of Global Developers Who Are Not Familiar with Blockchain

## Table of Contents

- [Description](#description)
- [Install](#install)
- [Usage](#usage)
- [Commands](#commands)
- [Contributing](#contributing)
- [Architecture](#architecture)
- [Contact](#contact)
- [License](#license)

## Description
**CLI tools that are easy to use for developers who are not familiar with blockchain.**

: Smart contracts of the blockchain are unfamiliar development areas.
There are a lot of things that developers are unfamiliar with DApp development.
Even if you create a contract by referring to several references, there is a barrier to how to deploy it and how to use it.
vvisp is a command line interface (CLI) tool designed to reduce this inconvenience. 

**(1) Deploying a contract with one command line**

: Deploying smart contracts to a blockchain is an unfamiliar process for developers.
In order to deploy a contract, you must write your smart contract deployment code as well as create a smart contract.
To deploy multiple smart contracts that make up DApp, developers also had to consider the order of deployment.
If you simply define your deployment targets as a simple configuration file, vvisp considers the deployment order and deploys contracts in a single command line automatically with no code to write, .

**(2) Executing the contract function with one command line**

: Developers had to study the library, call the function, and manually write the function call code to execute the function of a contract.
This serves as a barrier to entry for developers who are unfamiliar with smart contract development.
However, vvisp is designed to execute a specific function of a contract through a single command line and to receive results without a series of tasks.

**(3) Supporting Upgradeable Smart Contract Framework**

vvisp also supports USCF(Upgradeable Smart Contract Framework).
If you want more information about the Upgradeable Smart Contract Framework, you can take a look at the HAECHI-LABS [pdf file](https://drive.google.com/file/d/1H9gtmpiZ5zwIFwgHGOOvz9Oa8SAlpM5h/view?usp=sharing).

| **Contributors**: Please see the [Contributing](#contributing) section of this README. |
| --- |

## Install

Install [Node.js](http://nodejs.org/) first.
Then, install [npm](https://npmjs.com/) and
```sh
$ npm install --global @haechi-labs/vvisp
```
or install [yarn](https://yarnpkg.com) and
```sh
$ yarn global add @haechi-labs/vvisp
```

## Usage

If you want to see sample repository and demo, see [here](https://github.com/HAECHI-LABS/vvisp-sample).

**1. Initialize your directory**
```sh
$ mkdir my-project
$ cd my-project
$ vvisp init
```
You don't have to do `` $ npm init `` or ``$ truffle init``.
We supports environment for [truffle](https://truffleframework.com/truffle).

_[See details](./packages/vvisp/commands/README.md#init)_ for ``$ vvisp init``.

**2. Make your Contracts at `contracts/`**

We do not recommend generated contracts by `$ vvisp init`.
Now, you can use `abi-to-script`, `compile` and `flatten` commands.

**3. Set `vvisp-config.js` file**

Please set environment variables in `vvisp-config.js` file.
See [here](https://github.com/HAECHI-LABS/vvisp/blob/dev/CONFIGURATION.md#config) for more information about `vvisp-config.js`.
Now you can use `deploy-contract` command.

**4. Set `service.vvisp.json` file**

Please set information about your DApp service in `service.vvisp.json`.
See [here](https://github.com/HAECHI-LABS/vvisp/blob/dev/CONFIGURATION.md#service) for more information about `service.vvisp.json`.
Now you can use `deploy-service` command.

Please see [CONFIGURATION.md](./CONFIGURATION.md) to configure your project.

Run `$ vvisp --help` for more details about functions of vvisp.

## Commands

Please see linked documentation below:
- [init](./packages/vvisp/commands/README.md#init): Initialize project directory
- [compile](./packages/vvisp/commands/README.md#compile): Compile solidity contract files
- [deploy-contract](./packages/vvisp/commands/README.md#deploy-contract): Deploy contract
- [deploy-service](./packages/vvisp/commands/README.md#deploy-service): Deploy service according to Upgradeable Smart Contract Framework
- [abi-to-script](./packages/vvisp/commands/README.md#abi-to-script): Generate javascript APIs interacting with smart contract on blockchain
- [console](./packages/vvisp/commands/README.md#console): Provides a console environment that can invoke contracts interactively
- [flatten](./packages/vvisp/commands/README.md#flatten): Flatten several contract files in one file



## Architecture

<p align="center"><img src="./images/[vvisp]logical-view.png" width="550px" height="300px"></p>

vvisp communicates with main-net, test-net through rpc, and helps to develop, upgrade, test, compile and control the user’s current version of the DApp service.
vvisp supports truffle test framework.



<p align="center"><img src="./images/[vvisp]module-view.png" width="630px" height="450px"></p>

- vvisp

  vvisp consists of vvisp-utils, vvisp and vvisp-contracts.

  - vvisp-utils

    vvisp-utils provides several useful functions for use with vvisp or vvisp-sample.

  - vvisp

    vvisp performs the core logic of vvisp.

  - vvisp-contracts

    vvisp-contracts is a library for developing smart contracts and enables them to be upgradable.

- vvisp-sample

  vvisp-sample is the boilerplate package generated by `vvisp init` command.

  - contractApis

    It is generated automatically by the `vvisp abi-to-script` command and provides a javascript library that allows you to easily execute deployed projects.

  - configuration

    These are the configuration files needed for vvisp to work and test such as `vvisp-config.js`, `service.vvisp.json`, `state.vvisp.json`, `truffle-config.js`

  - test

    These are test cases of user-written contracts.

  - contracts

    contracts consist of the lib and upgradeable contract that is automatically generated by the `vvisp init` command and the contract that the user write himself.



## Contributing

Thank you for considering to join this project! We always welcome contributors :)

*Notes on project main branches:*
- `master`: Stable, released version
- `dev`: Work targeting stable release

To contribute, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contact 

- General Contact: hello@haechi.io
- [Facebook](https://www.facebook.com/HAECHILABS/)
- [Medium](https://medium.com/haechi-labs)

## License

MIT
