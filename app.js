const express = require('express');
const app = express();

global.$post = {}; // For saving form data sent using POST

app.use(express.urlencoded({ extended: true }));
// Handles POST data sent to any page
// Simply saves it in $post global variable
app.post('*', (req, res, next) => {
    $post = req.body;
    // Moves to the next routing logic that will display the actual page
    next(); 
})

// For static assets, html or css
app.use('/_assets', express.static('_assets'));
app.use('/ui', express.static('ui'));

// For index page, duh!
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send("Welcome to the homepage");
});

// For backend urls like "app/create/page"
app.use('/app', (req, res, next) => {
    loadModule(req, res, next, 'apps/backend');
});

// When none of the routing above works, we assume it is a normal page
app.use('', (req, res, next) => {
    loadModule(req, res, next, 'pages');
});


// Load the module associated with the page
// Gets the feedback and writes as HTML
function loadModule(req, res, next, targetModule) {

    // This removes slashes - '/home/' becomes 'home'
    const target = req.url.replace(/^\/+|\/+$/g, '');
    const pageModule = './'+targetModule+'/'+target+'.js'; // Find the module

    try {

        const page =  require(pageModule);
        // If redirect is set from the module, redirect immediately
        if (typeof page.redirectTo !== "undefined") {
            res.redirect(page.redirectTo);
            return;
        }

        res.set('Content-Type', 'text/html');
        res.send(page);

    } catch(err) {
        console.log(err);
        res.status(404).send("404 page not found");
    }
    
}




// PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening at port '+port));









// My testing shits
// Does not have anything to do with the application
// Don't edit, create your own tesing space for God's sake
const fs = require("fs");
const Path = require("path");

// Delete things folder I created
function deleteFolder(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = Path.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolder(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);

      console.log(path+" was deleted");
    }

}


function deleteAllFolders(folder) {
    deleteFolder('ui/'+folder);
    deleteFolder('apps/backend/'+folder);
    deleteFolder('apps/frontend/'+folder);
    fs.unlinkSync('pages/'+folder+'.js');
}

//deleteAllFolders('testing');
