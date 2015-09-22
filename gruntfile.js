module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('files.json'),
        copyright: "/*" + grunt.file.read('COPYRIGHT') + "*/",
        license: "/*" + grunt.file.read('LICENSE') + "*/",
        clean: {
            all: {
                src: ['target/dest', 'target/site/next', 'target/site/example']
            }
        },
        less: {
            topo: {
                files: {
                    "target/dest/css/next.css": "src/main/resources/less/next-graphic.less",
                    "target/dest/css/next-componentized.css": "src/main/resources/less/next-graphic-componentized.less"
                }
            }
        },
        cssmin: {
            topo: {
                expand: true,
                cwd: 'target/dest/css',
                src: ['next.css', 'next-componentized.css'],
                dest: 'target/dest/css',
                ext: '.min.css'
            }
        },
        jshint: {
            base: {
                src: '<%= pkg.scripts %>'
            },
            options: {
                jshintrc: ".jshintrc"
            }
        },
        qunit: {
            all: ['src/test/core/index.html', 'src/test/ui/test.html']
        },
        concat: {
            base: {
                src: '<%= pkg.scripts %>',
                dest: 'target/dest/js/next.js'
            }
        },
        uglify: {
            base: {
                src: ['target/dest/js/next.js'],
                dest: 'target/dest/js/next.min.js',
                options: {
                    beautify: {
                        ascii_only: true
                    }
                }
            }
        },
        yuidoc: {
            compile: {
                "name": "Next UI Toolkit",
                "description": "Next UI Toolkit API docs",
                "version": "0.8.0",
                "url": "index.html",
                options: {
                    "linkNatives": "true",
                    "attributesEmit": "false",
                    "selleck": "false",
                    paths: ['target/dest/js'],
                    outdir: 'target/dest/doc'
                }
            }
        },
        exec: {
            yui: {
                command: 'yuidoc -c yui.json -C'
            }
        },
        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'src/main/resources',
                    src: ['fonts/**'],
                    dest: 'target/dest'
                }]
            },
            example: {
                files: [{
                    expand: true,
                    src: ['src/example/topology/**'],
                    dest: 'target/site'
                }]
            },
            next: {
                files: [{
                    expand: true,
                    src: ['target/dest/**'],
                    dest: 'target/site/next'
                }, {
                    expand: true,
                    cwd: 'target/dest/',
                    src: ['**'],
                    dest: 'target/tutorials/libs/next'
                }]
            },
            LICENSE: {
                files: [{
                    expand: true,
                    src: ['LICENSE.txt'],
                    dest: 'target/dest'
                }]
            },
            LICENSE2: {
                files: [{
                    expand: true,
                    src: ['LICENSE.txt'],
                    dest: 'target/site'
                }]
            }
        },
        header: {
            dist: {
                options: {
                    text: '<%= copyright %>\r\n<%= license %>'
                },
                files: {
                    'target/dest/js/next.js': 'target/dest/js/next.js',
                    'target/dest/js/next.min.js': 'target/dest/js/next.min.js',
                    'target/dest/css/next.css': 'target/dest/css/next.css',
                    'target/dest/css/next.min.css': 'target/dest/css/next.min.css'
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'target/site/NeXt.zip'
                },
                files: [{
                    src: ['target/dest/**']
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-header');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['clean', 'less', 'cssmin', 'jshint', 'qunit', 'concat', 'yuidoc', 'uglify', 'copy', 'header', 'compress']);

    grunt.registerTask('test', ['clean', 'less', 'cssmin', 'jshint', 'concat', 'exec', 'uglify', 'copy', 'compress']);

};
