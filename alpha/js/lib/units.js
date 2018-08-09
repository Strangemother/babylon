function matrix(data, width){
    /* A matrx is a list of data, with a defined width
    for a given row segmenet.
    The 2D shape is read is square form.*/
    return {
        type: 'matrix'
        , data: data
        , width: width
        , instances: true
        // Define an object for creation through Objects.*
        // self.items must exist
        , item: {
            type: 'box'
            , color: []
            , edge: [4]
        }
        // If a defined object in self.item, and not override.
        // The self.items is an object to fetch an instance by design of
        // self.item and build and object.
        //
        , items: undefined
        , makeItem: function(scene, name, item, index){
            item = (item == undefined) ? this.item: item;

            if(this.items !== undefined) {
                return this.items.render(scene, item, name)
            };

            return item(scene, name)
        }

        , render: function(scene, item, index) {

            /* Render an item within the matix renderer */
            if(this.instances && this._instance == undefined) {
                this._instance =  this.makeItem(scene, `item${index}`);
                return this._instance
            }

            if( this.instances
                && this._instance !== undefined
                && this._instance.createInstance !== undefined ){

                var im = this._instance.createInstance('instance' + index);
                //console.log('creating instance', index)
                return this.items.instanceRender(scene, im, this.item )
            }

            return this.makeItem(scene, `item${index}`)
        }
    }
}


var randomNumber = function (min, max) {
    if (min == max) {
        return (min);
    }
    var random = Math.random();
    return ((random * (max - min)) + min);
};


var throttle = function(timing, func, scope) {
    /* throttle calls to the wrapped function, calling
    the function after timing regardless of call count.
    Arguments given to the last throttled call are provided
    to the wrapped function

        f = throttle(2000, function(){
            window.clearInterval(t);
        });

        t = window.setInterval(function(){
            console.log( f() )
        }, 20);

        false x100
        true
    */
    var lastCall = +(new Date);
    scope = scope || window;

    var throttleFunc = (function(){
        var ld = this.lastCall, delay= this.timing, f=this.func, p = this.scope
        , lastArgs

        return function(){
            var lastArgs = arguments;
            /* Called a billion times. */
            var cd = +(new Date)
            var cv = (cd) - ld;
            if(cv > delay) {
                f.apply(p, lastArgs);
                ld = cd;
                return true;
            }

            return false;
        };

    }).apply({lastCall, timing, func, scope})

    return throttleFunc
}


var distort = function(_mesh, distortValue){
    distortValue = distortValue || 1;
    var positions = _mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var indices = _mesh.getIndices();
    var numberOfPoints = positions.length/3;

    var map = [];

    // The higher point in the sphere
    var v3 = BABYLON.Vector3;
    var max = [];

    for (var i=0; i<numberOfPoints; i++) {
        var p = new v3(positions[i*3], positions[i*3+1], positions[i*3+2]);

        if (p.y >= distortValue/2) {
            max.push(p);
        };

        var found = false;
        for (var index=0; index<map.length&&!found; index++) {
            var array = map[index];
            var p0 = array[0];
            if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
                array.push(i*3);
                found = true;
            }
        };

        if (!found) {
            var array = [];
            array.push(p, i*3);
            map.push(array);
        };

    }

    map.forEach(function(array) {
        var index, min = -distortValue/10, max = distortValue/10;
        var rx = randomNumber(min,max);
        var ry = randomNumber(min,max);
        var rz = randomNumber(min,max);

        for (index = 1; index<array.length; index++) {
            var i = array[index];
            positions[i] += rx;
            positions[i+1] += ry;
            positions[i+2] += rz;
        }
    });

    _mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    _mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);

    return _mesh;
}
