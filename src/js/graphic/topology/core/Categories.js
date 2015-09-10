(function (nx, global) {
    /**
     * Topology's batch operation class
     * @class nx.graphic.Topology.Categories
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.Categories", {
        events: [],
        properties: {
        },
        methods: {
            /**
             * Show loading indicator
             * @method showLoading
             */
            showLoading: function () {
                nx.dom.Document.html().addClass('n-waitCursor');
                this.view().dom().addClass('n-topology-loading');
                this.view('loading').dom().setStyle('display', 'block');
            },
            /**
             * Hide loading indicator
             * @method hideLoading
             */
            hideLoading: function () {
                nx.dom.Document.html().removeClass('n-waitCursor');
                this.view().dom().removeClass('n-topology-loading');
                this.view('loading').dom().setStyle('display', 'none');
            },
            exportPNG: function () {

                this.fit();


                var serializer = new XMLSerializer();
                var stageScale = this.stageScale();
                var translateX = topo.matrix().x();
                var translateY = topo.matrix().y();
                var stage = this.stage().view().dom().$dom.querySelector('.stage').cloneNode(true);
                nx.each(stage.querySelectorAll('.fontIcon'), function (icon) {
                    icon.remove();
                });

                nx.each(stage.querySelectorAll('.link'), function (item) {
                    item.style.stroke = '#26A1C5';
                    item.style.fill = 'none';
                    item.style.background = 'transparent';
                });

                nx.each(stage.querySelectorAll('line.link-set-bg'), function (item) {
                    item.style.stroke = '#26A1C5';
                });

                nx.each(stage.querySelectorAll('text.node-label'), function (item) {
                    item.style.fontSize = '12px';
                    item.style.fontFamily = 'Tahoma';
                });

                nx.each(stage.querySelectorAll('.n-hidden'), function (hidden) {
                    hidden.remove();
                });

                nx.each(stage.querySelectorAll('.selectedBG'), function (item) {
                    item.remove();
                });

                nx.each(stage.querySelectorAll('[data-nx-type="nx.graphic.Topology.GroupsLayer"]'), function (item) {
                    item.remove();
                });


                var svg = serializer.serializeToString(stage);
                var svgString = '<svg width="' + this.width() + '" height="' + this.height() + '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >' + svg + "</svg>";
                var b64 = window.btoa(svgString);
                var img = this.view("img").dom().$dom;
                //var canvas = this.view("canvas").view().$dom;
                img.setAttribute('width', this.width());
                img.setAttribute('height', this.height());
                img.setAttribute('src', 'data:image/svg+xml;base64,' + b64);
                var canvas = this.view('canvas').dom().$dom;
                var ctx = canvas.getContext("2d");
                var revisionScale = this.revisionScale();
                var fontSize = 32 * revisionScale;


                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, this.width(), this.height());


                ctx.drawImage(img, 0, 0);
                ctx.font = fontSize + "px next-font";
                this.eachNode(function (node) {
                    var iconType = node.iconType();
                    var iconObject = nx.graphic.Icons.get(iconType);
                    ctx.fillStyle = '#fff';
                    ctx.fillText(iconObject.font[1], node.x() / stageScale + translateX - 16 * revisionScale, node.y() / stageScale + translateY + 16 * revisionScale);
                    ctx.fillStyle = node.color() || '#26A1C5';
                    ctx.fillText(iconObject.font[0], node.x() / stageScale + translateX - 16 * revisionScale, node.y() / stageScale + translateY + 16 * revisionScale);
                });
                var link = document.createElement('a');
                link.setAttribute('href', canvas.toDataURL());
                link.setAttribute('download', (new Date()).getTime() + ".png");
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                link.dispatchEvent(event);
            },
            __drawBG: function (inBound) {
                var bound = inBound || this.stage().getContentBound();
                var bg = this.stage().view('bg');
                bg.sets({
                    x: bound.left,
                    y: bound.top,
                    width: bound.width,
                    height: bound.height,
                    visible: true
                });
                bg.set('visible', true);
            }
        }
    });


})(nx, nx.global);