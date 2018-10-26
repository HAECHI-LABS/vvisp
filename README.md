# HAECHI-cli 

[![CircleCI](https://circleci.com/gh/HAECHI-LABS/HAECHI-CLI/tree/dev.svg?style=svg)](https://circleci.com/gh/HAECHI-LABS/HAECHI-CLI/tree/dev) [![Coverage Status](https://coveralls.io/repos/github/HAECHI-LABS/HAECHI-CLI/badge.svg?branch=dev)](https://coveralls.io/github/HAECHI-LABS/HAECHI-CLI?branch=dev)

HAECHI-cli는 스마트컨트랙트를 쉽게 배포하고 업그레이드 할 수 있게 도와주는 커멘드라인 인터페이스 툴 입니다. 구체적으로 다음과 같은 기능이 있습니다

- 프로젝트 폴더 구축(init)
- 스마트컨트랙트의 abi를 읽어 web3로 소통할 수 있는 자바스크립트 코드를 자동 생성(abi-to-script)
- 폴더 내에 있는 솔리디티 소스를 컴파일(compile)
- proxy와 registry 컨트랙트를 이용하여 업그레이드 가능하도록 스마트컨트랙트 서비스를 배포(deploy-service)
- 특정 컨트랙트를 배포(deploy-contract)
- 여러 컨트랙트들을 하나의 파일로 병합(flatten)



### Prerequisites

> node >= 8.12.0 LTS
>
> npm or yarn 


### Install

```shell
$ npm install -g <HAECHI-CLI REPO URL> // or yarn global add <HAECHI-CLI REPO URL>
```



### How To Use

### .env

> 환경변수를 설정해주는 file입니다. 해당 파일이 없으면 haechi-cli의 일부 기능은 ```Error: .env file does not exist```라는 에러 메세지를 띄우며 더이상 작동하지 않습니다. 

- NETWORK: 연결하고자 하는 네트워크의 이름입니다. local을 제외하고, infura를 통합니다. [local, mainnet, ropsten, kovan, rinkeby] 중 하나를 고르십시오. **REQUIRED**
- PORT: local 선택시, 연결하고자 하는 포트 번호입니다.
- INFURA_API_KEY: 외부 네트워크 연결시 필요한 infura api key입니다.
- MNEMONIC: 트랜잭션을 생성할 대상의 mnemonic key입니다. **REQUIRED**
- PRIV_INDEX: MNEMONIC으로 생성될 private key의 index입니다. 기본 값은 0입니다.
- GAS_PRICE: 트랙잭션 발생시 설정하고자 하는 gas price입니다. 기본값은 10Gwei이며, 입력 단위는 wei입니다. 
- SOLC_VERSION: 사용하고자 하는 컴파일러 버전을 입력합니다. 특정 버전 입력시 네트워크와의 통신이 필요하며, 입력 값이 없을 경우 haechi-cli에 내장된 로컬 solc를 사용합니다. 
- SOLC_OPTIMIZATION: compile 최적화를 원하지 않는다면 false를 입력하십시오. 기본 값은 true입니다.

_Examples_ 

```.dotenv
NETWORK= 'local'// 연결하고자 하는 네트워크의 종류 
PORT= '7545' // 이더리움 노드의 포트 번호
INFURA_API_KEY= // 연결 네트워크가 local일 경우 필요하지 않습니다.
MNEMONIC= "royal pact globe..." // 이더리움 월렛 private key에 대한 mnemonic key
GAS_PRICE= 20000000000 // 20Gwei
SOLC_VERSION= // 내장된 컴파일러를 사용합니다.
SOLC_OPTIMIZATION= // 최적화를 사용합니다.
```

### Commands

__init__

> 해당 명령어를 통해 프로젝트를 시작합니다.

_Examples_

```shell
$ haechi init
```

_Outputs_
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
> - package.json이 생성됩니다. HEACHI LABS에서 사용하는 여러 library들이 추가되어 있습니다.
> - contracts 폴더가 생성됩니다. Contract code는 이곳에서 작업해 주시기 바랍니다.
> - contracts/upgradeable 과 contracts/libs 폴더 내에 upgradeable smart contract framework에 필요한 라이브러리들이 복사됩니다. 수정을 추천드리지 않습니다.
> - .babelrc 파일이 생성됩니다. ES6 문법을 지원합니다.
> - .env 파일이 생성됩니다. 이 곳에서 환경 변수를 설정하십시오.
> - solidity를 위한 교정 도구인 [solium](https://github.com/duaraghav8/Solium)을 위한 파일인 .soliumignore, .solcover.js, .soliumrc.json이 생성됩니다.
> - scripts/test.sh가 생성되고 npm run test 스크립트가 package.json에 추가됩니다. truffle의 contract testing을 할 때 유용합니다.
> - truffle-config.js가 생성됩니다. truffle을 사용할 때 필요하며 관련 설정 정보가 담겨 있습니다.
> - migrations/1_initial_migration.js이 생성됩니다. truffle test를 위해 필요합니다.
> - test 폴더가 생성됩니다. truffle test를 위한 testcode들을 여기서 생성해 주십시오. 
> - truffle 관련 정보는 [truffle documentation](https://truffleframework.com/docs/truffle/overview)을 참고하시길 바랍니다.
> - test/helpers 폴더에 HAECHI LABS가 auditing에 사용하는 유용한 library들이 생성됩니다.
> - service.haechi.json 파일이 생성됩니다. deploy-service 실행 시 해당 파일에 변수들을 설정해 주십시오. 

__abi-to-script__ [options] <_files..._>

> 해당 컨트랙트가 배포됐을 때 컨트랙트와 web3로 상호작용 할 수 있는 자바스크립트 소스코드를 자동으로 생성합니다.

_Options_

-f, --front <_name_> : frontend(브라우저)에서 실행 가능한 자바스크립트 소스코드로 생성합니다

_Examples_

```shell
$ haechi abiToScript contracts/OwnedUpgradeabilityProxy.sol...
$ haechi abiToScript -f service contracts/OwnedUpgradeabilityProxy.sol...
```

_Outputs_

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

> - contractApis/back/abi/에 컨트랙트들의 abi 파일이 저장됩니다.
> - contractApis/back/js/에 api들이 저장됩니다.
> - contractApis/back/utils/에 api들에 필요한 library들이 저장됩니다.

 - -f, --front <_name_> option의 경우
> - contractApis/front/abi/에 컨트랙트들의 abi 파일이 저장됩니다.
> - contractApis/front/js/에 api들이 저장됩니다. (not needed) 
> - contractApis/front/name.js에 번들링된 api들이 저장됩니다. (파일명은 입력한 name을 따라 갑니다)
> - contractApis/front/에 js api들이 rollup된 파일이 생성됩니다.

`front api의 경우, 메타마스크와 연동을 위해 web3 구버전에 맞춰져 있습니다.`

__compile__ [_files..._]

> solidity 소스 코드를 컴파일 합니다. 

_Examples_

```shell
$ haechi compile contracts/Proxy.sol contracts/UpgradeabilityProxy.sol
```

_Outputs_ (build 폴더에 저장됩니다)

```
contracts/
├── BytesLib.json
├── Ownable.json
├── OwnedUpgradeabilityProxy.json
├── Proxy.json
├── Registry.json
├── SafeMath.json
└── UpgradeabilityProxy.json
```
> file명 입력이 없을 경우, contracts 폴더 내의 모든 solidity 파일이 컴파일 됩니다.

__deploy-contract__ <_file_> [_arguments..._]

> 대상 컨트랙트를 배포합니다

_Examples_

```shell
$ haechi deploy-contract contracts/ContractA.sol input1 input2
```
_Outputs_ 

```shell
ContractA Deploying...
ContractA Created!
Contract Address : 0xcfb...
```
> 해당 contract가 설정된 환경 변수에 따라 배포되며, confirmation을 기다린 후 생성된 contract address를 출력합니다. 

__deploy-service__

> service.haechi.json에 기술된 서비스를 배포합니다. 우선 service.haechi.json이 정의되었는지 확인하며, 정의되어있다면 해당 컨트랙트에 대응하는 proxy 컨트랙트들과 서비스에 대응하는 registry 컨트랙트를 같이 배포합니다. 처음 배포될 때에는 배포 상태를 저장하는 state.haechi.json이 생성되며, 추후에 다른 버전으로 업그레이드 할 때에는 service.haechi.json을 변경한 후 다시 deploy를 하면 기존에 배포된 서비스가 service.haechi.json에 정의된 상태로 업그레이드가 됩니다.
>
> 배포 도중 예상치 못한 문제로인해 배포가 실패할 경우, 해당 명령어를 재입력하면 중단된 시점부터 재배포합니다.

`특별한 경우가 아니면 state.haechi.json의 변경은 추천드리지 않습니다.`

_Architecture_

![](https://i.imgur.com/pLMWcAF.png)

위의 upgradeable contract에 대한 자세한 원리는 [발표자료](https://drive.google.com/file/d/11SO5RShrNzilDW5L2ZxZjeb7LGozxjuA/view)를 참고하세요.

_service.haechi.json_

service.haechi.json은 같은 버전 체계로 관리되어야 하는 스마트 컨트랙트의 묶음인 service를 정의하는 설정 파일입니다. 

예시)

```
{
  "serviceName": "Haechi", (1)
  "variables" : { (2)
    "varName": "constant" (3)
  },
  "contracts": { (4) 
    "ContractKeyName1": { (5)
      "upgradeable": true, (6)
      "path": "path/to/your/contract/Contract1_V0.sol", (7)
      "initialize": { (8)
        "functionName": "initialize", (9)
        "arguments": [ (10)
          "argument1",
          "argument2"
        ]
      }
    },
    "ContractKeyName2": { (11)
      "upgradeable": true,
      "path": "contracts/Contract2_V1.sol"
    },
    "ContractKeyName3": {
      "path": "path/to/your/contract/Contract.sol",
      "constructorArguments": [ (12)
        "${contracts.ContractKeyName1.address}", (13)
        "${variables.varName}" (14)
      ],
      "initialize": { (15)
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

1) service의 이름을 정의합니다.

2) service.haechi.json에서 사용할 값을 설정하는 곳 입니다. 반복적으로 사용할 상수 값의 경우 이곳에서 정의하는 것을 추천 드립니다.

3) key-value pair로 상수를 지정합니다.

4) contract들의 정보를 json 형식으로 정의합니다.

5) contract의 이름을 정의합니다.

6) upgrade를 원하는 contract의 경우 upgradeable 속성을 true로 설정합니다.

7) 실제 이 contract의 소스 코드가 있는 경로를 적는 곳 입니다.

8) 이 컨트랙트가 처음 배포될 때에 초기화 하는 과정을 정의합니다. HAECHI LABS는 upgradeable한 스마트 컨트랙트의 경우, constructor를 사용하는 대신 initialize같은 별도의 method를 둬 이곳에서 초기화 로직 수행해야 합니다.

9) 초기화 기능을 담당하는 method 이름을 적습니다. initialize 같은 직관적으로 이해하기 쉬운 method명을 사용하길 추천 드립니다.

10) 초기화할 argument의 array를 적는 곳 입니다.

11) 초기화할 argument가 없다면 이렇게 생략하여도 무방합니다.

12) nonUpgradeable Contract의 경우, constructor를 사용할 수 있습니다. 해당 속성에는 contructor arguments를 입력해 줍니다. 없을 경우, 빈 array로 두어도 무방합니다.

13) 배포된, 혹은 배포 될 contract의 address를 참조할 수 있습니다. upgradeable contract의 경우, proxy의 address가 입력됩니다. **cyclic dependency를 주의하시길 바랍니다** 

14) '${variables.varName}'으로 지정된 값은 3.에 의해 'constant'로 치환됩니다. 

15) nonUpgradeable Contract의 경우에도 initialize를 지정할 수 있습니다. 배포 이후 해당 함수를 call합니다.

_Example_

```
$ haechi deploy-service
```

_Process_

배포 순서는 다음과 같습니다. 배포할 대상이 없다면 해당 작업을 건너뜁니다.

1) Registry를 배포합니다. (Upgrade시엔 배포하지 않습니다)

2) Upgradeable Contract의 Business Contract들을 배포합니다.

3) Upgradeable Contract의 Proxy Contract들을 배포합니다.

4) NonUpgradeable Contract들을 배포합니다.

5) NonUpgradeable Contract들의 정보를 Registry에 저장합니다.

6) Upgradeable Contract들을 Registry와 연결합니다. 실질적인 upgrade 작업이며, 하나의 tx에서 atomic하게 일어납니다.

7) Upgradeable Contract들의 추가적인 정보를 Registry에 저장합니다.

8) NonUpgradeable Contract들의 initialize 작업을 수행합니다.

_Outputs_

_state.haechi.json_

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

5) 배포된 contract의 address를 나타냅니다. nonUpgradeable contract의 entry point입니다.

6) 배포된 upgradeable contract의 proxy address를 나타냅니다. upgradeable contract의 경우 proxy가 entry point입니다. nonUpgradeable contract의 경우 해당 속성이 없습니다.

7) 현재 배포된 contract 버전의 file명(contract명)을 나타냅니다.

8) upgradeable contract를 나타내는 속성입니다.


__flatten__ <_files..._>

> 대상 컨트랙트들과 import된 컨트랙트들을 하나의 파일로 묶습니다. 

_Options_

-o, --output <_name_> : flatten의 결과값을 name의 파일명을 가진 파일로 현 디렉토리에 생성합니다.

_Examples_

```shell
$ haechi flatten contracts/ContractA.sol -o Output.sol
```
_Outputs_ 
> 대상 컨트랙트들과 각 컨트랙트에 dependency가 걸려 있는 모든 파일들을 하나로 묶어 콘솔 창에 출력합니다.

 - -o, --output option의 경우
> 콘솔에 출력될 정보가 입력한 이름을 가진 파일에 기입되어 생성됩니다.
