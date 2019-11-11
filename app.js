// Edited Paul Princewill (otwopaul@gmail.com) 
// This is where the routing and creating of our server takes place
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

// First, we create the function to be reused for displaying content
var dd = {
    server: '',
    contentType: 'text/html',
    display: function(content) {
        this.server.writeHead(200, {'Content-Type': this.contentType}); 
        this.server.end(content, 'utf-8');
    },

    displayError: function(error) {

        if (error.code == 'ENOENT') {
            
            var server = this.server;  // readFile callback cannot work with 'this'
            fs.readFile('./404.html', function(error, content) {
                server.writeHead(404, { 'Content-Type': 'text/html' });
                server.end(content, 'utf-8');
            });

        }
        else {
            this.server.writeHead(500);
            this.server.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        }
    }
};

// We will use this later to display different contentType for different static files
var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'font-woff',
    '.woff2': 'font-woff2',
    '.ttf': 'font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// We create the server, obviously?
http.createServer(function (request, server) {

    dd.server = server;
    var target = url.parse(request.url, true);
    target = target.pathname;

    // This removes slashes - '/home/' becomes 'home'
    target = target.replace(/^\/+|\/+$/g, '');

    // Then we decide if to load index page, a page, or a static file  
    if (target === '') { // If it is the index page
        dd.display('Welcome to the Homepage');
    } else {

        var file_extension = String(path.extname(target)).toLowerCase();
        var file_path = './'+target;

        // If there is no file extension
        // it means we are displaying a page
        if (file_extension == '') {
            
            // Each page has a special file in 'pages' folder where all the files are linked
            var module = './pages/'+target+'.js';

            try {
                var file = require(module);
                dd.contentType = "text/html";
                dd.display(file);

            } catch {
                dd.display('404 your destiny not found');
            }

        } else {

            // Automatically select the content type based on file extension 
            // from defined array above, you can add to the list
            var contentType = mimeTypes[file_extension] || 'application/octet-stream';
            dd.contentType = contentType;

            // Read static file directly, obviously?
            fs.readFile(file_path, function(error, content) {
                if (error) {
                    dd.server = server;
                    dd.displayError(error);
                } else {
                    dd.display(content);
                }
            });
           
        }


    }
    

}).listen(334);

// const createPage = require("./apps/backend/create/new_page");
// createPage('hello')