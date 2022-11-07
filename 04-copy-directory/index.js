
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

let p='';
let pCopy='';

fs.rm (path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err){
    copyFolder('files', 'files-copy', p, pCopy); 
  } else {
    console.log('Directory deleted successfully');
    copyFolder('files', 'files-copy', p, pCopy); 
  }
})

async function copyFolder(folder, folderCopy, p, pCopy) {
  let folderNew= await fsPromises.mkdir(path.join(__dirname, pCopy, folderCopy), { recursive: true },).then(function() {
    console.log('Directory created successfully');
    copyFiles(folder, folderCopy, p, pCopy);
  }).catch(function() {
    console.log('failed to create directory');
  });
}


async function copyFiles(folder, folderCopy, p, pCopy){
  let copy= await fs.readdir(path.join(__dirname, p, folder), {withFileTypes: true},  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
      let type=file.isFile();
      let name=file.name.toString(); 
      if (type) {
        fs.copyFile(path.join(__dirname, p,  folder, name), path.join(__dirname, pCopy, folderCopy, name), (err) => {
          if (err) {
            console.log("Error Found:", err);
          } else {
            const streamRead = fs.createReadStream( path.join(__dirname, p,  folder, name), 'utf-8');
            let data = '';
            streamRead.on('data', chunk => data += chunk);
            streamRead.on('end', () => data);
            streamRead.on('error', error => console.log('Error', error.message));
          }
        })
      } else {
        let pNew=path.join(p, `${folder}`);
        let pCopyNew=path.join(pCopy, `${folderCopy}`);
        copyFolder(name, name, pNew, pCopyNew); 
      }
      })
    }
  })
}






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