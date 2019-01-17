# Commands

English version: [README.md](./README.md)  

- [init](#init): 프로젝트 폴더 구축
- [compile](#compile): 폴더 내에 있는 솔리디티 소스를 컴파일
- [deploy-contract](#deploy-contract): 특정 컨트랙트를 배포
- [deploy-service](#deploy-service): Upgradeable Smart Contract Framework에 따라 service를 배포
- [abi-to-script](#abi-to-script): 블록체인 위 스마트 컨트랙트와 상호작용하는 자바스크립트 API들을 생성
- [console](#console): 손쉽게 SmartContract의 api를 호출할 수 있는 console 환경을 제공
- [flatten](#flatten): 여러 컨트랙트들을 하나의 파일로 병합

## init
> vvisp init [options]

해당 명령어를 통해 프로젝트를 시작합니다.

__Examples__

```shell
$ vvisp init
```

__Outputs__
```
root/
├── contracts/
├──── Migrations.sol
├── migrations/
├──── 1_initial_migration.js
├── scripts/
├──── test.sh
├──── coverage.sh
├── test/
├──── helpers/
├────── advanceToBlock.js
├────── ...
├──── Example.test.js
├── .babelrc
├── .env
├── .solcover.js
├── .soliumignore
├── .soliumrc.json
├── .package.json
├── service.vvisp.json
└── truffle-config.json
```
> - `package.json`이 생성됩니다. HEACHI LABS에서 사용하는 여러 library들이 추가되어 있습니다.
> - `contracts` 폴더가 생성됩니다. Contract code는 이곳에서 작업해 주시기 바랍니다.
> - `contracts/Migrations.sol` 파일이 생성됩니다. 해당 파일은 truffle의 일부 기능을 위해 필요한 컨트랙트입니다.
> - `contracts/upgradeable` 과 `contracts/libs` 폴더 내에 upgradeable smart contract framework에 필요한 라이브러리들이 복사됩니다. 수정을 추천드리지 않습니다.
> - `.babelrc` 파일이 생성됩니다. ES6 문법을 지원합니다.
> - `.env` 파일이 생성됩니다. 이 곳에서 환경 변수를 설정하십시오. [참고](../../../CONFIGURATION-ko.md#env)
> - solidity를 위한 교정 도구인 [solium](https://github.com/duaraghav8/Solium)을 위한 파일인 `.soliumignore`, `.solcover.js`, `.soliumrc.json`이 생성됩니다.
> - `scripts/test.sh`가 생성되고 `$ npm run test` 스크립트가 `package.json`에 추가됩니다. truffle의 contract testing을 할 때 유용합니다.
> - `scripts/coverage.sh`가 생성되고 ` $ npm run coverage` 스크립트가 `package.json`에 추가됩니다. 컨트랙트 테스트 코드의 커버리지를 보여줍니다.
> - `truffle-config.js`가 생성됩니다. truffle을 사용할 때 필요하며 관련 설정 정보가 담겨 있습니다.
> - `migrations/1_initial_migration.js`이 생성됩니다. truffle test를 위해 필요합니다.
> - `test` 폴더가 생성됩니다. truffle test를 위한 testcode들을 여기서 생성해 주십시오. 
> - truffle 관련 정보는 [truffle documentation](https://truffleframework.com/docs/truffle/overview)을 참고하시길 바랍니다.
> - `test/helpers` 폴더에 HAECHI LABS가 contract testing을 위해 제공하는 유용한 library들이 생성됩니다.
> - `test` 폴더에 예제 테스트 파일인 `Example.test.js`이 생성됩니다. 
> - `service.vvisp.json` 파일이 생성됩니다. `$ vvisp deploy-service` 실행 전 해당 파일에 변수들을 설정해 주십시오. [참고](../CONFIGURATION-ko.md#service)

## compile
> vvisp compile [_files..._] [options]

solidity 소스 코드를 컴파일 합니다. 

__Examples__

```shell
$ vvisp compile contracts/Proxy.sol contracts/UpgradeabilityProxy.sol
```

__Outputs__ (`build` 폴더에 저장됩니다)

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
> file명 입력이 없을 경우, `contracts` 폴더 내의 모든 solidity 파일이 컴파일 됩니다.


## deploy-contract

> vvisp deploy-contract <_file_> [_arguments..._] [options]

대상 컨트랙트를 배포합니다.

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
> 해당 contract가 설정된 환경 변수에 따라 배포되며, confirmation을 기다린 후 생성된 contract address를 출력합니다. 


## deploy-service

> vvisp deploy-service [options]

`service.vvisp.json`에 기술된 서비스를 배포합니다.
우선 `service.vvisp.json`이 정의되어 있는지 확인하며, 정의되어있다면 해당 컨트랙트에 대응하는 proxy 컨트랙트들과 서비스에 대응하는 registry 컨트랙트를 같이 배포합니다.
처음 배포될 때에는 배포 상태를 저장하는 `state.vvisp.json`이 생성되며, 추후에 다른 버전으로 업그레이드 할 때에는 `service.vvisp.json`을 변경한 후 다시 deploy를 하면 기존에 배포된
 서비스가 `service.vvisp.json`에 정의된 상태로 업그레이드가 됩니다.

배포 도중 예상치 못한 문제로인해 배포가 실패할 경우, 해당 명령어를 재입력하면 중단된 시점부터 재배포합니다.

**특별한 경우가 아니면 `state.vvisp.json`의 변경은 추천드리지 않습니다.**

`service.vvisp.json`의 작성은 [이곳](../../../CONFIGURATION-ko.md#service)을 참고하십시오.

__Example__

```
$ vvisp deploy-service
```

__Process__

배포 순서는 다음과 같습니다. 배포할 대상이 없다면 해당 작업을 건너뜁니다.

1) Registry를 배포합니다. (Upgrade시엔 배포하지 않습니다)

2) Upgradeable Contract의 Business Contract들을 배포합니다.

3) Upgradeable Contract의 Proxy Contract들을 배포합니다.

4) NonUpgradeable Contract들을 배포합니다.

5) NonUpgradeable Contract들의 정보를 Registry에 저장합니다.

6) Upgradeable Contract들을 Registry와 연결합니다. 실질적인 upgrade 작업이며, 하나의 트랜잭션에서 atomic하게 일어납니다.

7) Upgradeable Contract들의 추가적인 정보를 Registry에 저장합니다.

8) NonUpgradeable Contract들의 initialize 작업을 수행합니다.

__Outputs__

__`state.vvisp.json`__

현재 배포된 서비스의 상태를 볼 수 있는 파일입니다.

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

1) 설정된 service의 이름입니다.

2) 배포된 registry의 address를 나타냅니다.

3) 배포된 contract들의 정보를 json 형식으로 정의합니다.

4) 배포된 contract의 이름의 이름을 나타냅니다.

