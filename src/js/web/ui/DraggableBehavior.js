(function (nx) {

    nx.define('nx.ui.DraggableBehavior', nx.ui.Behavior, {
        methods: {
            onAttach: function (parent, index) {
                parent.on('mousedown', this._onMouseDown, this);
                nx.app.on('mousemove', this._onMouseMove, this);
                parent.on('mouseup', this._onMouseUp, this);
            },
            onDetach: function () {
                this.parent().off('mousedown', this._onMouseDown, this);
                nx.app.off('mousemove', this._onMouseMove, this);
                this.parent().off('mouseup', this._onMouseUp, this);
            },
            _onMouseDown: function (sender, event) {
                this._captured = true;
                this._target = sender.resolve('@root').$dom;
                this._startX = event.pageX;
                this._startY = event.pageY;
            },
            _onMouseMove: function (sender, event) {
                if (this._captured) {
                    var offsetX = event.pageX - this._startX;
                    var offsetY = event.pageY - this._startY;

                    this._target.style.webkitTransform = 'translate(' + offsetX + 'px,' + offsetY + 'px)';
                }
            },
            _onMouseUp: function (sender, event) {
                this._captured = false;
            }
        }
    });
})(nx);