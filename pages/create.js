const dd = require('../initialize');
dd.page = 'create';

dd.header('main');
dd.ui('main');
dd.footer('main');

dd.css('styles');

module.exports = dd.compile();