module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('files.json'),
        copyright: "/*" + grunt.file.read('copyright.txt') + "*/",
        license: "/*" + grunt.file.read('LICENSE.txt') + "*/",
        clean: {
            all: {
                src: ['dest', 'devsite/next', 'devsite/example']
            }
        },
        less: {
            topo: {
                files: {
                    "dest/css/next.css": "src/less/next-graphic.less",
                    "dest/css/next-componentized.css": "src/less/next-graphic-componentized.less"
                }
            }
        },
        cssmin: {
            topo: {
                expand: true,
                cwd: 'dest/css',
                src: ['next.css', 'next-componentized.css'],
                dest: 'dest/css',
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
            all: ['test/core/index.html', 'test/ui/test.html']
        },
        concat: {
            base: {
                src: '<%= pkg.scripts %>',
                dest: 'dest/js/next.js'
            }
        },
        uglify: {
            base: {
                src: ['dest/js/next.js'],
                dest: 'dest/js/next.min.js',
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
                    paths: ['dest/js'],
                    outdir: 'dest/doc'
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
                    cwd: 'src',
                    src: ['fonts/**'],
                    dest: 'dest'
                }]
            },
            example: {
                files: [{
                    expand: true,
                    src: ['example/topology/**'],
                    dest: 'devsite'
                }]
            },
            next: {
                files: [{
                    expand: true,
                    src: ['dest/**'],
                    dest: 'devsite/next'
                }, {
                    expand: true,
                    cwd: 'dest/',
                    src: ['**'],
                    dest: 'tutorials/libs/next'
                }]
            },
            LICENSE: {
                files: [{
                    expand: true,
                    src: ['LICENSE.txt'],
                    dest: 'dest'
                }]
            },
            LICENSE2: {
                files: [{
                    expand: true,
                    src: ['LICENSE.txt'],
                    dest: 'devsite'
                }]
            }
        },
        header: {
            dist: {
                options: {
                    text: '<%= copyright %>\r\n<%= license %>'
                },
                files: {
                    'dest/js/next.js': 'dest/js/next.js',
                    'dest/js/next.min.js': 'dest/js/next.min.js',
                    'dest/css/next.css': 'dest/css/next.css',
                    'dest/css/next.min.css': 'dest/css/next.min.css'
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'devsite/NeXt.zip'
                },
                files: [{
                    src: ['dest/**']
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