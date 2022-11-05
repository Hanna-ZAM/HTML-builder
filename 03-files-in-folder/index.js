const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true},  (err, files) => {
    if (err)
      console.log(err);
    else {
      console.log(`\n ${path.join(__dirname, 'secret-folder')} directory filenames:`);

      files.forEach(file => {

     let name=file.name.toString().split('.')[0]; 
     let extname=path.extname(file.name.toString()).split('.')[1];
        let type=file.isFile();
        fs.stat (path.join(__dirname, 'secret-folder/'+file.name), (err, result) => {
            if (err) {
            console.log(err);
            }
          else {
            let size=result.size/1024;
            if(type){
            console.log(`${name} - ${extname} - ${size}kb`)
           }
      }});


      })
        }
  })
 