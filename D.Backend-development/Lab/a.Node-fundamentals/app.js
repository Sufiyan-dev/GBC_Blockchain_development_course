const fileModule = require("./modules/fileSystem");
const cryptoModule = require("./modules/crypto");
const eventModule = require("./modules/eventEmitter");

fileModule.writeToFile('example.txt',"Hello, file system");

const content = fileModule.readToFile('example.txt');
console.log(`file content : ${content}`);

eventModule.listenForCustomEvent((message) => {
    console.log(`Recevied custom event: ${message} `);
})

eventModule.emitCustomEvent("Hello, Node.js!");

const hashedPassword = cryptoModule.hashPassword("MySecurePassword");
console.log(`Hashed password : ${hashedPassword}`);