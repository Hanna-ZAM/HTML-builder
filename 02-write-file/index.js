const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const srteamWrite = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({ input, output });

rl.question('Hello, write you message \n', (answer) => {
    srteamWrite.write(answer+'\n');
    rl.on('line', (answer) => {
      if (answer.trim() ==='exit') {
          rl.close();
      } else {
      srteamWrite.write(answer+'\n');
      }});
    rl.on('close', (answer) => {
      console.log('Bye, your messages are recorded in text.txt');
      rl.close();
    });

});

