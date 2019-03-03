# CONFIGURATION

English version: [CONFIGURATION.md](./CONFIGURATION.md)

## <a name="config"></a>vvisp-config.js

`vvisp-config.js`는 환경변수를 설정해주는 file입니다.
해당 파일이 없으면 vvisp의 일부 기능은 작동하지 않습니다. 

만약 custom한 설정파일을 사용하고 싶으시다면 아래와 같은 포맷으로 작성 후 명령어를 실행하실 때 `--configFile custom-config.js` 옵션을 추가하십시오.

다음과 같은 속성들을 정의합니다:

- `network`:
    연결하고자 하는 네트워크의 정보입니다.
    아래 설정한 networks 값 중 하나를 가져올 수 있습니다.
    기본 값은 `development` 입니다. 

- `networks`:
    네트워크에 대한 세부 정보입니다.  
&nbsp;- `host`:
        custom 블록체인에 접근하기 위해 필요한 호스트 이름입니다.
        특정 testnet에 연결하기 위해서는 해당 URL을 기입하면 됩니다.  
&nbsp;- `port`:
        custom 블록체인에 접근하기 위해 필요한 포트 번호입니다.  
&nbsp;- `network_id`:
        해당 네트워크의 ID입니다.  
&nbsp;- `gasLimit`:
        트랙잭션 발생시 설정하고자 하는 gas limit입니다.
        기본값은 `6721975`입니다.  
&nbsp;- `gasPrice`:
        트랙잭션 발생시 설정하고자 하는 gas price입니다.
        기본값은 `10000000000`(10Gwei)이며, 입력 단위는 wei입니다.  

- `compilers`:
    사용하고자 하는 컴파일러에 대한 세부 정보입니다.  
&nbsp;- `version`:
        사용하고자 하는 컴파일러 버전을 입력합니다.
        특정 버전 입력시 네트워크와의 통신이 필요하며, 입력 값이 없을 경우 solc `0.5.0` 버전을 사용합니다.  
&nbsp;- `settings`:
        컴파일러에 대한 설정 값입니다.
&nbsp; &nbsp;- `optimizer.enabled`:
            compile 최적화를 원하지 않는다면 `false`를 입력하십시오.  
&nbsp; &nbsp;- `optimizer.run`:
            compile 최적화를 실행하는 횟수입니다.
            기본 값은 `200`입니다.  
&nbsp; &nbsp;- `evmVersion`:
            사용할 EVM의 버전입니다.
            기본 버전은 `byzantium`입니다.

- `from`:
    트랜잭션을 발생시킬 계정에 대한 세부 정보입니다.
    이 속성은 string 타입의 private key나 mnemonic에 대한 object가 들어갈 수 있습니다.
    아래 예시를 참고하시기 바랍니다.   
&nbsp;- `mnemonic`:
        트랜잭션을 발생시킬 대상의 mnemonic 단어들입니다.  
&nbsp;- `index`:
        `from.mnemonic`으로 생성될 private key의 index입니다.
        기본 값은 0입니다.  

### Examples

```javascript
module.exports = {
  network: "development",
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    coverage: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gasLimit: 123123,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: '0.5.3',
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: 'byzantium'
      }
    }
  },
  from: { // or from: '0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d'
    mnemonic:
      'piano garage flag neglect spare title drill basic strong aware enforce fury',
    index: 0
  }
};
```

`vvisp-config.js`는 `truffle-config.js`에 작성된 설정과 호환될 수 있습니다.

미리 생성된 `truffle-config.js`를 사용하고 싶으시다면 아래와 같이 사용하세요:
```javascript
module.exports = {
  ...require('./truffle-config.js'),
  from: '0x9741fa712a6912b862c9043f8752ffae513cb01895985998c61620da5aaf2d2d'
}
```

