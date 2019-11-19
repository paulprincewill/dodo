/*
    - receives on parameter: page name, to the constructor
    - Does not return anything, just does what it needs to
    - All errors/success goes to console.log

*/

const fs = require('fs');
const path = require('path');

// User can change this links anytime by manually editing
const backend = "apps/backend/";
const frontend = "apps/frontend/";
const ui = "ui/";
const pages = "pages/";

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

function createPageModule(page, template) {
    
    let pageModule = pages+page+".js";
    
    try {
        fs.copyFileSync(template, pageModule);
        let pageContent = fs.readFileSync(pageModule).toString();
        pageContent = pageContent.replace(new RegExp(/\$page/, 'g'), page);
        fs.writeFileSync(pageModule, pageContent);
        console.log("Page module created successfully");   
    } catch(err) {
       console.log('Unable to duplicate pages module'+pageModule);
    }
}

function __construct(page) {  
    copyTemplate(ui+'_template', ui+page);
    copyTemplate(frontend+'_template', frontend+page);
    copyTemplate(backend+'_template', backend+page);
    createPageModule(page, pages+'_template.js');
}

module.exports = __construct;