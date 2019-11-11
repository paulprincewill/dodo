const fs = require('fs');

function createFolder(path) {
    fs.mkdir(path, 0777, (err) => {
        if (err) {
            console.log('Folder "'+path+'" already exists');
        } else {  
            console.log('Folder "'+path+'" created');
        }
        
    });
}

function __construct(page) {  
    createFolder("ui/"+page);
    createFolder("apps/backend/"+page);
    createFolder("apps/frontend/"+page);
}

module.exports = __construct;