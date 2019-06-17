## ```vvisp show-state```
### run
```
vvisp show-state <CONTRACT_NAME>
```
- <CONTRACT_NAME>의 모든 정적 변수의 stroage index, value 정보를 보여줌

### dynamic variable
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

### test
1. ganache-cli를 미리 띄움
2. packages/vvisp/test/dummy/show-state/vvisp-config.js의 mnemonic을 ganache-cli의 출력을 참조해 수정
3. test 쉘스크립트 실행
```
cd packages/vvisp
npm run-script ssci
```
#### code refactoring시에는 test code 통과 여부를 확인 할 것


## ```vvisp debug```

* ```truffle-debugger``` 실행.

```
vvisp debug txHash
```

## ```vvisp test```

* ```truffle-test``` 또는 ```solidity-coverage``` 실행.
* ```npm install``` 요구. node_modules의 바이너리를 통한 실행.

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


## ```vvisp analyze```

* 미스릴을 이용한 컨트랙트 보안 분석
* 도커 미스릴 설치 및 권한 설정 요구

```
// on-chain analysis
vvisp analyze

// off-chain analysis (all file)
vvisp analyze --all-contract

// off-chain analysis (a file)
vvisp analyze path/to/file
```

## ```vvisp ci```

* `vvisp analyze`, `vvisp test`, `vvisp deploy-service`를 순서대로 실행.

```
vvisp ci
```
