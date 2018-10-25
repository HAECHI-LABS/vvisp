# Commands

English version: [README.md](./README.md)  

- [init](#init): 프로젝트 폴더 구축
- [compile](#compile): 폴더 내에 있는 솔리디티 소스를 컴파일
- [deploy-contract](#deploy-contract): 특정 컨트랙트를 배포
- [deploy-service](#deploy-service): Upgradeable Smart Contract Framework에 따라 service를 배포
- [abi-to-script](#abi-to-script): 블록체인 위 스마트 컨트랙트와 상호작용하는 자바스크립트 API들을 생성
- [flatten](#flatten): 여러 컨트랙트들을 하나의 파일로 병합

## init
> haechi init [options]

해당 명령어를 통해 프로젝트를 시작합니다.

__Examples__

```shell
$ haechi init
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
├── service.haechi.json
└── truffle-config.json
```
> - `package.json`이 생성됩니다. HEACHI LABS에서 사용하는 여러 library들이 추가되어 있습니다.
> - `contracts` 폴더가 생성됩니다. Contract code는 이곳에서 작업해 주시기 바랍니다.
> - `contracts/upgradeable` 과 `contracts/libs` 폴더 내에 upgradeable smart contract framework에 필요한 라이브러리들이 복사됩니다. 수정을 추천드리지 않습니다.
> - `.babelrc` 파일이 생성됩니다. ES6 문법을 지원합니다.
> - `.env` 파일이 생성됩니다. 이 곳에서 환경 변수를 설정하십시오. [참고](../CONFIGURATION-ko.md#env)
> - solidity를 위한 교정 도구인 [solium](https://github.com/duaraghav8/Solium)을 위한 파일인 `.soliumignore`, `.solcover.js`, `.soliumrc.json`이 생성됩니다.
> - `scripts/test.sh`가 생성되고 `$ npm run test` 스크립트가 `package.json`에 추가됩니다. truffle의 contract testing을 할 때 유용합니다.
> - `truffle-config.js`가 생성됩니다. truffle을 사용할 때 필요하며 관련 설정 정보가 담겨 있습니다.
> - `migrations/1_initial_migration.js`이 생성됩니다. truffle test를 위해 필요합니다.
> - `test` 폴더가 생성됩니다. truffle test를 위한 testcode들을 여기서 생성해 주십시오. 
> - truffle 관련 정보는 [truffle documentation](https://truffleframework.com/docs/truffle/overview)을 참고하시길 바랍니다.
> - `test/helpers` 폴더에 HAECHI LABS가 contract testing을 위해 제공하는 유용한 library들이 생성됩니다.
> - `service.haechi.json` 파일이 생성됩니다. `$ haechi deploy-service` 실행 전 해당 파일에 변수들을 설정해 주십시오. [참고](../CONFIGURATION-ko.md#service)

## compile
> haechi compile [_files..._] [options]

solidity 소스 코드를 컴파일 합니다. 

__Examples__

```shell
$ haechi compile contracts/Proxy.sol contracts/UpgradeabilityProxy.sol
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

> haechi deploy-contract <_file_> [_arguments..._] [options]

대상 컨트랙트를 배포합니다.

__Examples__

```shell
$ haechi deploy-contract contracts/ContractA.sol input1 input2
```
__Outputs__ 

```shell
ContractA Deploying...
ContractA Created!
Contract Address : 0xcfb...
```
> 해당 contract가 설정된 환경 변수에 따라 배포되며, confirmation을 기다린 후 생성된 contract address를 출력합니다. 


## deploy-service

> haechi deploy-service [options]

`service.haechi.json`에 기술된 서비스를 배포합니다.
우선 `service.haechi.json`이 정의되어 있는지 확인하며, 정의되어있다면 해당 컨트랙트에 대응하는 proxy 컨트랙트들과 서비스에 대응하는 registry 컨트랙트를 같이 배포합니다.
처음 배포될 때에는 배포 상태를 저장하는 `state.haechi.json`이 생성되며, 추후에 다른 버전으로 업그레이드 할 때에는 `service.haechi.json`을 변경한 후 다시 deploy를 하면 기존에 배포된 서비스가 `service.haechi.json`에 정의된 상태로 업그레이드가 됩니다.

배포 도중 예상치 못한 문제로인해 배포가 실패할 경우, 해당 명령어를 재입력하면 중단된 시점부터 재배포합니다.

**특별한 경우가 아니면 `state.haechi.json`의 변경은 추천드리지 않습니다.**

`service.haechi.json`의 작성은 [이곳](../CONFIGURATION-ko.md#service)을 참고하십시오.

__Example__

```
$ haechi deploy-service
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

__`state.haechi.json`__

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

> haechi abi-to-script <_files..._> [options]

해당 컨트랙트가 배포됐을 때 컨트랙트와 상호작용 할 수 있는 자바스크립트 소스코드를 자동으로 생성합니다.

__Options__

`-f, --front <name>`: front-end(브라우저)에서 실행 가능한 자바스크립트 소스코드로 생성합니다.

__Examples__

```shell
$ haechi abi-to-script contracts/OwnedUpgradeabilityProxy.sol...
$ haechi abi-to-script -f service contracts/OwnedUpgradeabilityProxy.sol...
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

> - `contractApis/back/abi/`에 컨트랙트들의 abi 파일들이 저장됩니다.
> - `contractApis/back/js/`에 api들이 저장됩니다.
> - `contractApis/back/utils/`에 api들에 필요한 library들이 저장됩니다.

 - `-f, --front <name>` option의 경우
> - `contractApis/front/abi/`에 컨트랙트들의 abi 파일이 저장됩니다.
> - `contractApis/front/js/`에 api들이 저장됩니다. **(not needed)** 
> - `contractApis/front/name.js`에 번들링된 api들이 저장됩니다. (파일명은 입력한 name을 따라 갑니다)

front api의 경우, 메타마스크와 연동을 위해 [web3 구버전](https://github.com/ethereum/wiki/wiki/JavaScript-API)에 맞춰져 있습니다.


## flatten
> haechi flatten <_files..._> [options]

대상 컨트랙트들과 import된 컨트랙트들을 하나의 파일로 묶습니다. 

__Options__

`-o, --output <name>` : flatten의 결과값을 `name`의 파일명을 가진 파일로 현 디렉토리에 생성합니다.

__Examples__

```shell
$ haechi flatten contracts/ContractA.sol -o Output.sol
```
__Outputs__ 
> 대상 컨트랙트들과 각 컨트랙트에 dependency가 걸려 있는 모든 파일들을 하나로 묶어 콘솔 창에 출력합니다.

 - `-o, --output <name>` option의 경우
> 콘솔에 출력될 정보가 입력한 이름을 가진 파일에 기입되어 생성됩니다.
