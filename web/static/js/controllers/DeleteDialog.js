'use strict';

define([
	'jquery'
], function($) {

	var deleteRow = function(fileMap, selRow, path) {
		path = path || selRow.path;
		var rows = fileMap[path];
		$.each(rows, function(index, row) {
			if (row.key === selRow.key) {
				fileMap[path].splice(index, 1);
				return false;
			}
		});
	};

	return {
		init: function(fileMap, defKeys, selRow, defaultLocale, cb) {
			var deleteDialog = $('#deletelDialog').modal(),
				checkbox = deleteDialog.find('.checkbox-wrap > input');
				deleteDialog.find('.checkbox-wrap').toggle(selRow.locale === defaultLocale.locale);

				deleteDialog.find('.btn-primary').one('click', function() {
					if (selRow.locale === defaultLocale.locale) {
						delete defKeys[selRow.name][selRow.key];

						if (checkbox.is(':checked')) {
							$.each(fileMap, function(path) {
								if (path.split('/')[1] === selRow.name) {
									deleteRow(fileMap, selRow, path);
								}
							});
						} else {
							deleteRow(fileMap, selRow);
						}
					} else {
						deleteRow(fileMap, selRow);
					}

					deleteDialog.modal('hide');

					cb(null);
				});

			return deleteDialog;
		}
	};
});