'use strict';

var indigo = global.__indigo,
	express = require('express');

if (!indigo) {
	indigo = require('indigojs');
	indigo.start(__appDir + '/config/app.json');
}

module.exports = {
	init: function() {
		var appconf = indigo.getAppConf(__dirname + '/config/app.json');
		appconf.server.moduleDir = '/node_modules/indigolization';

		indigo.app.use('/indigolization', express.static(__dirname + appconf.get('server:webdir')));
		indigo.libs('routers').init(appconf);
	}
};