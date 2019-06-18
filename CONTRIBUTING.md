

# Contributing to vvisp

Korean version: [CONTRIBUTING-ko.md](./CONTRIBUTING-ko.md)

 We welcome all developers who would like to contribute to vvisp. We need a lot of help for vvisp, which is better than today. This is a guideline for contributing to vvisp.
 - [Prerequisites](#prerequisites)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Submission Guidelines](#submit)
 - [Commit Message Guidelines](#commit)

## Prerequisites
Install modules:
```bash
$ cd vvisp
$ npm run bootstrap
```

## <a name="question"></a>Question or Problem?

 Do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests.

## <a name="issue"></a> Issues and Bugs?

 If you find a bug in the source code, you can help us by submitting an [Issue](#submit-issue). Even better, you can submit a [Pull Request](#submit-pr) with a fix.

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

Issue category is as follows.
- Regression (a behavior that used to work and stopped working in a new release)
- Bug report
- Performance issue
- Feature request
- Documentation issue or request
- Other

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs, we will systematically ask you to provide a minimal reproduction scenario. 

You can file new issues by filling out our [Issue Form](https://github.com/HAECHI-LABS/vvisp/issues/new).

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [Github PR list]((https://github.com/HAECHI-LABS/vvisp/pulls)) for an open or closed PR that relates to your submission. You don't want to duplicate effort.
1. Fork the HAECHI-LABS/vvisp repo.
1. Make your changes in a new git branch and create your patch.

     ```shell
     git checkout -b new-branch master
     ```

1. Create appropriate test cases.
1. Run the full test cases, and ensure that all tests pass.
1. Commit your changes using a descriptive commit message that follows our [commit message conventions](#commit).

     ```shell
     git commit -a
     ```
1. Push your branch to GitHub:

    ```shell
    git push origin new-branch
    ```

1. In GitHub, send a pull request to `vvisp:dev`. Rebase your branch and force push to your GitHub repository (this will update your Pull Request).

    ```shell
    git rebase master -i
    git push -f
    ```
    
## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history. But also, we use the git commit messages to generate the change log.
We follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/). 

### Commit Message Format
```bash
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Samples:
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

See more details about [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).
