'use strict';

var indigolization,
	express = require('express'),
	indigo = require('indigojs');

if (!indigo.appconf) {
	indigo.start(__appDir + '/config/app.json');
}

module.exports = indigolization = {
	init: function() {
		var appconf = indigo.getAppConf(__dirname + '/config/app.json');

		for (var i in appconf.routers) {
			appconf.routers[i] = appconf.routers[i];
		}

		indigo.app.use('/indigolization', express.static(__dirname + appconf.get('server:web')));
		indigo.libs('routers').init(indigo.app, appconf, indigo.libs('reqmodel'));
	}
};