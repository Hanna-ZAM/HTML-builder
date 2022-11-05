
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fsPromises = fs.promises;
let recursive=false;
  
fsPromises.mkdir(path.join(__dirname, 'files-copy')).then(function() {
    console.log('Directory created successfully');
}).catch(function() {
    console.log('failed to create directory');
});


/*fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true},  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let name=file.name.toString(); 
        const streamWrite = fs.createWriteStream(path.join(__dirname,'files-copy', name));
        const streamRead = fs.createReadStream( path.join(__dirname,'files', name), 'utf-8');
        let data = '';
        streamRead.on('data', chunk => data += chunk);
        streamRead.on('end', () => streamWrite.write(data));
        streamRead.on('error', error => console.log('Error', error.message));
        })
}
})*/


fs.readdir(path.join(__dirname, 'files'), {withFileTypes: true},  (err, files) => {
    if (err)
      console.log(err);
    else {
        files.forEach(file => {
        let name=file.name.toString(); 
        fs.copyFile(path.join(__dirname,'files', name), path.join(__dirname,'files-copy', name), (err) => {
        if (err) {
        console.log("Error Found:", err);
    }
    else {
        const streamRead = fs.createReadStream( path.join(__dirname,'files', name), 'utf-8');
        let data = '';
        streamRead.on('data', chunk => data += chunk);
        streamRead.on('end', () => data);
        streamRead.on('error', error => console.log('Error', error.message));
        }})
})}
})
