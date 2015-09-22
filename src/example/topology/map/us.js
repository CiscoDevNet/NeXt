(function (nx, global) {

    var topologyData =

    {"nodes": [
        {"function": "core", "name": "sfc", "latitude": 63.391326, "ipaddress": "29.29.29.29", "isisarea": "72", "site": "sfc", "longitude": -149.8286774, "y": 550.31264292335, "protected": "F", "active": "T", "x": -1021.91217850693, "type": "physical"},
        {"function": "core", "name": "sea", "latitude": 47.6062, "ipaddress": "28.28.28.28", "isisarea": "72", "site": "sea", "longitude": -122.332, "y": -9.8292223022888, "protected": "F", "active": "T", "x": -552.893870303646, "type": "physical"},
        {"function": "core", "name": "hst", "latitude": 29.7633, "ipaddress": "20.20.20.20", "isisarea": "72", "site": "hst", "longitude": -95.3633, "y": 1185.49743746152, "protected": "F", "active": "T", "x": 93.011342707737, "type": "physical"},
        {"function": "core", "name": "chi", "latitude": 41.85, "ipaddress": "19.19.19.19", "isisarea": "72", "site": "chi", "longitude": -87.65, "y": -1.78890844737532, "protected": "F", "active": "T", "x": 347.621281446664, "type": "physical"},
        {"function": "core", "name": "atl", "latitude": 33.7861178428426, "ipaddress": "17.17.17.17", "isisarea": "72", "site": "atl", "longitude": -84.1959236252621, "y": 1188.17754207982, "protected": "F", "active": "T", "x": 476.26630312528, "type": "physical"},
        {"function": "core", "name": "min", "latitude": 44.98, "ipaddress": "24.24.24.24", "isisarea": "72", "site": "min", "longitude": -93.2638, "y": -4.46901306567981, "protected": "F", "active": "T", "x": -67.7949343905326, "type": "physical"},
        {"function": "core", "name": "lax", "latitude": 34.0522, "ipaddress": "22.22.22.22", "isisarea": "72", "site": "lax", "longitude": -118.244, "y": 941.607917195807, "protected": "F", "active": "T", "x": -702.979728928698, "type": "physical"},
        {"function": "core", "name": "kcy", "latitude": 39.0997, "ipaddress": "21.21.21.21", "isisarea": "72", "site": "kcy", "longitude": -94.5786, "y": 539.592224450132, "protected": "F", "active": "T", "x": -65.1148297722282, "type": "physical"},
        {"function": "core", "name": "nyc", "latitude": 40.7879, "ipaddress": "25.25.25.25", "isisarea": "72", "site": "nyc", "longitude": -74.0143, "y": 378.785947351863, "protected": "F", "active": "T", "x": 679.954254116421, "type": "physical"},
        {"function": "core", "name": "wdc", "latitude": 38.8951, "ipaddress": "31.31.31.31", "isisarea": "72", "site": "wdc", "longitude": -77.0364, "y": 767.401117006014, "protected": "F", "active": "T", "x": 599.551115567286, "type": "physical"},
        {"function": "core", "name": "por", "latitude": 45.5234, "ipaddress": "26.26.26.26", "isisarea": "72", "site": "por", "longitude": -122.676, "y": -15.1894315388978, "protected": "F", "active": "T", "x": -1016.55196927032, "type": "physical"},
        {"function": "core", "name": "alb", "latitude": 42.6526, "ipaddress": "16.16.16.16", "isisarea": "72", "site": "alb", "longitude": -73.7562, "y": 0.891196170929173, "protected": "F", "active": "T", "x": 1041.76837758753, "type": "physical"},
        {"function": "core", "name": "mia", "latitude": 25.7743, "ipaddress": "23.23.23.23", "isisarea": "72", "site": "mia", "longitude": -80.1937, "y": 1177.4571236066, "protected": "F", "active": "T", "x": 1023.0076452594, "type": "physical"},
        {"function": "core", "name": "san", "latitude": 32.7153, "ipaddress": "27.27.27.27", "isisarea": "72", "site": "san", "longitude": -117.157, "y": 1180.13722822491, "protected": "F", "active": "T", "x": -400.12790706029, "type": "physical"},
        {"function": "core", "name": "bos", "latitude": 42.3584, "ipaddress": "18.18.18.18", "isisarea": "72", "site": "bos", "longitude": -71.0598, "y": 378.785947351863, "protected": "F", "active": "T", "x": 1341.94009483763, "type": "physical"},
        {"function": "core", "name": "sjc", "latitude": 36.137242513163, "ipaddress": "30.30.30.30", "isisarea": "72", "site": "sjc", "longitude": -120.754451723841, "y": 547.632538305046, "protected": "F", "active": "T", "x": -558.254079540255, "type": "physical"}
    ], "links": [
        {"source": "atl", "targetInterface": "GigabitEthernet0/0/0/1", "target": "wdc", "sourceInterface": "GigabitEthernet0/0/0/3"},
        {"source": "atl", "targetInterface": "GigabitEthernet0/0/0/1", "target": "hst", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "wdc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "mia", "sourceInterface": "GigabitEthernet0/0/0/3"},
        {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "san", "sourceInterface": "GigabitEthernet0/0/0/4"},
        {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/1", "target": "sjc", "sourceInterface": "GigabitEthernet0/0/0/5"},
        {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "min", "sourceInterface": "GigabitEthernet0/0/0/3"},
        {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/4", "target": "chi", "sourceInterface": "GigabitEthernet0/0/0/3"},
        {"source": "sea", "targetInterface": "GigabitEthernet0/0/0/3", "target": "min", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "sfc", "targetInterface": "GigabitEthernet0/0/0/4", "target": "sjc", "sourceInterface": "GigabitEthernet0/0/0/2"},
        {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/4", "target": "wdc", "sourceInterface": "GigabitEthernet0/0/0/4"},
        {"source": "por", "targetInterface": "GigabitEthernet0/0/0/2", "target": "sea", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "san", "targetInterface": "GigabitEthernet0/0/0/3", "target": "hst", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "sjc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "lax", "sourceInterface": "GigabitEthernet0/0/0/2"},
        {"source": "mia", "targetInterface": "GigabitEthernet0/0/0/2", "target": "atl", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "sfc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "por", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "san", "targetInterface": "GigabitEthernet0/0/0/1", "target": "lax", "sourceInterface": "GigabitEthernet0/0/0/3"},
        {"source": "min", "targetInterface": "GigabitEthernet0/0/0/3", "target": "chi", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/3", "target": "alb", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "alb", "targetInterface": "GigabitEthernet0/0/0/1", "target": "chi", "sourceInterface": "GigabitEthernet0/0/0/2"},
        {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "wdc", "sourceInterface": "GigabitEthernet0/0/0/6"},
        {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "hst", "sourceInterface": "GigabitEthernet0/0/0/2"},
        {"source": "sjc", "targetInterface": "GigabitEthernet0/0/0/3", "target": "sea", "sourceInterface": "GigabitEthernet0/0/0/3"},
        {"source": "bos", "targetInterface": "GigabitEthernet0/0/0/1", "target": "alb", "sourceInterface": "GigabitEthernet0/0/0/1"},
        {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "bos", "sourceInterface": "GigabitEthernet0/0/0/2"},
        {"source": "chi", "targetInterface": "GigabitEthernet0/0/0/1", "target": "kcy", "sourceInterface": "GigabitEthernet0/0/0/2"}
    ]};

    nx.define('Map.US', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    nodeConfig: {
                        label: 'model.name'
                    },
                    showIcon: false,
                    identityKey: 'name',
                    layoutType: 'USMap',
                    layoutConfig: {
                        longitude: 'model.longitude',
                        latitude: 'model.latitude'
                    },
                    data: topologyData
                }
            }
        }
    });

})(nx, nx.global);


