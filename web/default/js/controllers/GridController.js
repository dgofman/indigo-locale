'use strict';

define([
	'jquery',
	'controllers/CreateDialog',
	'controllers/RowDialog',
	'controllers/SaveDialog',
	'controllers/DeleteDialog'
], function($, createDG, rowDG, saveDG, deleteDG) {

	var rootScope,
		grid,
		gridData = [],
		fileMap = {},
		localeMap = {},
		defaultLocale = {},
		defKeys = {},
		filter = $('#filter'),
		defaultTxt,
		localizedTxt,
		localizedSpan,
		localizedB,
		parentdWidth = 0,
		selectedRowId = null;

	var fileLoadedHandler = function(evt, items) {
		var locale = window.Localization.defaultLocale,
			def = items[locale] || items[locale = locale.split('-')[0]];

		defaultLocale = {'key': locale.toUpperCase(), 'name': localeMap[locale], 'locale': locale};

		rootScope.defaultLocale = defaultLocale;

		gridData = [];

		parseGridData(locale, def, defKeys);
		delete items[locale];

		for (locale in items) {
			parseGridData(locale, items[locale]);
		}

		createGrid();
	};

	var parseGridData = function(locale, items, keys) {
		keys = keys || {};

		for (var i = 0; i < items.length; i++) {
			var item = items[i],
				fileData = [];
			keys[item.name] = {};
			for (var key in item.data) {
				keys[item.name][key] = item.data[key];
				fileData.push({ 'key': key,
								'localized': item.data[key],
								'path': item.path,
								'name': item.name,
								'locale': locale });
			}

			fileData = fileData.sort(function(a, b) {
				if(a.key < b.key) { return -1; }
				if(a.key > b.key) { return 1; }
				return 0;
			});
			gridData = gridData.concat(fileData);
			fileMap[item.path] = fileData;
		}

		return keys;
	};

	var createGrid = function(isReset) {
		if (grid) {
			parentdWidth = grid.parent().width();
			grid.GridUnload();
		}

		if (isReset) {
			reset();
		}

		var deletedRows = [],
			columns = window.Localization.columns || {},
			colModel = [ { width: 24, cellattr: function () {
								return ' class="glyphicon glyphicon-trash del-column"';
							}
						},
						 {name: 'key', index: 'key', width: 300}, 
						 {name: 'localized', index: 'localized', width: parentdWidth - 575 - 1}, //col1 + col2 + col4
						 {name: 'path', index: 'path', width: 250} ];

		$.each(gridData, function(index, row) {
			row.id = index + 1;
			if (defKeys[row.name][row.key] === undefined) {
				deletedRows.push(row.id);
			}
		});

		grid = $('.jqGridContainer > .jqgrid').jqGrid({
			colNames: [ '', 
						columns.key, 
						columns.localized,
						columns.path], 
			datatype: 'local',
			data: gridData,
			colModel: colModel,
			localReader: {repeatitems: false},
			shrinkToFit: false,
			width: null,
			rowNum: 99999,
			rowattr: function () {
				return {'class': 'jqgrid-column'};
			},
			beforeSelectRow: function(rowid, e) {
				if (e.target.className.indexOf('del-column') !== -1) {
					var selRow = grid.getLocalRow(rowid);
					deleteDG.init(fileMap, defKeys, selRow, defaultLocale, function(data) {
						gridData = data;
						createVerify();
					});
					return false;
				}
				return true;
			},
			onSelectRow: function(rowid){
				var row = grid.getLocalRow(rowid);
				defaultTxt.val(defKeys[row.name][row.key]);
				localizedTxt.val(row.localized);
				rootScope.selectedRowId = selectedRowId = rowid;
				rootScope.$apply();

				localizedSpan.text(localeMap[row.locale]);
				localizedB.text(row.locale.toUpperCase());
			},
			gridComplete: function () {
				var table = $(this);
				for (var i = 0; i < deletedRows.length; i++) {
					table.find('#' + deletedRows[i] + ' td').css('background-color', 'rgb(252, 196, 196)');
				}
			}
		});
	};

	var createVerify = function() {
		if (gridData === null) {
			gridData = [];
			if (filter.val() === 'all') {
				for(var path in fileMap) {
					gridData = gridData.concat(fileMap[path]);
				}
			} else {
				gridData = gridData.concat(fileMap[filter.val()]);
			}
		}

		createGrid(true);
		if (grid.width() !== grid.parent().width()) {
			createGrid();
		}
	};

	var reset = function() {
		defaultTxt.val('');
		localizedTxt.val('');
		localizedSpan.text('');
		localizedB.text('');
		rootScope.selectedRowId = selectedRowId = null;
		rootScope.$apply();
	};

	return function (appService, $rootScope, $scope, $http) {
		rootScope = $rootScope;
		$scope.$on('FILE_LOADED_EVENT', fileLoadedHandler);

		defaultTxt = $('.default');
		localizedTxt = $('.localized');
		localizedSpan = $('.columnLeft>.localized>span');
		localizedB = $('.columnLeft>.localized>b');

		localizedTxt.keyup(function() {
			if (selectedRowId !== null) {
				var row = grid.getLocalRow(selectedRowId);
				grid.setCell(selectedRowId, 'localized', this.value);
				if (defaultLocale.locale === row.locale) {
					defKeys[row.name][row.key] = this.value;
					defaultTxt.val(this.value);
				}
			}
		});

		$rootScope.selectedFile = 'all';

		filter.change(function() {
			$rootScope.selectedFile = this.value;
			$rootScope.$apply();

			gridData = null;
			createVerify();
		});

		var createDialog = createDG.init(fileMap, defKeys, filter, function(data, path) {
			gridData = data;
			createVerify();

			$rootScope.selectedFile = path;
			$rootScope.$apply();
		});

		$.each(createDialog.find('.language option'), function(index, option) {
			localeMap[option.value] = option.text;
		});

		rowDG.init(fileMap, defKeys, filter, function(data) {
			gridData = data;
			createVerify();
		});

		saveDG.init(fileMap, $http, function() {
		});

		createGrid();

		var win = $(window).bind('resize', function() {
			if (grid.parent().width() === 0) {
				setTimeout(function() { win.trigger('resize'); }, 100);
			} else if (grid.parent().width() !== parentdWidth) {
				createGrid();
			}
		}).trigger('resize');
	};
});