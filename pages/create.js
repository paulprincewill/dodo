const Init = require('../initialize');
const dd = new Init("create");

dd.header('main');
dd.ui('main');
dd.footer('main');

dd.css('styles');

module.exports =  dd.compile();
