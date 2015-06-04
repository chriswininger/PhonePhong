var gulp = require('gulp');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var recursive = require('recursive-readdir');
var asyn = require('async');

gulp.task('make:manifest', makeManifest);


function makeManifest () {
	console.log('building manifest file');
	var manifestPath = './public/application.manifest';

	asyn.waterfall([
		function _getFileList(next) {
			console.log('building file list');
			var lstFiles = '';
			recursive('./public', ['application.manifest'], function (err, files) {
				if (err) return next(err)
				_.each(files, function (file) {
					lstFiles += file.replace('public/','') + '\n';
				});

				next(null, lstFiles);
			});
		},
		function _removeExistingManifest(lstFiles, next) {
			console.log('clearing existing manifest');
			fs.unlink(manifestPath, function () {
				next(null, lstFiles);
			});
		},
		function _writeFile(lstFiles, next) {
			console.log('writing new manifest');
			var manifest = [
				'CACHE MANIFEST',
				'# timestamp ' + (new Date().getTime()),
				'CACHE:',
				lstFiles,
				'NETWORK:',
				'*'
			].join('\n');

			fs.writeFile(manifestPath, manifest, next);
		}
	], function (err) {
		if (err) return console.error(err);
		console.log('task complete');
	});
}