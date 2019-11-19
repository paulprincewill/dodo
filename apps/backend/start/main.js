const dd = require('../initialize');
let redirectTo = "/";

if (dd.isset($post.project_name)) { 

    const create = require('./project.app');
    create($post.project_name);
    
    redirectTo = $post.project_name; // Redirect to the new project
}

dd.redirect('../../'+redirectTo);
module.exports = dd.compile();