(function (nx, global) {


    var topologyData = {
        "nodes": [
            {"device_type": "groupL", "name": "Group", "x": -829.4662613425281, "y": -275.254653981855, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": -893.4025973581261, "y": -15.470269405241936, "fixed": true},
            {"device_type": "cloud", "name": "cloud", "x": 91.08824054939521, "y": -474.343845766129, "fixed": true},
            {"device_type": "groupL", "name": "Group", "x": 99.13783332016692, "y": -266.42192288306455, "fixed": true},
            {"device_type": "groupL", "name": "Group", "x": 902.3742946068535, "y": -268.6226730090725, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": -570.0387869567085, "y": -36.26951927923386, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": -157.57438950729772, "y": -20.931230846774213, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": 74.7785696503197, "y": -9.239788684475855, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": 442.51802288660815, "y": -26.946096144153216, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": 244.82266169913532, "y": -30.60780771169351, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": 834.3366482661338, "y": -13.496249369959685, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": 1057.5307045755192, "y": -22.804807207661327, "fixed": true},
            {"device_type": "switch", "name": "switch", "x": -338.19717429979164, "y": -35.68213419858864, "fixed": true},
            {"device_type": "server", "name": "server", "x": -794.6484584015689, "y": 293.6707450856859, "fixed": true},
            {"device_type": "server", "name": "server", "x": -901.7547029048237, "y": 290.3473219506045, "fixed": true},
            {"device_type": "server", "name": "server", "x": -1009.2385010841347, "y": 300.7785527973789, "fixed": true},
            {"device_type": "server", "name": "server", "x": -639.5886879409529, "y": 273.425399067541, "fixed": true},
            {"device_type": "server", "name": "server", "x": -473.1931314115429, "y": 279.11684122983866, "fixed": true},
            {"device_type": "server", "name": "server", "x": -553.8907522052159, "y": 270.8863605090726, "fixed": true},
            {"device_type": "phone", "name": "phone", "x": -196.12497257687528, "y": 259.8007518880888, "fixed": true},
            {"device_type": "server", "name": "server", "x": -94.03779580310527, "y": 261.7190916078632, "fixed": true},
            {"device_type": "server", "name": "server", "x": 137.34328988155244, "y": 274.31759135584684, "fixed": true},
            {"device_type": "server", "name": "server", "x": 50.840332960315436, "y": 275.44026436491947, "fixed": true},
            {"device_type": "server", "name": "server", "x": 521.1610184601798, "y": 271.7488222026211, "fixed": true},
            {"device_type": "server", "name": "server", "x": 387.7224235761089, "y": 278.8714952116936, "fixed": true},
            {"device_type": "server", "name": "server", "x": 258.1611556829639, "y": 273.2097836441533, "fixed": true},
            {"device_type": "tablet", "name": "tablet", "x": 775.4158250847343, "y": 274.9941682207658, "fixed": true},
            {"device_type": "tablet", "name": "tablet", "x": 1048.8977045741653, "y": 269.9793029233871, "fixed": true},
            {"device_type": "tablet", "name": "tablet", "x": -379.4203977481535, "y": 271.6562611031902, "fixed": true},
            {"device_type": "pc", "name": "pc", "x": 927.9422431168625, "y": 266.7488222026202, "fixed": true},
            {"device_type": "pc", "name": "pc", "x": 1171.059035423734, "y": 265.99416822076614, "fixed": true},
            {"device_type": "pc", "name": "pc", "x": -296.3450333306474, "y": 278.91006872190235, "fixed": true}
        ],
        "links": [
            {"source": 4, "target": 2},
            {"source": 3, "target": 2},
            {"source": 3, "target": 2},
            {"source": 3, "target": 2},
            {"source": 0, "target": 2},
            {"source": 0, "target": 2},

            {"source": 3, "target": 4},


            {"source": 4, "target": 11},
            {"source": 10, "target": 11},


            {"source": 0, "target": 2},
            {"source": 3, "target": 2},
            {"source": 4, "target": 2},
            {"source": 7, "target": 3},
            {"source": 8, "target": 3},
            {"source": 9, "target": 3},
            {"source": 10, "target": 4},
            {"source": 11, "target": 4},
            {"source": 12, "target": 4},
            {"source": 6, "target": 0},
            {"source": 5, "target": 0},
            {"source": 1, "target": 0},
            {"source": 6, "target": 3},
            {"source": 10, "target": 3},
            {"source": 12, "target": 0},
            {"source": 15, "target": 1},
            {"source": 14, "target": 1},
            {"source": 13, "target": 1},
            {"source": 16, "target": 5},
            {"source": 17, "target": 5},
            {"source": 18, "target": 5},
            {"source": 19, "target": 6},
            {"source": 20, "target": 6},
            {"source": 21, "target": 7},
            {"source": 22, "target": 7},
            {"source": 23, "target": 8},
            {"source": 24, "target": 8},
            {"source": 25, "target": 9},
            {"source": 26, "target": 10},
            {"source": 27, "target": 11},
            {"source": 28, "target": 12},
            {"source": 29, "target": 10},
            {"source": 30, "target": 11},
            {"source": 31, "target": 12}
        ],
        "nodeSet": [
            {"nodes": [13, 14, 15, 1], "label": "server-switch", "x": -919.66820010536, "y": 132.70782764205455, "device_type": "groupL"},
            {"nodes": [17, 18, 16, 5], "label": "server-switch", "x": -616.9658343709038, "y": 161.91083338253407, "device_type": "groupL"},
            {"nodes": [31, 28, 12], "label": "pc-switch", "x": -454.18245723168434, "y": 157.01582056070595, "device_type": "groupL"},
            {"nodes": [20, 19, 6], "label": "server-switch", "x": -117.47899737256614, "y": 147.63857730315385, "device_type": "groupL"},
            {"nodes": [21, 22, 7], "label": "server-switch", "x": 104.52560768430749, "y": 158.43660715283795, "device_type": "groupL"},
            {"nodes": [25, 9], "label": "server-switch", "x": 244.49394183457616, "y": 162.35349354056234, "device_type": "groupL"},
            {"nodes": [23, 24, 8], "label": "server-switch", "x": 487.7522734974534, "y": 182.15264252985583, "device_type": "groupL"},
            {"nodes": [26, 29, 10], "label": "switch-tablet", "x": 849.8262115926245, "y": 153.5078229017621, "device_type": "groupL"},
            {"nodes": [27, 30, 11], "label": "switch-tablet", "x": 1067.120656372016, "y": 187.97601983305958, "device_type": "groupL"},
            {"nodes": [33, 34, 32, 0], "label": "Group-name", "x": -782.4909798680469, "y": 219.61684740906094, "device_type": "groupL"},
            {"nodes": [38, 37, 36, 35, 3], "label": "Group-name", "x": 106.58886505907867, "y": -62.338627424639185, "device_type": "groupL"},
            {"nodes": [40, 39, 4], "label": "Group-name", "x": 1023.081856193877, "y": 215.31044752983553, "device_type": "groupL"}
        ]
    };


    nx.define('NodeSet.Hierarchy', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    identityKey: 'id',
                    nodeConfig: {
                        label: 'model.id',
                        iconType:'model.device_type'
                    },
                    showIcon: true,
                    data: topologyData
                }
            }
        }
    });

})(nx, nx.global);