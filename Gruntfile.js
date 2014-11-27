/**
 * Created by timothy on 27/11/14.
 */
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		/**
		 * JSHINT
		 */
		jshint: {
			options: {
				camelcase: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				es3: false,
				forin: true,
				freeze: true,
				browser: true,
				indent: true,
				latedef: true,
				newCap: true,
				noarg: true,
				nonbsp: true,
				nonew: true,
				quotmark: true,
				undef: true,
				unused: true,
				globals: {
					jQuery: true
				},
				reporter: require('jshint-html-reporter'),
				reporterOutput: 'jshint-report.html'
			},
			uses_defaults: ['lib/app/*.js']
		},
		/**
		 * CONCAT
		 */
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['lib/app/*.js'],
				dest: 'dist/app.js'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');


	grunt.registerTask('build', [
		'jshint',
		'useminPrepare',
		'concat:generated',
		'usemin'
	]);

	grunt.registerTask('deploy', [
		'jshint',
		'useminPrepare',
		'concat:generated',
		'usemin'
	]);

	grunt.registerTask('test', [
		'jshint'
	]);

};