const init = require('../initialize');
const dd = new init("dd_ajax");

dd.header('main');
dd.ui('main');
dd.footer('main');

dd.css('styles');

module.exports =  dd.compile();