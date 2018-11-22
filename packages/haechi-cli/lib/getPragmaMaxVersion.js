module.exports = async function(filePaths) {
  const { getPragmaVersion } = require('./getPragmaVersion');
  const semver = require('semver');
  const CARET = '^';

  let fixedVersion = undefined;
  let fixedVersionFilePath = undefined;
  let maxCaretVersion = undefined;
  let maxCaretVersionFilePath = undefined;

  for (const filePath of filePaths) {
    const version = await getPragmaVersion(filePath);

    if (version === undefined) {
      continue;
    }

    if (version.startsWith(CARET)) {
      if (maxCaretVersion === undefined) {
        maxCaretVersion = version;
        maxCaretVersionFilePath = filePath;
      } else {
        if (semver.gt(version.substr(1), maxCaretVersion.substr(1))) {
          maxCaretVersion = version;
          maxCaretVersionFilePath = filePath;
        }
      }
    } else {
      if (fixedVersion === undefined) {
        fixedVersion = version;
        fixedVersionFilePath = filePath;
      } else if (fixedVersion !== version) {
        throw new Error(
          `There are the different fixed compiler versions in ${fixedVersionFilePath} and ${filePath}`
        );
      }
    }

    if (maxCaretVersion !== undefined && fixedVersion !== undefined) {
      if (!semver.satisfies(fixedVersion, maxCaretVersion)) {
        throw new Error(
          `There are the incompatible compiler versions in ${maxCaretVersionFilePath} and ${fixedVersionFilePath}`
        );
      }
    }
  }

  if (fixedVersion !== undefined) {
    return fixedVersion;
  }

  return maxCaretVersion;
};
