(function (nx, global) {

    nx.graphic.define("nx.graphic.Hint", {
        properties: {
            direction: {
                value: 'top'
            },
            userDirection: {},
            text: {
                value: null
            },
            position: {
                set: function (value) {
                    this._position = value;
                    this.view().set('translateX', value.x);
                    this.view().set('translateY', value.y);
                }
            },

            style: {
                set: function (value) {
                    this._style = value;

                    if (value && value.textColor) {
                        this.view("text").setStyle("fill", value.textColor);
                    }
                    if (value && value["font-size"]) {
                        this.view("text").setStyle("font-size", value["font-size"]);
                    }

                    if (value) {
                        this.view("rect").sets(value);
                    }


                    if (value && value.fill) {
                        this.view("arrow").set("fill", value.fill);
                    }
                }
            },
            offset: {
                value: function () {
                    return {x: 0, y: 0}
                }
            },
            gap: {
                value: 0
            },
            align: {
                value: 'middle'
            }
        },

        view: {
            type: "nx.graphic.Group",
            content: [

                {
                    name: 'rect',
                    type: 'nx.graphic.Rect',
                    props: {
                        fill: "#1F6EEE",
                        opacity: 0.7

                    }

                },
                {
                    name: 'arrow',
                    type: 'nx.graphic.Path',
                    props: {
                        d: 'M0,0L10,0L5,5Z',
                        opacity: 0.7,
                        fill: "#1F6EEE"
                    }
                },
                {
                    name: 'text',
                    type: 'nx.graphic.Text',
                    props: {
                        translateX: 0,
                        translateY: 0,
                        text: '{#text}',
                        fill: "#fff",
                        'pointer-events': 'none'
                    }
                }
            ]
        },
        methods: {
            update: function () {
                var direction = this.direction();
                var text = this.view("text");
                var rect = this.view("rect");
                var arrow = this.view("arrow");

                if (this.text()) {
                    text.show();
                    rect.show();
                    arrow.show();
                }
                else {
                    text.hide();
                    rect.hide();
                    arrow.hide();
                }

                var textBound = text.getBound();

                rect.sets({
                    width: textBound.width + 9,
                    height: textBound.height + 5
                });


                var offset = this.offset();

                var bound = rect.getBound();

                var strokeWidth = parseFloat(rect.get("stroke-width")) || 0;

                var rectHeight = bound.height;
                var rectWidth = bound.width;


                var textHeight = rectHeight - 5;

                var align = this.align();

                var gap = this.gap();

                if (direction == "top") {

                    arrow.set("translateY", offset.y / -2 - gap);
                    arrow.set("translateX", -5);
                    arrow.set("rotate", "0");

                    rect.set("translateY", offset.y / -2 - gap - rectHeight + 0.5 - strokeWidth / 2); //fix getboox
                    rect.set("translateX", rectWidth / -2);

                    text.set("translateY", offset.y / -2 - gap - 5 - strokeWidth / 2);
                    text.set("translateX", 0);
                    text.set("text-anchor", "middle");

                } else if (direction == "bottom") {

                    arrow.set("translateY", offset.y / 2 + gap);
                    arrow.set("translateX", 5);
                    arrow.set("rotate", "-180");

                    rect.set("translateY", offset.y / 2 + gap + strokeWidth / 2); //fix getboox
                    rect.set("translateX", rectWidth / -2);

                    text.set("translateY", offset.y / 2 + gap - 0.5 + textHeight + strokeWidth / 2);
                    text.set("translateX", 0);

                    text.set("text-anchor", "middle");
                } else if (direction == "right") {

                    arrow.set("translateY", -5);
                    arrow.set("translateX", offset.x / 2 + gap);
                    arrow.set("rotate", "90");

                    rect.set("translateY", rectHeight / -2); //fix getboox
                    rect.set("translateX", offset.x / 2 + gap + strokeWidth / 2 - 0.5);

                    text.set("translateY", 5);
                    text.set("translateX", offset.x / 2 + gap + 4 + strokeWidth / 2);

                    text.set("text-anchor", "start");
                } else {

                    arrow.set("translateY", 5);
                    arrow.set("translateX", offset.x / -2 - gap);
                    arrow.set("rotate", "-90");

                    rect.set("translateY", rectHeight / -2); //fix getboox
                    rect.set("translateX", offset.x / -2 - gap - rectWidth - strokeWidth / 2 + 0.5);

                    text.set("translateY", 5);
                    text.set("translateX", offset.x / -2 - gap - 5 - strokeWidth / 2);

                    text.set("text-anchor", "end");
                }
            }
        }

    });


})(nx, nx.global);