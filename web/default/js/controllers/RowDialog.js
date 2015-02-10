'use strict';

define([
	'jquery'
], function($) {
	return {
		init: function(fileMap, defKeys, filter, cb) {
			var newModal = $('#newRowDialog'),
				newModalBody = newModal.on('show.bs.modal', function() {
					var body = $(this).html(newModalBody);
					body.find('.btn-primary').click(function() {
						var newKey = body.find('.langKey').val().trim(),
							path = filter.val(),
							rows = fileMap[path],
							arr1 = path.split('/');
						for (var i = 0; i < rows.length; i++) {
							if (rows[i].key === newKey) {
								body.find('.error').show();
								return;
							}
						}

						$.each(fileMap, function(path, rows) {
							var arr2 = path.split('/');
							if (arr1[1] === arr2[1]) {
								rows.splice(0, 0, { 'key': newKey, 'path': path, 'name': arr2[1], 'locale': arr2[0] });
							}
						});

						if (defKeys[arr1[1]]) {
							defKeys[arr1[1]][newKey] = '';
						}

						newModal.modal('hide');

						cb(rows);
					});
				}).html();

			return newModal;
		}
	};
});