## vvisp show-state
### How to run
```
vvisp show-state <CONTRACT_NAME>
```
- <CONTRACT_NAME>의 모든 정적 변수의 stroage index, value 정보를 보여줌

### Show dynamic variable info
```
show <VARIABLE_NAME>
```
- 동적 변수의 경우 추가로 변수를 입력해 정보 확인 가능
- <VARIABLE_NAME>에 해당하는 변수의 stroage index, value 정보를 보여줌
- 기술적, 시간적 문제로 mapping 및 dynamic array 내부에 존재하는 구조체의 경우는 참조 불가능
    - example
        - mapping( int => struct contract.testStruct) mapstruct
        - testStrcut[][] darraystruct
    - 위 케이스를 제외한 나머지 케이스는 모두 가능 (mapping, dynamic array의 중첩 등)

### 구조체타입 동적배열 및 맵핑의 구현전략
- 사용자 입력 파싱은 VariableTracker 클래스에서 수행
    - 사용자가 입력한 변수를 파싱해 참조의 순서(refSeq)와 각 참조의 타입을 구함(typeSeq)
    - 현재 참조의 타입에 맞게 인덱스를 계산
    - 예시
    ```
    - type : mapping(string => char[3][2][]) variable
    - input : variable[hi][0][1][2]
    - refSeq : [hi, 0, 1, 2]
    - typeSeq : [mapping, [], [2], [3]]
     * solidity는 다른 언어와 달리 다차원 배열 순서가 반대!
    ```
- 구조체 정보는 storageTableBuilder 클래스의 structTables 변수가 가지고 있음
    - key : 구조체 이름
    - value : 구조체 내의 모든 변수들의 정보를 가지고 있는 Object
        - key : 변수명
        - value : 변수 정보 ( type | size | seq_no | index | startByte )
    - ex: structTables[struct_name][variable_name]

- 구조체타입 동적배열 및 맵핑의 구현전략
    - 구조체 사용자 입력 예시
        - 맵핑의 value가 구조체 : mapstruct['hi'].var2
        - 동적배열이 mapping 타입 : mapstruct[30][2][14].var3
    - value가 구조체인 맵핑의 타입은 다음과 같음
        - mapping(string => struct myStruct)
        - 타입스트링만 봐서는 입력의 전체 타입을 알 수가 없음
    - 타입스트링을 파싱할 때 구조체 타입이 존재하면
        - structTables를 가져와서 정보를 찾도록 구현해야 할 것으로 보임
    - 또한 myStruct3[2].ab[0][3].var2와 같이 사용자 입력 또한 " . " 을 기준으로 파싱해야 할 것으로 보임


## vvisp debug
### dependency
* truffle-config
* truffle-expect
* truffle-resolver
* truffle-contract
* truffle-artifactor
* ganache-core
* truffle-debug-utils
* async
* safe-eval
* truffle-compile
* truffle-debugger
    * 설치 도중 다음 에러 발생시
        ```
        npm ERR! path /home/lsy/Projects/vvisp/packages/vvisp/node_modules/ganache-core/node_modules/web3-providers-ws/node_modules/websocket
        npm ERR! code EISGIT
        npm ERR! git /home/lsy/Projects/vvisp/packages/vvisp/node_modules/ganache-core/node_modules/web3-providers-ws/node_modules/websocket: Appears to be a git repo or submodule.
        npm ERR! git     /home/lsy/Projects/vvisp/packages/vvisp/node_modules/ganache-core/node_modules/web3-providers-ws/node_modules/websocket
        npm ERR! git Refusing to remove it. Update manually,
        npm ERR! git or move it out of the way first.
        ```
    * 해결책
        ```
        cd packages/vvisp/node_modules/ganache-core/node_modules/web3-providers-ws/node_modules/websocket/
        rm -rf .git
        ```
### How to run
```
vvisp debug txHash
```
* ```truffle-debugger``` 가 실행됨.



## vvisp test
### Prerequiste
- 먼저 vvisp init으로 생성한 boilerplate 디렉토리에서 npm install을 실행한다.
### How to run
```
// test all file
vvisp test

// test a file
vvisp test path/to/file

// test all file with coverage
vvisp test --coverage

// test a file with coverage
vvisp test --coverage path/to/file
```
* ```truffle-test``` 또는 ```solidity-coverage``` 실행.
* node_modules의 바이너리를 통한 실행.