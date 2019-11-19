const init = require('../initialize');
const dd = new init("$page");

dd.header('main');
dd.ui('main');
dd.footer('main');

dd.css('styles');

module.exports =  dd.compile();
