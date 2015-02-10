'use strict';

define([
	'jquery'
], function($) {

	var saveDialog,
		pathKeys;

	var save = function(fileMap, http, cb) {
		var data = {},
			filePath = pathKeys.pop(),
			rows = fileMap[filePath];
		$.each(rows, function(index, row) {
			data[row.key] = row.localized;
		});
		saveDialog.find('.error').hide();
		saveDialog.find('progress').val(100 / (pathKeys.length + 1));

		http.post('/localization/save', {filePath: filePath, data: data})
			.success(function() {
				if (pathKeys.length > 0) {
					save(fileMap, http, cb);
				} else {
					saveDialog.modal('hide');
					cb();
				}
			})
			.error(function(data) {
				console.error(data);
				saveDialog.find('.error').show().find('p').text(filePath);
				saveDialog.find('.btn-primary').css('visibility', 'visible');
			});
	};

	return {
		init: function(fileMap, http, cb) {
			saveDialog = $('#saveDialog').on('show.bs.modal', function() {
				saveDialog.find('.btn-primary').css('visibility', 'hidden');
				saveDialog.find('progress').val(0);

				pathKeys = [];
				$.each(fileMap, function(path) {
					pathKeys.push(path);
				});
				save(fileMap, http, cb);
			});

			return saveDialog;
		}
	};
});