const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const fsPromises = fs.promises;


fsPromises.mkdir(path.join(__dirname, 'project-dist')).then(function() {
    console.log('Directory created successfully');
}).catch(function() {
    console.log('failed to create directory');
});
const streamWriteCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
const streamWriteHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

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
            streamRead.on('end', () => streamWriteCss.write(data));
            streamRead.on('error', error => console.log('Error', error.message));
       }
       
        })
        }
})

fs.readdir(path.join(__dirname), {withFileTypes: true},  (err, files) => {
  let data = '';
     const streamRead = fs.createReadStream( path.join(__dirname, 'template.html'), 'utf-8');
     streamRead.on('data', chunk => data += chunk);
     streamRead.on('end', () => {
     streamWriteHtml.write(data+'\n');
     })
     streamRead.on('error', error => console.log('Error', error.message));
})





fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true},  (err, files) => {
    let arrTags=[];
    if (err)
      console.log(err);
    else {
        files.forEach(file => {
        let name=file.name.toString();
        let tag=file.name.toString().split('.')[0]; 
        let data = '';
        let dataTag = '';
        
        const streamRead = fs.createReadStream( path.join(__dirname,'components', name), 'utf-8');
        streamRead.on('data', chunk => dataTag += chunk);
        streamRead.on('end', () => {
            
        const htmlReader=fs.createReadStream( (path.join(__dirname, 'project-dist', 'index.html')), 'utf-8');
          htmlReader.on('data', chunk => data += chunk);
          htmlReader.on('end', () => {  console.log(`{{${tag}}} 1`);
            
           if (data.includes(`{{${tag}}}`)){
           
           data=data.split(`{{${tag}}}`)[0]+dataTag+data.split(`{{${tag}}}`)[1];

         }
         fs.truncate(path.join(__dirname, 'project-dist', 'index.html') , err => {
            if(err) throw err; // не удалось очистить файл
            console.log('Файл успешно очищен');
            streamWriteHtml.write(data);
         });
         console.log(data);
        })
        htmlReader.on('error', error => console.log('Error', error.message));
        });
        streamRead.on('error', error => console.log('Error', error.message));
        })}
return arrTags})
   
   


       
/*
async function createFolder(n){
    console.log(path.dirname(n))
    let newFolder= await fsPromises.mkdir(path.join(__dirname, n)).then(function() {
        console.log('Directory created successfully');
    }).catch(function() {
        console.log('failed to create directory');
    })}

async function copyFolder(m){
    createFolder(m);
 await fs.readdir(path.join(__dirname, m), {withFileTypes: true},  (err, files) => {
    if (err)
      console.log(err);
    else {
        files.forEach(file => {
        let type=file.isFile();
        let name=file.name.toString(); 

        if (type){
        fs.copyFile(path.join(__dirname, m, name), path.join(__dirname,'project-dist',m, name), (err) => {
        if (err) {
        console.log("Error Found:", err);
        } else {
        const streamRead = fs.createReadStream( path.join(__dirname, m, name), 'utf-8');
        let datas = '';
        streamRead.on('data', chunk => datas += chunk);
        streamRead.on('end', () => datas);
        streamRead.on('error', error => console.log('Error', error.message));
        }})
} else {
   copyFolder(name);
}

})}
})
}

copyFolder('assets');*/
