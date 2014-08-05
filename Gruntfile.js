var jquery = [
	'core.js',
	'ajax.js',
	'data.js',
	'deferred.js',
	'dimensions.js',
	'event.js',
	'manipulation.js',
	//'offset.js',
	'selector-sizzle.js',
	'serialize.js',
	'traversing.js'
];

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		buildDir:  'public/lib',
		vendorDir: 'public/vendor',

		uglify: {
			options : {
				enclose: { 
					'window.jQuery': '$' 
				}
			},
			jqueryCustomMin: {
				options: {
					mangle:   true,
					compress: true
				},
				src:  jquery.map(function (item) { return '<%= vendorDir %>/jquery/src/'+item; }),
				dest: '<%= buildDir %>/jquery.min.js'
			}
		},

		copy: {
			main: {
				src: [
					'<%= vendorDir %>/bootstrap/dist/**/*.min.*',
					'<%= vendorDir %>/fontawesome/dist/**/*.min.*',
					'<%= vendorDir %>/typeahead.js/dist/**/*.min.*'
				],
				dest: '<%= buildDir %>/',
				filter:  'isFile',
				flatten: true,
				expand:  true
			},
			fonts: {
				src: [
					'<%= vendorDir %>/bootstrap/fonts/*',
					'<%= vendorDir %>/fontawesome/fonts/*'
				],
				dest: '<%= buildDir %>/fonts/',
				filter:  'isFile',
				flatten: true,
				expand:  true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['compile', 'uglify']);
	grunt.registerTask('compile', ['uglify']);
	grunt.registerTask('fetch',   ['copy']);
};