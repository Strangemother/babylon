
class MatrixLayout extends CoreClass {

    init(matrix, scene, config) {
        this._matrix = matrix
        this.scene = scene
        this.config = config || {}
    }

    get speed(){
        return this._speed || 10
    }

    set speed(v){
        this._speed = v
    }

    run(scene){
        // store the rendered items.
        this.items = []
        // Build a list of xyz positions
        var positions = this.positions(this._matrix);
        // Render the positions
        this.slowRenderPositions(this._matrix, scene, positions)
        this.log('Rendering floor', positions)
    }

    getItem(scene, index, matrix){
        // matrix render function
        return this._matrix.render(scene, this.config.item, index)
    }

    positions(_matrix) {
        var res = []
            , data = _matrix.data
            , tick = 0
            , tc = 0
            , padding = 2.2
            , distance = this.config.distance || 0
            ;

        for (var i = 0; i < data.length; i++) {

            if(tc >= _matrix.width) {
                tick += 1
                tc = 0
            };

            var item = {};
            var _d = distance % 1 == NaN? 0: distance
            item.y = 1.03;
            item.x = tc * (_d + padding);
            item.z = tick * (_d + padding);
            tc++;
            res.push(item);
        }

        return res;
    }

    renderPositions(_matrix, scene, positions) {
        var p;
        for (var i = 0; i <= _matrix.data.length - 1; i++) {
            var item = _matrix.data[i];
            p = positions[i]
            this.items.push(this.addItem(scene, i, _matrix, p) );
        }
        this.enables(_matrix.data, this.items)

    }

    slowRenderPositions(_matrix, scene, positions, count=0) {

        var p = positions[count]
        var item = this.addItem(scene, count, _matrix, p)
        this.items.push(item)

        count+=1
        if(_matrix.data.length == count) {
            this.enables(_matrix.data, this.items)
            return true;

        }

        window.setTimeout(
            this.slowRenderPositions.bind(this)
            , this.speed, _matrix, scene, positions, count)
    }

    enables(dataList, items){
        var item;

        for (var i = 0; i < dataList.length; i++) {
            if(items[i] !== undefined) {
                item = items[i];
            } else {
                continue;
            }

            var mesh = item._babylon ? item._babylon: item;
            mesh.setEnabled(dataList[i])
        }
    }

    addItem(scene, count, _matrix, p) {
        var item = this.getItem(scene, count, _matrix)
        item.position.x = p.x
        item.position.y = p.y
        item.position.z = p.z
        return item;
    }
}
