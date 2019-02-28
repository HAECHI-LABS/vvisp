
# CONFIGURATION

English version: [CONFIGURATION.md](./CONFIGURATION.md)

## <a name="config"></a>vvisp-config.js

> `vvisp-config.js`는 환경변수를 설정해주는 file입니다. 해당 파일이 없으면 vvisp의 일부 기능은 ```vvisp-config.js file does not exist```라는 에러 메세지를 띄우며 더이상 작동하지 않습니다. 

- `network`: 연결하고자 하는 네트워크의 정보입니다. 아래 설정한 networks 값 중 하나를 가져올 수 있습니다. 기본 값은 development 입니다. 

- `networks`: 네트워크에 대한 세부 정보입니다.
&nbsp;- `host`: custom 블록체인에 접근하기 위해 필요한 호스트 이름입니다. 특정 testnet에 연결하기 위해서는 해당 URL을 기입하면 됩니다.
&nbsp;- `port`: custom 블록체인에 접근하기 위해 필요한 포트 번호입니다.
&nbsp;- `network_id`: 해당 네트워크의 ID입니다. 기본값은 *이며, 이것은 특정 ID를 지정하지 않는 설정입니다.   
&nbsp;- `gasLimit`: 트랙잭션 발생시 설정하고자 하는 gas limit입니다. 기본값은 4600000입니다.
&nbsp;- `gasPrice`: 트랙잭션 발생시 설정하고자 하는 gas price입니다. 기본값은 10Gwei이며, 입력 단위는 wei입니다. 

- `compilers`: 사용하고자 하는 컴파일러에 대한 세부 정보입니다.
&nbsp;- `version`: 사용하고자 하는 컴파일러 버전을 입력합니다. 특정 버전 입력시 네트워크와의 통신이 필요하며, 입력 값이 없을 경우 solc 0.5.0 버전을 사용합니다. 
&nbsp;- `settings`: 컴파일러에 대한 설정 값입니다.
&nbsp; &nbsp;- `optimizer.enabled`: compile 최적화를 원하지 않는다면 false를 입력하십시오.
&nbsp; &nbsp;- `optimizer.run`: compile 최적화를 실행하는 횟수입니다.
&nbsp; &nbsp;- `evmVersion`: 사용할 EVM의 버전입니다.

- `from`: 트랜잭션에 대한 세부 정보입니다. 
&nbsp;- `mnemonic`: 트랜잭션을 생성할 대상의 mnemonic key입니다.
&nbsp;- `index`: mnemonic으로 생성될 private key의 index입니다. 기본 값은 0입니다.

### Examples

```vvisp-config.js
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
      gasLimit: 4600000,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: '0.4.25',
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: 'byzantium'
      }
    }
  },
  from: {
    mnemonic:
      'piano garage flag neglect spare title drill basic strong aware enforce fury',
    index: 0
  }
};
```

## <a name="service"></a>service.vvisp.json

`service.vvisp.json`은 같은 버전 체계로 관리되어야 하는 스마트 컨트랙트의 묶음인 service를 정의하는 설정 파일입니다. 

예시)

```
{
  "serviceName": "Haechi", (1)
  "variables" : { (2)
    "varName": "constant" (3)
  },
  "registry" : true, (4)
  "contracts": { (5) 
    "ContractKeyName1": { (6)
      "upgradeable": true, (7)
      "path": "path/to/your/contract/Contract1_V0.sol", (8)
      "initialize": { (9)
        "functionName": "initialize", (10)
        "arguments": [ (11)
          "argument1",
          "argument2"
        ]
      }
    },
    "ContractKeyName2": { (12)
      "upgradeable": true,
      "path": "contracts/Contract2_V1.sol"
    },
    "ContractKeyName3": {
      "path": "path/to/your/contract/Contract.sol",
      "constructorArguments": [ (13)
        "${contracts.ContractKeyName1.address}", (14)
        "${variables.varName}" (15)
      ],
      "initialize": { (16)
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

1) `service.vvisp.json`에서 사용할 값을 설정하는 곳 입니다. 반복적으로 사용할 상수 값의 경우 이곳에서 정의하는 것을 추천 드립니다.

1) key-value pair로 상수를 지정합니다.

1) 만약, 배포하고자 하는 DApp에 upgradeable 컨트랙트가 포함되어 있지 않다면, registry르 사용하지 않을 수 있습니다.
이때, `registry` 속성을 `false`로 설정하십시오.
기본값은 `true`입니다.

1) contract들의 정보를 json 형식으로 정의합니다.

1) contract의 이름을 정의합니다.

1) upgrade를 원하는 contract의 경우 `upgradeable` 속성을 `true`로 설정합니다.

1) 실제 이 contract의 소스 코드가 있는 경로를 적는 곳 입니다.

1) 이 컨트랙트가 처음 배포될 때에 초기화 하는 과정을 정의합니다. upgradeable한 스마트 컨트랙트의 경우, constructor를 사용하는 대신 `initialize` 같은 별도의 method를 둬 이곳에서 초기화 로직 수행해야 합니다.

1) 초기화 기능을 담당하는 method 이름을 적습니다. `initialize` 같은 직관적으로 이해하기 쉬운 method명을 사용하길 추천 드립니다.

1) 초기화할 argument의 array를 적는 곳 입니다.

1) 초기화할 argument가 없다면 이렇게 생략하여도 무방합니다.

1) nonUpgradeable contract의 경우, constructor를 사용할 수 있습니다. 해당 속성에는 constructor arguments를 입력해 줍니다. 없을 경우, 빈 array로 두어도 무방합니다.

1) 배포된, 혹은 배포 될 contract의 address를 참조할 수 있습니다. upgradeable contract의 경우, proxy의 address가 입력됩니다. **cyclic dependency를 주의하시길 바랍니다** 

1) `${variables.varName}`으로 지정된 값은 3)에 의해 `constant`로 치환됩니다. 

1) nonUpgradeable contract의 경우에도 `initialize`를 지정할 수 있습니다. 배포 이후 해당 함수를 call합니다.
