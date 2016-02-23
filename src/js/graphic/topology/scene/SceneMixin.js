(function (nx, global) {
    /**
     * Scene mixin
     * @class nx.graphic.Topology.SceneMixin
     * @module nx.graphic.Topology
     *
     */
    nx.define("nx.graphic.Topology.SceneMixin", {
        events: [],
        properties: {
            /**
             * @property scenesMap
             */
            scenesMap: {
                value: function () {
                    return {};
                }
            },
            /**
             * @property scenes
             */
            scenes: {
                value: function () {
                    return [];
                }
            },
            currentScene: {},
            /**
             * Current scene name
             * @property currentSceneName
             */
            currentSceneName: {},
            sceneEnabled: {
                value: true
            }
        },
        methods: {
            initScene: function () {
                this.registerScene("default", "nx.graphic.Topology.DefaultScene");
                this.registerScene("selection", "nx.graphic.Topology.SelectionNodeScene");
                this.registerScene("zoomBySelection", "nx.graphic.Topology.ZoomBySelection");
                this.activateScene('default');
                this._registerEvents();

            },
            /**
             * Register a scene to topology
             * @method registerScene
             * @param name {String} for reference to a certain scene
             * @param inClass <String,Class> A scene class name or a scene class instance, which is subclass of nx.graphic.Topology.Scene
             */
            registerScene: function (name, inClass) {
                var cls;
                if (name && inClass) {
                    var scene;
                    var scenesMap = this.scenesMap();
                    var scenes = this.scenes();
                    if (!nx.is(inClass, 'String')) {
                        scene = inClass;
                    } else {
                        cls = nx.path(global, inClass);
                        if (cls) {
                            scene = new cls();
                        } else {
                            //nx.logger.log('wrong scene name');
                        }
                    }
                    if (scene) {
                        scene.topology(this);
                        scenesMap[name] = scene;
                        scenes.push(scene);
                    }
                }
            },
            /**
             * Activate a scene, topology only has one active scene.
             * @method activateScene
             * @param name {String} Scene name which be passed at registerScene
             */
            activateScene: function (name) {
                var scenesMap = this.scenesMap();
                var sceneName = name || 'default';
                var scene = scenesMap[sceneName] || scenesMap["default"];
                //
                this.deactivateScene();
                this.currentScene(scene);
                this.currentSceneName(sceneName);

                scene.activate();
                this.fire("switchScene", {
                    name: name,
                    scene: scene
                });
                return scene;
            },
            /**
             * Deactivate a certain scene
             * @method deactivateScene
             */
            deactivateScene: function () {
                if (this.currentScene() && this.currentScene().deactivate) {
                    this.currentScene().deactivate();
                }
                this.currentScene(null);
            },
            disableCurrentScene: function (value) {
                this.sceneEnabled(!value);
            },
            _registerEvents: function () {
                nx.each(this.__events__, this._aop = function (eventName) {
                    this.upon(eventName, function (sender, data) {
                        this.dispatchEvent(eventName, sender, data);
                    }, this);
                }, this);
            },
            dispatchEvent: function (eventName, sender, data) {
                if (this.sceneEnabled()) {
                    var currentScene = this.currentScene();
                    if (currentScene.dispatch) {
                        currentScene.dispatch(eventName, sender, data);
                    }
                    if (currentScene[eventName]) {
                        currentScene[eventName].call(currentScene, sender, data);
                    }
                }
            }
        }
    });
})(nx, nx.global);