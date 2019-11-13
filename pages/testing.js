const Init = require('../initialize');
const dd = new Init("testing");

dd.header('main');
dd.ui('new');
dd.footer('main');

dd.css('styles');

module.exports =  dd.compile();
