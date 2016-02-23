(function (nx, global) {
    /**
     * Convex algorithm
     * @class nx.data.Convex
     * @static
     */
    nx.define('nx.data.Convex', {
        static: true,
        methods: {
            multiply: function (p1, p2, p0) {
                return((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y));
            },
            dis: function (p1, p2) {
                return(Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)));
            },
            /**
             * Process given node array
             * @method process
             * @param inPointArray {Array} Each item should be a object, which include x&y attribute
             * @returns {Array}
             */
            process: function (inPointArray) {
                var stack = [];
                var count = inPointArray.length;
                var i, j, k = 0, top = 2;
                var tmp;

                //找到最下且偏左的那个点
                for (i = 1; i < count; i++) {
                    if ((inPointArray[i].y < inPointArray[k].y) || ((inPointArray[i].y === inPointArray[k].y) && (inPointArray[i].x < inPointArray[k].x))) {
                        k = i;
                    }
                }
                //将这个点指定为PointSet[0]
                tmp = inPointArray[0];
                inPointArray[0] = inPointArray[k];
                inPointArray[k] = tmp;

                //按极角从小到大,距离偏短进行排序
                for (i = 1; i < count - 1; i++) {
                    k = i;
                    for (j = i + 1; j < count; j++)
                        if ((this.multiply(inPointArray[j], inPointArray[k], inPointArray[0]) > 0) ||
                            ((this.multiply(inPointArray[j], inPointArray[k], inPointArray[0]) === 0) &&
                                (this.dis(inPointArray[0], inPointArray[j]) < this.dis(inPointArray[0], inPointArray[k]))))
                            k = j;//k保存极角最小的那个点,或者相同距离原点最近
                    tmp = inPointArray[i];
                    inPointArray[i] = inPointArray[k];
                    inPointArray[k] = tmp;
                }
                //第三个点先入栈
                stack[0] = inPointArray[0];
                stack[1] = inPointArray[1];
                stack[2] = inPointArray[2];
                //判断与其余所有点的关系
                for (i = 3; i < count; i++) {
                    //不满足向左转的关系,栈顶元素出栈
                    while (top > 0 && this.multiply(inPointArray[i], stack[top], stack[top - 1]) >= 0) {
                        top--;
                        stack.pop();
                    }
                    //当前点与栈内所有点满足向左关系,因此入栈.
                    stack[++top] = inPointArray[i];
                }
                return stack;
            }
        }
    });


})(nx, nx.global);