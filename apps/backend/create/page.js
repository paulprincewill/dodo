const dd = require('../initialize');
let redirectTo = "/";

if (dd.isset($post.page_name)) { 

    const create = require('./page.app');
    create($post.page_name);
    
    redirectTo = $post.page_name; // Redirect to the new page
}

dd.redirect('/'+redirectTo);
module.exports = dd.compile();