'use strict';

define([
	'jquery'
], function($) {
	return {
		init: function(fileMap, defKeys, filter, cb) {
			var createDialog = $('#createDialog'),
				createModalBody = createDialog.on('show.bs.modal', function() {
					var errors = window.Localization.errors,
						body = $(this).html(createModalBody),
						copyFrom = body.find('.copyFrom'),
						fileInput = body.find('.fileName');

					$.each(filter.find('option'), function(index, option) {
						if (option.value !== 'all') {
							copyFrom.append($('<option selected></option>').val(option.value).html(option.value));
						}
					});

					if (copyFrom.val() !== 'none') {
						fileInput.val(copyFrom.val().split('/')[1].replace('.json', ''));
					}

					copyFrom.change(function() {
						if (this.value !== 'none') {
							fileInput.val(this.value.split('/')[1].replace('.json', ''));
						}
					});
					body.find('.btn-primary').click(function() {
						var language = body.find('.language').val(),
							fileName = fileInput.val() + '.json',
							path = language + '/' + fileName;
						if (fileInput.val().trim() === '') {
							return body.find('.error').text(errors.emptyFile).show();
						}

						if (fileMap[path]) {
							return body.find('.error').text(errors.fileExists).show();
						}

						var data = [];
						if (copyFrom.val() !== 'none') {
							data = JSON.parse(JSON.stringify(fileMap[copyFrom.val()]));
							$.each(data, function(index, row) {
								row['localized'] = '';
								row['locale'] = language;
								row['path'] = path;
							});
						}

						filter.append($('<option selected></option>').val(path).html(path));

						fileMap[path] = data;

						if (!defKeys[fileName]) {
							defKeys[fileName] = {};
						}

						createDialog.modal('hide');

						cb(data, path);
					});
				}).html();

			return createDialog;
		}
	};
});