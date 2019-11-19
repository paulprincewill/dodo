const init = require('../initialize');
const dd = new init("start");

dd.header('noheader');
dd.ui('main');
dd.footer('main');

dd.css('styles');

module.exports =  dd.compile();
