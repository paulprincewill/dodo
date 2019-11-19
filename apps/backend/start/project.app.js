/*
    - receives on parameter: page name, to the constructor
    - Does not return anything, just does what it needs to
    - All errors/success goes to console.log

*/

const fs = require('fs');
const path = require('path');

function createFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
        console.log('Folder "'+folder+'" created');
    } else {  
        console.log('Folder "'+folder+'" already exists');
    }
}

function copyTemplate(src, dest) {
    
    var exists = fs.existsSync(src);
    var stats = exists && fs.lstatSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        
        // First, we create the folder
        createFolder(dest);
        
        // This will deep copy the directory recursively
        fs.readdirSync(src).forEach(function(childItemName) {
            copyTemplate(path.join(src, childItemName),
                            path.join(dest, childItemName));
        });

    } else {
        fs.copyFileSync(src, dest);
    }

    console.log("Copied template for "+src);
}


function __construct(project) {  
    let projectFolder = "../"+project;
    copyTemplate('_project', projectFolder);
}

module.exports = __construct;