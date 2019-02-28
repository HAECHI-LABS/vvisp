const fs = require('fs');

const { SERVICE_PATH, SERVICE_FILE } = require('../config/Constant');

function checkServiceFileExist() {
  if (!fs.existsSync(SERVICE_PATH)) {
    throw new Error(`${SERVICE_FILE} file does not exist`);
  }
}

module.exports = {
  checkServiceFileExist
};
