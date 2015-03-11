'use strict';

define([
	'jquery',
	'angular',
	'gridController'
], function($, angular, gridController) {

	var localization = function(params) {
			this.initialize(params);
		};

		localization.prototype = {

			initialize: function(params) {
				var appName = 'indigo',
					gridCntlName = 'gridController',
					app = angular.module(appName, []);

				this.div = $(params.el);

				this.div.find('.jqGridContainer').attr('ng-controller', gridCntlName);

				app.controller(gridCntlName, ['$rootScope', '$http', gridController.init]);

				app.run(['$rootScope', '$http', $.proxy(this.afterRender, this)]);

				angular.bootstrap(this.div[0], [appName]);
			},

			afterRender: function($rootScope, $http) {
				var self = this,
					items = {},
					count = 0,
					filters = $('#filter option'),
					language = $('#language');

				language.change(function() {
					var option = language.find('option:selected');
					$rootScope.localizedLocale = {'key': option.val().toUpperCase(), 'name': option.text()};
					$rootScope.$apply();
				});
				language.trigger('change');

				$.each(filters, function(index, option) {
					if (option.value !== 'all') {
						self.loadFile($http, option.text, function(data) {
							var  arr = option.text.split('/'),
								files = items[arr[0]];
							if (!files) {
								items[arr[0]] = files = [];
							}
							files.push({name: arr[1], path: option.text, data: data});
							if (++count === filters.length - 1) { //excelude all
								self.ready($rootScope, items);
							}
						});
					}
				});

				if (filters.length === 1) {
					self.ready($rootScope, items);
				}
			},

			ready: function(rootScope, items) {
				this.div.show();
				$('body .footer').show();
				$('div.loading').hide();
				gridController.fileItems(rootScope, items);
			},

			loadFile: function($http, path, cb) {
				$http.post(window.Localization.base + '/file', {path: path})
					.success(function(data) {
						cb(data);
					})
					.error(function(data, status, headers, config) {
						console.error(data, status, headers, config);
						cb(null);
					});
			}
		};

		return localization;
});