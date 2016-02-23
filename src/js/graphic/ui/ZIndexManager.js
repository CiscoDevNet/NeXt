(function (nx,global) {
    var zIndex = 1000;
    /**
     * Popup z-index mamager
     * @class nx.widget.ZIndexManager
     * @static
     */
    nx.define('nx.widget.ZIndexManager',null,{
        static: true,
        methods: {
            getIndex: function () {
                return zIndex++;
            }
        }
    });
}(nx,nx.global));