명령어 입력 시 옵션을 통해 상기 기술된 환경 변수 중 일부를 변경해서 사용가능합니다.
```
--configFile <fileName> // custom한 설정 파일을 읽어 사용합니다.
-n, --network <network> // network를 변경합니다.
--gasLimit <gasLimit> // gasLimit 값을 조정합니다.
--gasPrice <gasPrice> // gasPrice 값을 조정합니다.
--from <privateKey> // 사용할 privateKey 값을 변경합니다.
```

## <a name="service"></a>service.vvisp.json

`service.vvisp.json`은 같은 버전 체계로 관리되어야 하는 스마트 컨트랙트의 묶음인 service를 정의하는 설정 파일입니다. 

### 예시1
보통의 경우 다음과 같이 작성하시면 됩니다:
```
{
  "serviceName": "Haechi", (1)
  "variables" : { (2)
    "varName": "constant"
  },
  "contracts": { (3)
    "ContractKeyName1": { (4)
      "path": "path/to/your/contract/Contract1.sol" (5)
    },
    "ContractKeyName2": {
      "path": "contracts/Contract2.sol",
      "constructorArguments": [ (6)
        "${contracts.ContractKeyName1.address}", (7)
        "${variables.varName}" (8)
      ],
      "initialize": { (9)
        "functionName": "initialize", (10)
        "arguments": [ (11)
          "argument1",
          "argument2"
        ]
      }
    }
  }
}
```

1. service의 이름을 정의합니다.

1. `service.vvisp.json`에서 사용할 상수를 설정하는 곳 입니다.
key-value pair로 상수를 지정합니다.

1. contract들의 정보를 json 형식으로 정의합니다.

1. contract의 이름을 정의합니다.

1. 실제 이 contract의 소스 코드가 있는 경로를 적는 곳 입니다.

1. 해당 컨트랙트의 constructor가 인자를 받는 경우, 해당 인자들을 배열의 형태로 이곳에서 정의하십시오.
없을 경우, 빈 배열로 두어도 됩니다.

1. 배포된, 혹은 배포 될 contract의 address를 참조할 수 있습니다.
**Cyclic Dependency를 주의하시길 바랍니다** 

1. `${variables.varName}`으로 지정된 값은 3)에 의해 `constant`로 치환됩니다. 

1. 해당 함수가 초기화 작업이 필요한 경우 `initialize`에서 해당 정보를 정의할 수 있습니다.
배포 이후 해당 함수를 `vvisp`이 call합니다.
해당 기능이 필요없다면 비워둬도 무방합니다.

1. 초기화 기능을 담당하는 method 이름을 적습니다.

1. 초기화할 argument의 array를 적는 곳 입니다.
초기화할 argument가 없다면 생략하여도 무방합니다.


### Example2
해당 스마트 컨트랙트 서비스에 업그레이드 기능을 추가하고 싶으시다면, 다음의 설정 파일을 참고하세요:
```
{
  "serviceName": "Haechi",
  "variables" : {
    "varName": "constant"
  },
  "registry" : true, (1)
  "contracts": {
    "ContractKeyName1": {
      "upgradeable": true, (2)
      "path": "path/to/your/contract/Contract1_V0.sol",
      "initialize": { (3)
        "functionName": "initialize",
        "arguments": [
          "${contracts.ContractKeyName2.address}", (4)
          "argument2"
        ]
      }
    },
    "ContractKeyName2": {
      "upgradeable": true,
      "path": "contracts/Contract2_V1.sol"
    }
  }
}
```

1. Upgradeable한 서비스를 구성하고 싶으시다면, `registry` 속성을 `true`로 설정하십시오.
기본값은 `false`입니다.

1. upgrade를 원하는 contract의 경우 `upgradeable` 속성을 `true`로 설정합니다.
`vvisp`은 이를 위한 proxy 컨트랙트를 자동 생성 및 연결해줍니다.

1. upgradeable한 스마트 컨트랙트의 경우, constructor를 사용하는 대신 `initialize` 같은 별도의 method를 둬 이곳에서 초기화 로직 수행해야 합니다.

1. 만약 참조할 컨트랙트가 upgradeable contract일 경우, proxy의 address가 입력됩니다.
