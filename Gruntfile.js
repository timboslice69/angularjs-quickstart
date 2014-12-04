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
				noarg: true,
				nonbsp: true,
				nonew: true,
				quotmark: true,
				undef: true,
				unused: false,
				globals: {
					jQuery: true,
					angular: true,
					console: true,
					$script: true
				},
				reporter: require('jshint-html-reporter'),
				reporterOutput: 'reports/html/jshint.html'
			},
			local: {
				options: {
					reporter: require('jshint-html-reporter'),
					reporterOutput: 'reports/html/jshint.html'
				}
			},
			jenkins: {
				options: {
					reporter: require('jshint-junit-reporter'),
					reporterOutput: 'reports/xml/jshint.xml'
				}
			},
			uses_defaults: ['src/lib/app/*.js']
		},
		/**
		 * COPY
		 */
		copy: {
			dist: {
				files: [
					{expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist/'},
					{expand: true, cwd: 'src/templates', src: ['**/*.html'], dest: 'dist/templates'},
					{expand: true, cwd: 'src/style/css', src: ['*.css'], dest: 'dist/style/css'}
				]
			}
		},
		/**
		 * CONCAT
		 */
		concat: {
			options: {
				separator: ';'
			},
			generated: {
				files: [
					{
						dest: '.tmp/concat/lib/application.js',
						src: ['src/lib/app/*.js']
					}
				]
			},
			components: {
				files: [
					{
						dest: 'dist/lib/components.min.js',
						src: [
							'src/lib/components/angular/angular.min.js',
							'src/lib/components/angular-resource/angular-resource.min.js',
							'src/lib/components/angular-route/angular-route.min.js',
							'src/lib/components/angular-sanitize/angular-sanitize.min.js',
							'src/lib/components/script.js/dist/script.min.js'
						]
					}
				]
			}
		},

		/**
		 * UGLIFY
		 */

		uglify: {
			generated: {
				files: [
					{
						dest: 'dist/lib/application.min.js',
						src: [ '.tmp/concat/lib/application.js' ]
					}
				]
			}
		},

		/**
		 * USEMIN
		 */
		useminPrepare: {
			options: {
				dest: 'dist'
			},
			html: 'index.html'
		},

		usemin: {
			html: ['dist/index.html']
		},

		htmlangular: {
			options: {
				tmplext: 'tmpl.html',
				reportpath: 'reports/json/html-validation.json'
			},
			files: {
				src: [
					'src/templates/**/*.html'
				]
			}
		},

		/**
		 * HTMLMIN
		 */

		htmlmin: {
			multiple: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					preserveLineBreaks: true,
					keepClosingSlash: true,
					ignoreCustomComments: []
				},
				files: [{
					expand: true,
					cwd: 'src',
					src: '*.html',
					dest: 'dist/'
				}]
			}
		},

		/**
		 * SASS
		 */

		sass: {
			compile: {
				options: {
					style: 'expanded',
					lineNumbers: true,
					loadPath: ['src/style/scss/partials', 'src/style/scss/imports'],
					cacheLocation: '.tmp/.sass-cache/'
				},
				files: {
					'.tmp/style/css/screen.css': 'src/style/scss/screen.scss',
					'.tmp/style/css/print.css': 'src/style/scss/print.scss'
				}
			},
			build: {
				options: {
					style: 'compact',
					loadPath: ['src/style/scss/partials', 'src/style/scss/imports'],
					cacheLocation: '.tmp/.sass-cache/'
				},
				files: {
					'.tmp/style/css/screen.css': 'src/style/scss/screen.scss',
					'.tmp/style/css/print.css': 'src/style/scss/print.scss'
				}
			},
			deploy: {
				options: {
					style: 'compressed',
					loadPath: ['src/style/scss/partials', 'src/style/scss/imports'],
					cacheLocation: '.tmp/.sass-cache/'
				},
				files: {
					'.tmp/style/css/screen.css': 'src/style/scss/screen.scss',
					'.tmp/style/css/print.css': 'src/style/scss/print.scss'
				}
			},
			test: {
				options: {
					style: 'expanded',
					lineNumbers: true,
					loadPath: ['src/style/scss/partials', 'src/style/scss/imports'],
					cacheLocation: '.tmp/.sass-cache/'
				},
				files: [{
					expand: true,
					cwd: 'src/style/scss',
					src: ['**/*.scss'],
					dest: '.tmp/test/scss/css/',
					ext: '.css'
				}]
			}
		},


		/**
		 * CSS Prefixer
		 */
		autoprefixer: {
			single_file: {
				src: '.tmp/style/css/screen.css',
				dest: 'src/style/css/screen.css'
			}
		},

		/**
		 * IMAGE COMPRESSION
		 */

		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},
				files: [
					{
						// Set to true to enable the following options…
						expand: true,
						// cwd is 'current working directory'
						cwd: 'src/style/img',
						src: ['*.png'],
						// Could also match cwd line above. i.e. project-directory/img/
						dest: 'dist/style/img/',
						ext: '.png'
					}
				]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [
					{
						// Set to true to enable the following options…
						expand: true,
						// cwd is 'current working directory'
						cwd: 'src/style/img',
						src: ['*.jpg'],
						// Could also match cwd. i.e. project-directory/img/
						dest: 'dist/style/img',
						ext: '.jpg'
					}
				]
			}
		},

		/**
		 * WATCH
		 */

		watch: {
			scripts: {
				files: ['src/style/scss/**/*.scss'],
				tasks: ['sass:compile', 'autoprefixer'],
				options: {
					spawn: false
				}
			}
		},

		/** Unit Testing */

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				background: false,
				singleRun: true
			}
		},


		open : {
			jshint : {
				path : 'reports/html/jshint.html'
			},
			unit : {
				path : 'reports/html/ui-unit-tests.html'
			}
		}

	});


	/**
	 * Load NPM Tasks
	 */
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-html-angular-validate');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-open');

	/**
	 * Register Tasks
	 */


	// Default task compiles just the sass
	grunt.registerTask('default', [
		'watch'
	]);


	// Build task will test, compile and concat necessary resources putting the output into the build folder
	grunt.registerTask('build', [
		'jshint:jenkins',
		'htmlangular',
		'sass:build',
		'karma',
		'autoprefixer',
		'useminPrepare',
		'copy',
		'concat:generated',
		'uglify:generated',
		'concat:components',
		'usemin',
		'imagemin',
		'open:jshint',
		'open:unit'
	]);

	// Deploy take will test, compile, concat and minify necessary resources putting the output into the dist folder
	grunt.registerTask('deploy', [
		'jshint',
		'htmlangular',
		'sass:deploy',
		'autoprefixer',
		'useminPrepare',
		'copy',
		'concat:generated',
		'uglify:generated',
		'concat:components',
		'usemin',
		'htmlmin',
		'imagemin'
	]);

	// Test task tests the javascript quality, html quality, scss, quality and then runs the unit tests generating reports into the reports folder
	grunt.registerTask('test', [
		'jshint:local',
		'htmlangular',
		'sass:test',
		'karma',
		'open:jshint',
		'open:unit'
	]);


	// Default task compiles just the sass
	grunt.registerTask('unit', [
		'karma',
		'open:unit'
	]);

};