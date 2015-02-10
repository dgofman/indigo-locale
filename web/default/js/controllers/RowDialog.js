'use strict';

define([
	'jquery'
], function($) {
	return {
		init: function(fileMap, defKeys, filter, cb) {
			var newModal = $('#newRowDialog'),
				checkbox = newModal.find('.checkbox-wrap > input'),
				error = newModal.find('.error').hide();

			newModal.on('show.bs.modal', function() {
				newModal.find('.langKey').val('');
				error.hide();
			});

			newModal.find('.btn-primary').click(function() {
				var newKey = newModal.find('.langKey').val().trim(),
					path = filter.val(),
					rows = fileMap[path],
					arr1 = path.split('/');
				for (var i = 0; i < rows.length; i++) {
					if (rows[i].key === newKey) {
						error.show();
						return;
					}
				}

				if (checkbox.is(':checked')) {
					$.each(fileMap, function(path, rows) {
						var arr2 = path.split('/');
						if (arr1[1] === arr2[1]) {
							rows.splice(0, 0, { 'key': newKey, 'path': path, 'name': arr2[1], 'locale': arr2[0] });
						}
					});
				} else {
					rows.splice(0, 0, { 'key': newKey, 'path': path, 'name': arr1[1], 'locale': arr1[0] });
				}

				if (defKeys[arr1[1]]) {
					defKeys[arr1[1]][newKey] = '';
				}

				newModal.modal('hide');

				cb(rows);
			});

			return newModal;
		}
	};
});