'use strict';

var indigo = require('indigojs');

if (!indigo.appconf) {
	indigo.start(__appDir + '/config/app.json');
}