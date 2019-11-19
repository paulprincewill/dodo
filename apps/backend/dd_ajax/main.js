const dd = require('../initialize');
dd.echo("This is a testing echo");
dd.echo("Your name is "+$post.name);

module.exports = dd.compile();