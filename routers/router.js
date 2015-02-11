'use strict';

var indigo = require('indigojs'),
	debug = indigo.debug('indigo:localization');

module.exports = function(router) {

	//Redirect /{{uri}}/index to /{{uri}}/en/index
	router.get('/index', function(req, res) {
		res.redirect(router.conf.base + '/en/index');
	});

	return {
		'base': '/indigolization',
		'intercept': function(req, res, next) {
			if (req.headers.accept.indexOf('text/xml') === -1) {
				next();
			} else {
				/* 
				 *	prevent request handle on angular.bootstrap initialization
				 *  
				 */
				debug('intercept');
			}
		},
		'controllers': [
			'/controllers'
		]
	};
};