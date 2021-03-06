'use strict';

var indigo = global.__indigo,
	debug = indigo.debug('indigo:static'),
	errorHandler = indigo.libs('errorHandler'),
	fs = require('fs'),
	less = require('less');

module.exports = function(router, app) {

	var base = '/indigo-locale/static',
		path = '^' + base;

	app.use(path + '/*(.less)$', function(req, res, next) {

		var filename = req.originalUrl.split('/').splice(-1)[0],
			lessFile = router.moduleWebDir() + '/default/less/' + filename,
			cache = parseInt(indigo.appconf.get('server:cache')),
			isDev = indigo.appconf.get('environment') === 'dev';

		debug(req.method, lessFile);

		if (fs.existsSync(lessFile)) {
			res.setHeader && res.setHeader('Cache-Control', 'public, max-age=' + 
					(!isNaN(cache) ? cache : 3600)); //or one hour

			fs.readFile(lessFile, function(error, data) {
				less.render(data.toString(), {
						filename: lessFile,
						compress: !isDev
					}, function (error, result) {
						res.set('Content-Type', 'text/css');
						if (!error) {
							res.write(result.css);
							res.end();
						} else {
							errorHandler.error('ERROR_LESS_PARSING', error, 'Unable to parse file. Code: %UID%');
							res.send(data);
						}
					});
			});
			return;
		}
		next();
	});

	return base;
};