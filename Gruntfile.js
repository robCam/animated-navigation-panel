module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /* IMAGES */

        responsive_images: {
            icons: {
                options: {
                    sizes: [{
                        width: 36,
                        height: 36
                    }, {
                        width: 48,
                        height: 48
                    }, {
                        /*name: 'large',*/
                        width: 60,
                        height: 60
                            /*suffix: '_x2',
                            quality: 60*/
                    }, {
                        width: 72,
                        height: 72
                    }, {
                        width: 76,
                        height: 76
                    }, {
                        width: 96,
                        height: 96
                    }, {
                        width: 120,
                        height: 120
                    }, {
                        width: 144,
                        height: 144
                    }, {
                        width: 152,
                        height: 152
                    }, {
                        width: 180,
                        height: 180
                    }, {
                        width: 192,
                        height: 192
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'src/images/launcher-icon/',
                    src: ['**/*.png'],
                    dest: './dist/images/launcher-icons/'
                }]
            }
        },

        /* JavaScript and CSS */

        jshint: {
            files: ['./dist/js/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                smarttabs: true,
                globals: {}
            }
        },

        concat: {
            jsdist: {
                src: ['src/js/param.js', 'src/js/utils.js', 'src/js/third_party/requestAnimationFrame.js', 'src/js/myHeaderPanel.js', 'src/js/myHamburger.js', 'src/js/textAnimation.js', 'src/js/myPubSub.js'],
                dest: './dist/js/<%= pkg.name %>' + '.min.js'
            },
            jsdocs: {
                src: ['src/js/param.js', 'src/js/utils.js', 'src/js/third_party/requestAnimationFrame.js', 'src/js/myHeaderPanel.js', 'src/js/myHamburger.js', 'src/js/textAnimation.js', 'src/js/myPubSub.js'],
                dest: './temp/js/<%= pkg.name %>' + '.min.js'
            },
            css: {
                src: ['src/css/reset.css', 'src/css/fonts.css', 'src/css/main.css', 'src/css/button.css', 'src/css/header.css', 'src/css/textAnimation.css'],
                dest: './dist/css/style.min.css'
            },
        },

        uglify: {
            my_target: {
                files: {
                    './dist/js/<%= pkg.name %>.min.js': './dist/js/<%= pkg.name %>.min.js' // Destination : Source
                }
            }
        },

        /* CSS */

        cssmin: {
            my_target: {
                src: './dist/css/style.min.css',
                dest: './dist/css/style.min.css'
            }
        },

        /* HTML */

        processhtml: {
            options: {
                data: {
                    message: 'Hello world!'
                }
            },
            dist: {
                files: {
                    './dist/index.html': ['./src/index.html'] //destination : source  !
                }
            }
        },

        /* HTML */
        replace: {
            dist: {
                src: ['./dist/index.html'],
                overwrite: true,
                replacements: [{
                    from: /<html([^>]+)>/,
                    to: '<html$1 manifest="manifest.appcache">'
                }]
            }
        },

        /* APPCACHE */

        appcache: {
            options: {
                basePath: './dist'
            },
            all: {
                dest: './dist/manifest.appcache',
                cache: './dist/**/*',
                network: '*'
            }
        },

        /* COPY */

        copy: {
            fonts: {
                cwd: './src/',
                expand: true,
                src: ['fonts/**'],
                dest: 'dist/',
                flatten: false
            },
            chromeManifest: {
                cwd: './src/',
                expand: true,
                src: ['manifest.json'],
                dest: 'dist/',
                flatten: false
            },
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: 'none',
                options: {
                    paths: './src/js/',
                    themedir: './src/yuidoc_theme/friendly-theme',
                    outdir: './docs'
                }
            }
        },

        /** LICENSING **/

        usebanner: {
            js: {
                options: {
                    banner: [
                        '/**',
                        '<%= grunt.file.read("licenses/MIT.txt") %>',
                        '<%= grunt.file.read("licenses/requestanimationframe.txt") %>',
                        '*/'].join('\n\n---\n\n')
                },
                    files: {
                        src: ['./dist/js/<%= pkg.name %>.min.js']
                    }
                },

            css: {
                options: {
                banner: '/** \n<%= grunt.file.read("licenses/MIT.txt") %>\n*/'
            },
                files: {
                    src: ['./dist/css/style.min.css']
                }
            }
        },

        /** CLEANUP **/

        clean: ['./temp']


    });

    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-appcache');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default
    grunt.registerTask('default', [
        'responsive_images:icons',
        'concat:jsdist',
        'yuidoc',
        'jshint',
        'concat:css',
        'uglify',
        'cssmin',
        'processhtml',
        'appcache',
        'replace',
        'copy:fonts',
        'copy:chromeManifest',
        'usebanner:js',
        'usebanner:css'
    ]);

    // Development
    grunt.registerTask('dev', [
        'responsive_images:icons',
        'concat:jsdist',
        'jshint',
        'concat:css',
        'uglify',
        'cssmin',
        'processhtml',
        'appcache',
        'replace',
        'copy:fonts',
        'copy:chromeManifest',
        'usebanner:js',
        'usebanner:css'
    ]);

    // Documentation
    grunt.registerTask('docs', [
        'concat:jsdocs',
        /*'jshint',*/
        'yuidoc',
        'clean'
    ]);

};