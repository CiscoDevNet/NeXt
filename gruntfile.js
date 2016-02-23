module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('files.json'),
        copyright: "/*" + grunt.file.read('COPYRIGHT') + "*/",
        license: "/*" + grunt.file.read('LICENSE') + "*/",
        clean: {
            all: {
                src: ['target']
            }
        },
        less: {
            topo: {
                files: {
                    "target/css/next.css": "src/style/topology/next-topology.less",
                    "target/css/next-componentized.css": "src/style/topology/next-topology-componentized.less"
                }
            }
        },
        cssmin: {
            topo: {
                expand: true,
                cwd: 'target/css',
                src: ['next.css', 'next-componentized.css'],
                dest: 'target/css',
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
            all: ['src/test/core/index.html', 'src/test/web/test.html']
        },
        concat: {
            base: {
                src: '<%= pkg.scripts %>',
                dest: 'target/js/next.js'
            }
        },
        uglify: {
            base: {
                src: ['target/js/next.js'],
                dest: 'target/js/next.min.js',
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
                "version": "0.9.0",
                "url": "index.html",
                options: {
                    "linkNatives": "true",
                    "attributesEmit": "false",
                    "selleck": "false",
                    paths: ['target/js'],
                    outdir: 'target/doc'
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
                    cwd: 'src/style',
                    src: ['fonts/**'],
                    dest: 'target'
                }]
            },
            //example: {
            //    files: [{
            //        expand: true,
            //        src: ['src/example/topology/**'],
            //        dest: 'target/site'
            //    }]
            //},
            next: {
                files: [{
                    expand: true,
                    src: ['target/js'],
                    dest: 'src/dist'
                }, {
                    expand: true,
                    src: ['target/css'],
                    dest: 'src/dist'
                }, {
                    expand: true,
                    src: ['target/fonts'],
                    dest: 'src/dist'
                }, ]
            },
            LICENSE: {
                files: [{
                    expand: true,
                    src: ['LICENSE.txt'],
                    dest: 'target'
                }]
            }
        },
        header: {
            dist: {
                options: {
                    text: '<%= copyright %>\r\n<%= license %>'
                },
                files: {
                    'target/js/next.js': 'target/js/next.js',
                    'target/js/next.min.js': 'target/js/next.min.js',
                    'target/css/next.css': 'target/css/next.css',
                    'target/css/next.min.css': 'target/css/next.min.css'
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'target/NeXt.zip'
                },
                files: [{
                    src: ['target/**']
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-header');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['clean', 'less', 'cssmin', 'jshint', 'qunit', 'concat', 'yuidoc', 'uglify', 'copy', 'header', 'compress']);

    grunt.registerTask('dev', ['clean', 'less', 'concat', 'copy']);

    grunt.registerTask('test', ['less']);

};