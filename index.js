'use strict';

var indigo = global.__indigo,
	express = require('express');

global.__routerBase = '/indigo-locale';

if (!indigo) {
	indigo = require('indigojs');
	indigo.start(__appDir + '/config/app.json');
}

module.exports = {
	init: function() {
		var appconf = indigo.getAppConf(__dirname + '/config/app.json');
		appconf.server.moduleDir = '/node_modules/indigo-locale';

		var locales = require('indigojs').libs('locales');
		locales.config(appconf);

		indigo.app.use(global.__routerBase, express.static(__dirname + appconf.get('server:webdir')));
		require('indigojs').libs('routers').init(appconf, null, null, locales);
	}
};