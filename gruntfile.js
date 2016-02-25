module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('files.json'),
        copyright: "/*" + grunt.file.read('COPYRIGHT') + "*/",
        license: "/*" + grunt.file.read('LICENSE') + "*/",

        build_path: 'target/next',

        clean: {
            all: {
                src: ['<%= build_path %>']
            }
        },
        less: {
            topo: {
                files: {
                    "<%= build_path %>/css/next.css": "src/style/topology/next-topology.less",
                    "<%= build_path %>/css/next-componentized.css": "src/style/topology/next-topology-componentized.less"
                }
            }
        },
        cssmin: {
            topo: {
                expand: true,
                cwd: '<%= build_path %>/css',
                src: ['next.css', 'next-componentized.css'],
                dest: '<%= build_path %>/css',
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
                dest: '<%= build_path %>/js/next.js'
            }
        },
        uglify: {
            base: {
                src: ['<%= build_path %>/js/next.js'],
                dest: '<%= build_path %>/js/next.min.js',
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
                "url": "https://wiki.opendaylight.org/view/NeXt:Main",
                "logo": "http://abdvl.github.io/src/bin/logo.svg",
                options: {
                    "linkNatives": "true",
                    "attributesEmit": "false",
                    "selleck": "false",
                    "paths": ['<%= build_path %>/js'],
                    "outdir": '<%= build_path %>/doc'
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
                    dest: '<%= build_path %>'
                }]
            },
            readme: {
                files: [{
                    expand: true,
                    src: ['README.md'],
                    dest: '<%= build_path %>'
                }]
            },
            next: {
                files: [{
                    expand: true,
                    cwd: '<%= build_path %>/js',
                    src: ['**'],
                    dest: 'src/dist/js'
                }, {
                    expand: true,
                    cwd: '<%= build_path %>/css',
                    src: ['**'],
                    dest: 'src/dist/css'
                }, {
                    expand: true,
                    cwd: '<%= build_path %>/fonts',
                    src: ['**'],
                    dest: 'src/dist/fonts'
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
                    '<%= build_path %>/js/next.js': '<%= build_path %>/js/next.js',
                    '<%= build_path %>/js/next.min.js': '<%= build_path %>/js/next.min.js',
                    '<%= build_path %>/css/next.css': '<%= build_path %>/css/next.css',
                    '<%= build_path %>/css/next.min.css': '<%= build_path %>/css/next.min.css'
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'target/next.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= build_path %>',
                    src: ['**']
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