(function (nx, util) {
    /**
     * Topology 3D layer,demo only
     * @class nx.graphic.Topology.ThreeDLayer
     * @extend nx.graphic.Topology.Scene
     */
    nx.define("nx.graphic.Topology.ThreeDLayer", nx.graphic.Topology.Scene, {
        methods: {
            activate: function () {
                var topo = this.topology();
                var texttips = this.texttips = new tips();
                topo.showNavigation(false);
                topo.addClass("n-topology-3d");
                topo.view("stageContainer").hide();
                topo.appendChild(texttips);

                THREE.registerGlobalDomEvent();
                this.create3D();

            },
            create3D: function () {
                var self = this;
                var topo = this.topology();
                var data = topo.topologyDataCollection();

                var projectionX = topo.projectionX();
                var projectionY = topo.projectionY();

                var scene = new THREE.Scene();
                var stage = new THREE.Object3D();

                var SCREEN_WIDTH = topo.width(), SCREEN_HEIGHT = topo.height();


                var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 20000;
                var renderer;


                if (window.WebGLRenderingContext) {
                    renderer = new THREE.WebGLRenderer({ antialias: true});
                } else {
                    renderer = new THREE.CanvasRenderer();
                }


                var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

                renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

                this.renderDOM = renderer.domElement;
                topo.view()._element.appendChild(this.renderDOM);

                var recover = false;

                var buildTopology = function (data, name) {


                    var group = new THREE.Object3D();
                    var nodes = [];
                    var i, item;

                    data = new nx.ObservableGraph(data);


                    var bg = new THREE.CubeGeometry(SCREEN_WIDTH, SCREEN_HEIGHT, 1);
                    var bgm = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.5, transparent: true});

                    var bgc = new THREE.Mesh(bg, bgm);
                    bgc.position.x = 0;
                    bgc.position.y = 0;
                    bgc.position.z = -30;
                    group.add(bgc);


                    data.edges().forEach(function (linkData) {

                        var link = new THREE.Geometry();
                        var sourceNode = linkData.sourceNode();
                        var targetNode = linkData.targetNode();
                        link.vertices.push({
                            x: projectionX.get(sourceNode.get("x")) - SCREEN_WIDTH / 2,
                            y: projectionY.get(sourceNode.get("y")) - SCREEN_HEIGHT / 2,
                            z: 0
                        });
                        link.vertices.push({
                            x: projectionX.get(targetNode.get("x")) - SCREEN_WIDTH / 2,
                            y: projectionY.get(targetNode.get("y")) - SCREEN_HEIGHT / 2,
                            z: 0
                        });
                        var line = new THREE.Line(link, new THREE.LineBasicMaterial({ color: 0x1F6EEE}));
                        group.add(line);
                    });


                    data.vertices().forEach(function (vertex) {

                        var x = projectionX.get(vertex.get("x")) - SCREEN_WIDTH / 2;
                        var y = projectionY.get(vertex.get("y")) - SCREEN_HEIGHT / 2;


                        var geometry = new THREE.SphereGeometry(16, 16, 16);
                        var material = new THREE.LineBasicMaterial({
                            color: 0x1F6EEE
                        });

                        var node = new THREE.Mesh(geometry, material);
                        node.position.x = x;
                        node.position.y = y;
                        node.position.z = 1;


                        var text3d = new THREE.TextGeometry(vertex.get("name"), {
                            size: 14,
                            height: 0,
                            font: "helvetiker"
                        });
                        var textMaterial = new THREE.LineBasicMaterial({ color: 0x1F6EEE, override: true});
                        var text = new THREE.Mesh(text3d, textMaterial);

                        text.position.x = x;
                        text.position.y = y + 30;
                        text.position.z = 10;


                        group.add(node);
                        //group.add(node2);
                        group.add(text);
                        nodes.push(node);

                    });


                    var groupLink = new THREE.Geometry();
                    groupLink.vertices.push({x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2, z: 0});
                    groupLink.vertices.push({x: SCREEN_WIDTH / 2 + SCREEN_WIDTH / 4, y: SCREEN_HEIGHT / 2, z: 0});
                    var groupLine = new THREE.Line(groupLink, new THREE.LineBasicMaterial({ color: 0xFFFFFF}));
                    groupLine.position.z = -30;
                    group.add(groupLine);


                    var t = new THREE.TextGeometry(name, {
                        size: 39,
                        height: 0,
                        font: "helvetiker"
                    });
                    var textMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, override: true});
                    var text = new THREE.Mesh(t, textMaterial);
                    text.position.set(SCREEN_WIDTH / 2 + SCREEN_WIDTH / 4 + 20, SCREEN_HEIGHT / 2, -30);
//                    text.rotation.z = 0.47;
                    text.rotation.x = 1.5;


                    group.add(text);
                    group.bgc = bgc;
                    group.nodes = nodes;
                    group.groupLabel = text;
//                    group.scale.x = 0;


                    objects.push(bgc);
                    return group;
                };

                var prevPosition;
                var objects = [];
                data.forEach(function (d, j) {
                    var layer = buildTopology(d.data, d.name);
                    if (layer.bgc.destroy) {
                        layer.bgc.destroy();
                    }
                    layer.bgc.on("mouseover", function (event) {
                        event.target.material.opacity = 0.7

                    });
                    layer.bgc.on("mouseout", function (event) {
                        event.target.material.opacity = 0.5
                    });


                    layer.bgc.on("mousedown", function (event) {
                        prevPosition = {
                            x: stage.position.x,
                            y: stage.position.y,
                            z: stage.rotation.z
                        };
                    });
                    layer.bgc.on("mouseup", function (event) {
                        var tempPosition = {
                            x: stage.position.x,
                            y: stage.position.y,
                            z: stage.rotation.z
                        };
                        if (util.isEqual(prevPosition, tempPosition)) {
                            self.showTopology(d, j);
                        }
                        layer.bgc.off("mouseup");
                    });

//
//
//                    layer.bgc.on("click", function (event) {
//                        console.log(controls.upadting)
//                        if(!controls.upadting){
//                            self.showTopology(d, j);
//                        }
//
//                    });

                    layer.position.z = SCREEN_HEIGHT * 3 / 5 * j - SCREEN_HEIGHT / 5;
                    stage.add(layer);


                });


                scene.add(stage);

                var step = 30;
                var planeW = Math.round(SCREEN_WIDTH / 30); // pixels
                var planeH = Math.round(SCREEN_HEIGHT / 30); // pixels
                var plane = new THREE.Mesh(new THREE.PlaneGeometry(planeW * step, planeH * step, planeW, planeH), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, transparent: true, opacity: 0.9}));
