const dd = require('../initialize');
dd.page = "$page";

dd.header('main');
dd.ui('main');
dd.footer('main');

dd.css('styles');

module.exports =  dd.compile();
