'use strict';

var fs = require('fs'),
	indigo = global.__indigo,
	langcode = indigo.libs('locales/langcode.json');

module.exports = function(router, locales) {

	var sortLangCode = [];
	for (var code in langcode) {
		sortLangCode.push([code, langcode[code]]);
	}
	sortLangCode = sortLangCode.sort(function(a, b) {
		if(a[1] < b[1]) { return -1; }
		if(a[1] > b[1]) { return 1; }
		return 0;
	});

	router.get('/:locale/index', function(req, res) {
		req.model.defaultLocale = indigo.locales.defLocale;
		req.model.filters = fileList();
		req.model.langcode = sortLangCode;

		indigo.render(req, res, '/index', locales.init(req, req.params.locale));
	});

	router.post('/file', function(req, res) {
		var localeDir = __appDir + indigo.appconf.get('locales:path'),
			filePath = localeDir + '/' + req.body.path;

		delete require.cache[require.resolve(filePath)];
		res.json(require(filePath));
	});
};

function fileList() {
	var list = [],
		localeDir = __appDir + indigo.appconf.get('locales:path');
	if (fs.existsSync(localeDir)) {
		var dirs = fs.readdirSync(localeDir);
		for (var d in dirs) {
			var localeName = dirs[d];
			if (fs.lstatSync(localeDir + '/' + localeName).isDirectory()) {
				var files = fs.readdirSync(localeDir + '/' + localeName);
				for (var f in files) {
					var file = files[f],
						arr = file.split('.');
					if (arr.length > 1 && arr[1] === 'json') {
						try {
							require(localeDir + '/' + localeName + '/' + file);
							list.push(localeName + '/' + file);
						} catch (e) {
							indigo.logger.error('FILE: %s, ERROR: %s', localeDir + '/' + localeName + '/' + file, e.toString());
						}
					}
				}
			}
		}
	}

	return list;
}