//                stage.add(plane);


                var light = new THREE.AmbientLight(0x1F6EEE);
                scene.add(light);


                var rotationZ = -0.3;
                var positionX = 0;
                var positionY = 0;


                THREE.Object3D._threexDomEvent.camera(camera);

//                stage.position.y = SCREEN_HEIGHT / -3;
                //stage.rotation.z = -0.5;
                //stage.rotation.x = -2;
                stage.rotation.x = -1.6;
                camera.position.set(0, 3000, 3000);
                camera.lookAt(scene.position);


                projector = new THREE.Projector();

                //var controls = new THREE.OrbitControls(camera, renderer.domElement);

                function animate() {
                    requestAnimationFrame(animate);
                    render();
                }

                function render() {
                    //controls.update();
                    // camera.lookAt(scene.position);
                    stage.rotation.z += rotationZ;
                    stage.position.x += positionX;
                    stage.position.y += positionY;
                    renderer.render(scene, camera);
                    rotationZ = 0;
                    positionX = 0;
                    positionY = 0;


                }


                var point;
                var start = false;
                topo.on("mousedown", function (sender, event) {
                    point = event.getPageXY();
                    start = true;


                    //topo.upon("mousedown",null);

//                    event.preventDefault();
//                    var eve = event.originalEvent;
//
//                    var vector = new THREE.Vector3(( eve.clientX / SCREEN_WIDTH ) * 2 - 1, -( eve.clientY / SCREEN_HEIGHT ) * 2 + 1, 0.5);
//                    projector.unprojectVector(vector, camera);
//
//                    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
//
//                    var intersects = raycaster.intersectObjects(objects);
//                    console.log(intersects);
//
//                    if (intersects.length > 0) {
//
//
//
//                    }


                });


                topo.on("mousemove", function (sender, event) {
                    if (start) {
                        var _point = event.getPageXY();
                        if (event.shiftKey) {
                            positionX = (point.x - _point.x) * -2;
                            positionY = (point.y - _point.y) * 4;
                        } else {
                            rotationZ = (point.x - _point.x) / -100;
                        }
                        point = _point;
                    }
                });


                topo.on("mouseup", function (sender, event) {
                    start = false;
                });


                topo.on("mousewheel", function (sender, event) {
                    var z = event.getWheelData();
                    camera.position.z += z;
                    camera.position.y += z;
                    event.stop();

                });

                animate();
            },
            showTopology: function (d, index) {
                var topo = this.topology();
                var dom = this.renderDOM;
                var texttips = this.texttips;
                if (topo.hasClass("n-topology-3d")) {
                    dom.style.opacity = 1;
                    topo.addClass("n-topology-3d-transparent");
                    setTimeout(function () {
                        topo.removeClass("n-topology-3d-transparent");
                        topo.removeChild(texttips);
                        topo.removeClass("n-topology-3d");
                        topo.view("stageContainer").show();
                        topo.showNavigation(true);
                        topo.setData(d.data, d.name, true);
                        topo.adjustLayout();
                        topo.view()._element.removeChild(dom);
                    }, 500);
                }


            }
        }

    });


    var tips = nx.ui.define({
        properties: {
            isSafari: {
                get: function () {
                    return nx.browser.safari != undefined;
                }
            }
        },
        view: {
            props: {
                style: {
                    margin: "30px",
                    color: "#fff"
                }
            },
            content: [
                {
                    tag: 'h2',
                    content: "Pre-Pre-Pre Beta"
                },
                {
                    tag: 'p',
                    content: "Still under developing"
                },
                {
                    tag: "p",
                    content: "Darg = Rotate stage. <br /> Shift + Drag = Move stage <br /> Scroll = Zoom stage"
                },
                {
                    content: "Please <a href='https://discussions.apple.com/thread/3300585' style='color:#fff;text-decoration: underline'>enable WebGL</a>  to use 3D view.",
                    props: {
                        visible: '{#isSafari}'
                    },
                    events: {
                        'click': '{#_click}'
                    }
                }
            ]
        },
        methods: {
            _click: function () {
                debugger;
                window.open("https://discussions.apple.com/thread/3300585");
            }
        }
    });


})(nx, nx.util);