

# Contributing to vvisp

English version: [CONTRIBUTING.md](./CONFIGURATION.md)

 vvisp에 기여하시려는 모든 개발자분들을 환영합니다. 오늘 보다 더 나은 vvisp을 위해 여러분의 많은 도움이 필요합니다. vvisp에 기여하기위한 가이드라인을 제공합니다.
 - [Prerequisites](#prerequisites)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Submission Guidelines](#submit)
 - [Commit Message Guidelines](#commit)

## Prerequisites
Install modules:
```bash
$ npm install -g lerna
$ cd vvisp
$ npm run bootstrap
```

## <a name="question"></a>Question or Problem?

Github Issue는 버그 리포트와 기능 요청에 사용합니다. 따라서 단순한 질문이나 코드에 대한 궁금증을 위해 Issue를 오픈하는 것은 삼가해주세요.

## <a name="issue"></a> Issues and Bugs?

 소스 코드에서 버그를 찾으시면 Github 저장소에서 [Issue](#submit-issue)를 오픈해주세요. 이슈 오픈 이후에 버그를 수정해서 [Pull Request](#submit-pr)를 보내주시면 더 큰 힘이 됩니다.

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Issue를 오픈하기 전에 issue tracker에 중복되는 이슈가 있는지 살펴봐주세요. 동일한 이슈가 있다면 workaround나 Pull Request가 있을 수 잇으니 미리 준비된 해결책을 적용하세요. 중복되는 이슈가 없다면 새롭게 이슈를 생성해주세요.

Issue 카테고리는 다음과 같습니다.
- Regression (a behavior that used to work and stopped working in a new release)
- Bug report
- Performance issue
- Feature request
- Documentation issue or request
- Other

만약 버그에 대한 이슈를 생성하신다면 최소한의 재현 경로를 포함해주세요. 여러분의 작은 노력의 저희가 더 좋은 개발 도구를 만들기 위해 큰 도움이 됩니다. 이슈를 생성해주시면 최대한 빠른 시일내에 답변을 하고 개선점을 찾도록 하겠습니다. 

새로운 이슈를 생성하기 위해서 [Issue Form](https://github.com/HAECHI-LABS/vvisp/issues/new)을 채워주세요.

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

아래의 가이드라인에 맞춰 PR을 생성해주세요.

1. [Github PR 목록]((https://github.com/HAECHI-LABS/vvisp/pulls))에서 중복되는 PR이 있는지 확인해주세요. Open/Closed PR 모두를 참고해주세요.
1. HAECHI-LABS/vvisp 저장소를 fork 하세요.
1. 새로운 git branch를 만들고 코드를 추가 및 수정하세요.

     ```shell
     git checkout -b new-branch master
     ```

1. 적절한 테스트 케이스를 작성해주세요.
1. 테스트 케이스를 작동시켜서 모든 테스트가 성공하는지 확인해주세요.
1. [Commit 메세지 규칙](#commit)에 맞게 commit 메세지를 작성해주세요.

     ```shell
     git commit -a
     ```
1. GitHub에 새 브랜치를 push 하세요:

    ```shell
    git push origin new-branch
    ```

1. GitHub 에서 `vvisp:dev`로 pull request를 보내주세요. pull request 를 보내기 전에 브랜치를 rebase하고 force push해주세요.
    ```shell
    git rebase master -i
    git push -f
    ```
    
## <a name="commit"></a> Commit Message Guidelines

잘 정돈된 커밋 메세지는 가독성을 올려주고 여러 오픈 소스 개발자들 코드의 변경사항을 쉽게 이해할 수 있게 도와줍니다. 또한, 컨벤션에 맞춰진 커밋 메세지로 새로운 버전 배포시 변경 로그 문서를 자동으로 생성할 수 있습니다.
vvisp의 커밋 메세지는 [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)를 따릅니다. 

### Commit Message Format
```bash
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

예제:
```
docs: correct spelling of CHANGELOG                 

```
```
fix: minor typos in code

see the issue for details on the typos fixed

fixes issue #12
```

### Type

- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- chore: Extra works
- ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- revert: Revert some updates
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests

자세한 내용은 [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)를 참조하세요.
