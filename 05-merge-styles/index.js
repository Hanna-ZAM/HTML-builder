const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fsPromises = fs.promises;

const streamWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true},  (err, files) => {
    let data = '';
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let name=file.name.toString(); 
        let extname=path.extname(file.name.toString()).split('.')[1];
        if (extname==='css'&& file.isFile()){
            const streamRead = fs.createReadStream( path.join(__dirname,'styles', name), 'utf-8');
            streamRead.on('data', chunk => data += chunk);
            streamRead.on('end', () => streamWrite.write(data));
            streamRead.on('error', error => console.log('Error', error.message));
       }
       
        })
        }
})