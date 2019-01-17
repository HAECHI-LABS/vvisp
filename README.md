# vvisp

[![CircleCI](https://circleci.com/gh/HAECHI-LABS/vvisp.svg?style=svg)](https://circleci.com/gh/HAECHI-LABS/vvisp)
[![Coverage Status](https://coveralls.io/repos/github/HAECHI-LABS/vvisp/badge.svg?branch=dev)](https://coveralls.io/github/HAECHI-LABS/vvisp?branch=dev)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

> Command Line Interface for the upgradeable smart contract framework. 

vvisp is a new Command Line Interface tool created to help developers easily develop better DApps by providing an upgradeable smart contract framework as well as new development tools.

Upgradeable Smart Contract helps to easily fix bugs and update business logics for the DApp service.
It also provides a high-quality user experience while maintaining the same entry point for users and updating smart contracts atomically.

It helps to develop, upgrade, test, compile and control the user’s current version of the DApp service.

If you want more information about the Upgradeable Smart Contract Framework, you can take a look at the HAECHI-LABS [pdf file](https://drive.google.com/file/d/1H9gtmpiZ5zwIFwgHGOOvz9Oa8SAlpM5h/view?usp=sharing).

| **Contributors**: Please see the [Contributing](#contributing) section of this README. |
| --- |

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Commands](#commands)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

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

**3. Set `.env` file**

Please set environment variables in `.env` file.
See [here](https://github.com/HAECHI-LABS/vvisp/blob/dev/CONFIGURATION.md#env) for more information about `.env`.
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
- [console](./commands/README.md#console): Provides a console environment that can invoke contracts interactively.
- [flatten](./packages/vvisp/commands/README.md#flatten): Flatten several contract files in one file

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
