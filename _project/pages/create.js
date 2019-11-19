const init = require('../initialize');
const dd = new init("create");

dd.header('main');
dd.ui('main');
dd.footer('main');

dd.css('styles');

module.exports =  dd.compile();
