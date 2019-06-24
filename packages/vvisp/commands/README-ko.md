# Commands

English version: [README.md](./README.md)  

- [init](#init): 프로젝트 폴더 구축
- [compile](#compile): 폴더 내에 있는 솔리디티 소스를 컴파일
- [deploy-contract](#deploy-contract): 특정 컨트랙트를 배포
- [deploy-service](#deploy-service): service를 배포
- [gen-script](#gen-script): 블록체인 위 스마트 컨트랙트와 상호작용하는 자바스크립트 API들을 생성
- [console](#console): 손쉽게 SmartContract의 api를 호출할 수 있는 console 환경을 제공
- [flatten](#flatten): 여러 컨트랙트들을 하나의 파일로 병합

## init
> vvisp init [name] [options]

해당 명령어를 통해 프로젝트를 시작합니다.

[name] 인자에 패키지 명을 기입할 경우, vvisp은 [name] 폴더를 생성하고 그 곳에서 패키지를 구축합니다.

#### Options

`-s, --silent` : 로그를 출력하지 않습니다.

#### Examples

```shell
$ vvisp init
```

#### Outputs
```
root/
├── contracts/
├──── Migrations.sol
├── migrations/
├──── 1_initial_migration.js
├── scripts/
├──── test.sh
├──── coverage.sh
├──── local_eth_ganache_option.js
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
> - `package.json`이 생성됩니다.
HAECHI LABS에서 사용하는 여러 library들이 추가되어 있습니다.
> - `contracts` 폴더가 생성됩니다.
Contract code는 이곳에서 작업해 주시기 바랍니다.
> - `contracts/Migrations.sol` 파일이 생성됩니다.
해당 파일은 truffle 사용을 위해 필요한 컨트랙트입니다.
> - `vvisp-config.js` 파일이 생성됩니다.
이 곳에서 환경 변수를 설정하십시오.
[참고](../../../CONFIGURATION-ko.md#config)
> - solidity를 위한 교정 도구인 [solium](https://github.com/duaraghav8/Solium)을 위한 파일들, `.soliumignore`, `.solcover.js`, `.soliumrc.json`이 생성됩니다.
> - `scripts/test.sh`가 생성되고 `$ npm run test` 스크립트가 `package.json`에 추가됩니다.
truffle의 contract testing을 할 때 유용합니다.
> - `scripts/coverage.sh`가 생성되고 ` $ npm run coverage` 스크립트가 `package.json`에 추가됩니다.
컨트랙트 테스트 코드의 커버리지를 보여줍니다.
> - `scripts/local_eth_ganache_option.js` 파일이 생성됩니다.
해당 파일은 `npm run test`를 실행하기 위해 필요합니다.
> - `truffle-config.js`가 생성됩니다.
truffle을 사용할 때 필요하며 관련 설정 정보가 담겨 있습니다.
> - `migrations/1_initial_migration.js`이 생성됩니다.
truffle test를 위해 필요합니다.
> - `test` 폴더가 생성됩니다.
truffle test를 위한 testcode들을 여기서 생성해 주십시오. 
> - truffle 관련 정보는 [truffle documentation](https://truffleframework.com/docs/truffle/overview)을 참고하시길 바랍니다.
> - Test case 작성을 도와주는 [openzeppelin-test-helpers](https://github.com/OpenZeppelin/openzeppelin-test-helpers)를 이용할 수 있습니다.
> - `test` 폴더에 예제 테스트 파일인 `Example.test.js`이 생성됩니다. 
> - `service.vvisp.json` 파일이 생성됩니다.
`$ vvisp deploy-service` 실행 전 해당 파일에 변수들을 설정해 주십시오.
[참고](../../../CONFIGURATION-ko.md#service)

## compile
> vvisp compile [files...] [options]

solidity 소스 코드를 컴파일 합니다. 

#### Options

`-s, --silent` : 로그를 출력하지 않습니다.

#### Examples

```shell
$ vvisp compile contracts/A.sol contracts/B.sol
```

#### Outputs (`build` 폴더에 저장됩니다)

```
build/contracts/
├── A.json
└── B.json
```
> 파일명 입력이 없을 경우, `contracts` 폴더 내의 모든 solidity 파일이 컴파일 됩니다.


## deploy-contract

> vvisp deploy-contract <file> [arguments...] [options]

대상 컨트랙트를 배포합니다.

#### Options

`-s, --silent` : 로그를 출력하지 않습니다.
`-n, --network <network>`: 배포할 네트워크를 설정합니다.  
`-p, --platform <platform>`: 배포할 플랫폼을 설정합니다.  
`--gasLimit <gasLimit>` : 배포 시 사용할 gasLimit을 설정합니다.  
`--gasPrice <privateKey>` : 배포 시 1 gas 당 지불할 gasPrice를 설정합니다.  
`--from <privateKey>` : privateKey를 통해 배포할 계정을 설정합니다.

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
> 해당 contract가 설정된 환경 변수에 따라 배포되며, confirmation을 기다린 후 생성된 contract address를 출력합니다. 


## deploy-service

> vvisp deploy-service [options]

`service.vvisp.json`에 기술된 서비스를 배포합니다.
우선 `service.vvisp.json`이 정의되어 있는지 확인합니다.
처음 배포될 때에는 배포 상태를 저장하는 `state.vvisp.json`이 생성되며, 추후에 다른 버전으로 업그레이드 할 때에는 `service.vvisp.json`을 변경한 후 다시 deploy를 하면 기존에 배포된
 서비스가 `service.vvisp.json`에 정의된 상태로 업그레이드가 됩니다.

배포 도중 예상치 못한 문제로인해 배포가 실패할 경우, 해당 명령어를 재입력하면 중단된 시점부터 재배포합니다.

**특별한 경우가 아니면 `state.vvisp.json`의 변경은 추천드리지 않습니다.**

`service.vvisp.json`의 작성은 [이곳](../../../CONFIGURATION-ko.md#service)을 참고하십시오.

#### Options

`-s, --silent` : 로그를 출력하지 않습니다.
`-n, --network <network>`: 배포할 네트워크를 설정합니다.  
`-p, --platform <platform>`: specify the platform to deploy on.  
`--gasLimit <gasLimit>` : 배포 시 사용할 gasLimit을 설정합니다.  
`--gasPrice <privateKey>` : 배포 시 1 gas 당 지불할 gasPrice를 설정합니다.  
`--from <privateKey>` : privateKey를 통해 배포할 계정을 설정합니다.  
`-f, --force` : 현재 존재하는 `state.vvisp.json`를 지우고 새로이 배포합니다.

#### Example

```
$ vvisp deploy-service
```

#### Process

배포 순서는 다음과 같습니다.
배포할 대상이 없다면 해당 작업을 건너뜁니다.

1) Contract들을 배포합니다.

1) Contract들의 initialize 작업을 수행합니다.

#### Outputs

__`state.vvisp.json`__

현재 배포된 서비스의 상태를 볼 수 있는 파일입니다.

```
{
  "serviceName": "Haechi", (1)
  "contracts": { (2)
    "ContractKeyName3": { (3)
      "address": "0x863...", (4)
      "fileName": "Contract.sol", (5)
      "name": "Contract" (6)
    },
    "ContractKeyName1": {
      "address": "0x73c...",
      "fileName": "Contract1_V0.sol",
    }
  }
}
```

1. 설정된 service의 이름입니다.

1. 배포된 contract들의 정보가 json 형식으로 정의됩니다.

1. 배포된 contract의 이름을 나타냅니다.

1. 배포된 contract의 address를 나타냅니다.

1. 현재 배포된 contract 버전의 파일명을 나타냅니다.

1. 현재 배포된 contract 버전의 contract명 나타냅니다.

## gen-script

> vvisp gen-script [filesOrDirectory...] [options]

`gen-script`는 배포된 스마트 컨트랙트를 쉽게 호출 할 수 있는 자바 스크립트 라이브러리를 자동으로 생성하는 명령입니다.
튜토리얼에 사용 된 저장소는 [다음](https://github.com/HAECHI-LABS/vvisp-sample)과 같습니다.

#### Usage

`vvisp gen-script [filesOrDirectory...] [options]` 

#### Options

`-s, --silent` : 로그를 출력하지 않습니다.
`-f, --front <name>`: front-end(브라우저)에서 실행 가능한 자바스크립트 소스코드로 생성합니다.

만약 입력한 파일명이 없다면 이 명령어는 자동적으로 `contracts/` 폴더 안의 모든 솔리디티 파일을 대상으로한 스크립트를 생성합니다.


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

`vvisp gen-script`를 실행하면 `contractApis/` 폴더가 생성됩니다.

```bash
$ ls
README.md           contracts           node_modules        package.json
service.vvisp.json  test                contractApis        migrations
package-lock.json   scripts             service2.vvisp.json truffle-config.js
```

생성 된 `contractApis/` 폴더의 구조는 다음과 같습니다:

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
├──── index.js
exampleUserApi.js
```

> - `contractApis/back/abi/`에 컨트랙트들의 abi 파일들이 저장됩니다.
> - `contractApis/back/js/`에 api들이 저장됩니다.
> - `exampleUserApi.js` 파일이 루트 디렉토리에 생성됩니다.
해당 파일을 참고하여 생성된 api들을 사용하시기 바랍니다. 

- `-f, --front <name>` option의 경우

> - `contractApis/front/abi/`에 컨트랙트들의 abi 파일이 저장됩니다.
> - `contractApis/front/js/`에 api들이 저장됩니다.
**(not needed)** 
> - `contractApis/front/name.js`에 번들링된 api들이 저장됩니다.
(파일명은 입력한 name을 따라 갑니다)

front api의 경우, 메타마스크와 연동을 위해 [web3 구버전](https://github.com/ethereum/wiki/wiki/JavaScript-API)에 맞춰져 있습니다.



#### 자동 생성된 ContractApis 사용방법

자동 생성된 `contractApis/`를 활용하여 smart contract의 api를 호출 할 수 있습닏다.

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

`gen-script`에 의해 생성된 contractApis를 사용하여 smart contract의 api를 쉽고, 상호작용하며 호출할 수 있는 `console` 환경을 제공합니다.
해당 문서에서 사용된 예제 repository는 다음과 같습니다.
(https://github.com/HAECHI-LABS/vvisp-sample)

**console을 시작하기 전에, contractApis가 반드시 생성되어 있어야 하고 호출한 smart contract가 deploy되어 있어야 합니다.**



#### Usage

`vvisp console <contract-apis>` 

만약 `<contract-apis>`를 일력하지 않는다면, 자동으로 현재폴더에 있는 `contractApis/`를 찾고 `console`을 실행시킵니다.


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

Index     Name                Contract            Address
[0]       Haechi              Haechi              0x660dd4EaDb8df267cE912797C588Fc9eadfa1861
[1]       Gym                 HaechiGym           0xDc7C74e475e8100F7714DeE869b73E8DC91Af510
[2]       Token               SampleToken         0x54Cd384968d10C980bEe2A258E1ff8CF45a6354D


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
    
    	register                                                             register the address of smart contracts
    
    	list                                                                 list the available smart contracts
    
    	show     <Name>                                                      show the available method of a smart contract
    
    	call     <Name> <Method> [Params...]                                 call a smart contract api method
  ```

  `help` 는 사용 가능한 command의 목록과 사용법을 보여줍니다.

	

- list

  ```
  >> list
  Index     Name                Contract            Address
  [0]       Haechi              Haechi              0x660dd4EaDb8df267cE912797C588Fc9eadfa1861
  [1]       Gym                 HaechiGym           0xDc7C74e475e8100F7714DeE869b73E8DC91Af510
  [2]       Token               SampleToken         0x54Cd384968d10C980bEe2A258E1ff8CF45a6354D
  
  ```

  `list` 는 호출 가능한 contract와 address를 보여줍니다.



- show \<Contract>

  ```
  >> show HaechiV1
  
  [Method]                                [Args]
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

3. `gen-script`에 의해 자동생성된 script파일(예를 들어 `HaechiV1.js` 와 `HaechiGym.js` in `contractApis/back/js`)의 이름은 반드시 `state.vvisp.json`의 contract 파일 이름과 동일해야 합니다.


## flatten
> vvisp flatten <_files..._> [options]

대상 컨트랙트들과 import된 컨트랙트들을 하나의 파일로 묶습니다. 

__Options__

`-s, --silent` : 로그를 출력하지 않습니다.
`-o, --output <name>` : flatten의 결과값을 `name`의 파일명을 가진 파일로 현 디렉토리에 생성합니다.

__Examples__

```shell
$ vvisp flatten contracts/ContractA.sol -o Output.sol
```
__Outputs__ 
> 대상 컨트랙트들과 각 컨트랙트에 dependency가 걸려 있는 모든 파일들을 하나로 묶어 콘솔 창에 출력합니다.

 - `-o, --output <name>` option의 경우
> 콘솔에 출력될 정보가 입력한 이름을 가진 파일에 기입되어 생성됩니다.
