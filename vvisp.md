## ```vvisp show-state```
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

### Test
1. ganache-cli를 미리 띄움
2. packages/vvisp/test/dummy/show-state/vvisp-config.js의 mnemonic을 ganache-cli의 출력을 참조해 수정
3. test 쉘스크립트 실행
```
cd packages/vvisp
npm run-script ssci
```
#### code refactoring시에는 test code 통과 여부를 확인 할 것


## ```vvisp debug```
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



## ```vvisp test```
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



## ```vvisp analyze```

### Prerequiste
- Docker 설치 (Ubuntu 18.04 기준)
```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
```

- pull 'mythril/myth' docker image
```
docker pull mythril/myth
```

### How to Run
```
// on-chain analysis
vvisp analyze

// off-chain analysis (all file)
vvisp analyze --all-contract

// off-chain analysis (a file)
vvisp analyze path/to/file
```
* on-chain anaylsis
    * 배포된 스마트 컨트랙트에 대한 mythril 보안 분석 진행
* off-chain analysis (all file)
    * contracts 디렉토리의 모든 스마트 컨트랙트에 대한 mythril 보안 분석 진행



## ```vvisp ci```
### How to run
```
vvisp ci
```
* contracts 디렉토리의 모든 스마트 컨트랙트에 대해서 `vvisp analyze`, `vvisp test`, `vvisp deploy-service`를 순서대로 실행.

