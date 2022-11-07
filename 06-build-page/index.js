const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

let p='';
let pCopy='';

fs.rm (path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) {
    fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true },).then(function() {
    console.log('Directory created successfully');
    }).catch(function() {
    console.log('failed to create directory');
    });
    pCopy=path.join(pCopy, 'project-dist');
    copyFolder('assets', 'assets', p, pCopy); 
    createStyle ();
    buildHTML();
  } else {
    console.log('Directory deleted successfully');
    fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true },).then(function() {
      console.log('Directory created successfully');
    }).catch(function() {
      console.log('failed to create directory');
    });
    pCopy=path.join(pCopy, 'project-dist');
    copyFolder('assets', 'assets', p, pCopy); 
    createStyle ();
    buildHTML();
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

async function createStyle () {
  const streamWriteCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  let style= await fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true},  (err, files) => {
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
          streamRead.on('end', () => streamWriteCss.write(data));
          streamRead.on('error', error => console.log('Error', error.message));
        }
      })
    }
  })
}

async function buildHTML(){
  const streamWriteHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  fs.readdir(path.join(__dirname), {withFileTypes: true},  (err, files) => {
    let data = '';
    const streamRead = fs.createReadStream( path.join(__dirname, 'template.html'), 'utf-8');
    streamRead.on('data', chunk => data += chunk);
    streamRead.on('end', () => {
      findComponent(data, streamWriteHtml);
    })
    streamRead.on('error', error => console.log('Error', error.message));
  })
}

async function findComponent(data, streamWriteHtml) {
  let components= await fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true},  (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let name=file.name.toString();
        let tag=file.name.toString().split('.')[0]; 
        let dataTag = '';
        const streamRead = fs.createReadStream( path.join(__dirname,'components', name), 'utf-8');
        streamRead.on('data', chunk => dataTag += chunk);
        streamRead.on('end', () => {
          if (data.includes(`{{${tag}}}`)) {
            data=data.replace(`{{${tag}}}`,dataTag);
            if (files.indexOf(file)==files.length-1) {
              console.log(files.indexOf(file));
              streamWriteHtml.write(data+'\n');
              }
          }
        })
      })
    }
  })
}