5) 배포된 contract의 address를 나타냅니다.
nonUpgradeable contract의 entry point입니다.

6) 배포된 upgradeable contract의 proxy address를 나타냅니다.
upgradeable contract의 경우 proxy가 entry point입니다.
nonUpgradeable contract의 경우 해당 속성이 없습니다.

7) 현재 배포된 contract 버전의 file명(contract명)을 나타냅니다.

8) upgradeable contract를 나타내는 속성입니다.

## abi-to-script

> vvisp abi-to-script <_files..._> [options]

The `abi-to-script` is a command that automatically creates a javascript library to help you easily call deployed smart contracts. The repository used in the tutorial is as follows.(https://github.com/HAECHI-LABS/vvisp-sample)

#### Usage

`vvisp abi-to-script <contract-files...> [options]` 

#### options

`-f, --front <name>`: front-end(브라우저)에서 실행 가능한 자바스크립트 소스코드로 생성합니다.



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

> - `contractApis/back/abi/`에 컨트랙트들의 abi 파일들이 저장됩니다.
> - `contractApis/back/js/`에 api들이 저장됩니다.
> - `contractApis/back/utils/`에 api들에 필요한 library들이 저장됩니다.

- `-f, --front <name>` option의 경우

> - `contractApis/front/abi/`에 컨트랙트들의 abi 파일이 저장됩니다.
> - `contractApis/front/js/`에 api들이 저장됩니다. **(not needed)** 
> - `contractApis/front/name.js`에 번들링된 api들이 저장됩니다. (파일명은 입력한 name을 따라 갑니다)

front api의 경우, 메타마스크와 연동을 위해 [web3 구버전](https://github.com/ethereum/wiki/wiki/JavaScript-API)에 맞춰져 있습니다.



#### 자동 생성된 ContractApis 사용방법

자동 생성된 `contractApis/`를 활용하여 smart contract의 api를 호출 할 수 있습닏다.

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

abi-to-script에 의해 생성된 contractApis를 사용하여 smart contract의 api를 쉽고, 상호작용하며 호출할 수 있는 `console` 환경을 제공합니다. 해당 문서에서 사용된 예제 repository는 다음과 같습니다.(https://github.com/HAECHI-LABS/vvisp-sample)

**console을 시작하기 전에, contractApis가 반드시 생성되어 있어야 하고 호출한 smart contract가 deploy되어 있어야 합니다.**



#### Usage

`vvisp console <contract-apis>` 

만약 `<contract-apis>`를 일력하지 않는다면, 자동으로 현재폴더에 있는 `<contract-apis>`를 찾고 `console`을 실행시킵니다.



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

vvisp console을 시작하게 된다면, deploy된 smart contract를 vvisp console command를 활용하여 쉽게 호출할 수 있습니다.

#### Command

vvisp console에서 사용가능한 command는 다음과 같습니다: call, show, list, help, exit.

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

  `Help` 는 사용 가능한 command의 목록과 사용법을 보여줍니다.

	

- list

  ```
  >> list
  Index			Contract				Address
  [0]			HaechiGym				0x5c06aa41561Ef806dA109B1e9c6271208e203758
  [1]			HaechiV1				0xc95663de3398D74972c16Ad34aCd0c31baa6859e
  [2]			SampleToken				0x8C894a56e0B036Af7308A01B5d8EE0F718B03554
  
  ```

  `list` 는 호출 가능한 contract와 address를 보여줍니다.



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

  `show` 는 해당하는 contract에서 호출할 수 있는 method의 목록을 보여줍니다.



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

  `call`은 해당 contract의 method를 호출합니다.


#### Tips

1. `state.vvisp.json`과 `contractApis/`사이의 불일치가 발생하면 안됩니다. (ex state.vvisp.json에는 3개의 contract가 있지만  contractApis는 2개의 contract만 존재)

2. 만약 `contractApis/`는 존재하지만 `state.vvisp.json`파일이 존재하지 않는다면 stdin을 통해 contract의 주소를 아래와 같이 등록해주어야 합니다.

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

3. `abi-to-script`에 의해 자동생성된 script파일(예를 들어  `HaechiV1.js` 와 `HaechiGym.js` in contractApis/back/js)의 이름은 반드시 state.vvisp.json의 contract 파일 이름과 동일해야 합니다.


## flatten
> vvisp flatten <_files..._> [options]

대상 컨트랙트들과 import된 컨트랙트들을 하나의 파일로 묶습니다. 

__Options__

`-o, --output <name>` : flatten의 결과값을 `name`의 파일명을 가진 파일로 현 디렉토리에 생성합니다.

__Examples__

```shell
$ vvisp flatten contracts/ContractA.sol -o Output.sol
```
__Outputs__ 
> 대상 컨트랙트들과 각 컨트랙트에 dependency가 걸려 있는 모든 파일들을 하나로 묶어 콘솔 창에 출력합니다.

 - `-o, --output <name>` option의 경우
> 콘솔에 출력될 정보가 입력한 이름을 가진 파일에 기입되어 생성됩니다.
