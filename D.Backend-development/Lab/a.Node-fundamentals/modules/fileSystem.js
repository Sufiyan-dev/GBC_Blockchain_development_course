const fs = require("fs");

function writeToFile(fileName, content) {
    fs.writeFileSync(fileName, content);
}

function readToFile(fileName) {
    return fs.readFileSync(fileName,"utf-8");
}


module.exports = {
    writeToFile, readToFile
}