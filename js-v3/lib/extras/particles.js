class ParticleSystem extends BabylonObject {

    keys(){

        return [
            // Array of shapes to appply
            'items'
            , 'count'
            , 'updatable'
            , 'step'
        ]
    }

    propKeys(){
        return [
            // false: prevents from computing particle.rotation
            'computeParticleRotation'
            // false: prevents from computing particle.uvs
            , 'computeParticleTexture'
            // false: prevents from computing particle.color
            , 'computeParticleColor'
            // false: prevents from calling the custom updateParticleVertex() function
            , 'computeParticleVertex'

            , 'positionFunction'
            , 'vertexFunction'
            , 'updators'
        ]
    }

    itemsKey(v, o, s){
        if(v !== undefined){
            return v;
        }

        if(o.item) {
            return [o.item]
        }

        return this.items()
    }

    items(v){

        if(v!= undefined){
            this._items = v;
        };

        return this._items || [];
    }

    positionFunctionProp(o){
        return o === undefined? this.positionFunction.bind(this): o
    }

    vertexFunctionProp(o){
        return o === undefined? this.vertexFunction.bind(this): o
    }

    countProp(o){
        return o === undefined? this.count || 100: o
    }

    computeParticleRotationProp(o) {
        return o == undefined ? true: o;
    }

    computeParticleTextureProp(o) {
        return o == undefined ? true: o;
    }

    computeParticleColorProp(o) {
        return o == undefined ? true: o;
    }

    computeParticleVertexProp(o) {
        return o == undefined ? true: o;
    }

    updatableKey(o) {
        return o == undefined? true: o
    }

    init(){
        this._items = []
        this.updators = []
        super.init.apply(this, arguments)
    }

    babylonArrayArgs(){
        return false
    }

    babylonFuncName(...args) {
        /* Return the name of the function to execute on
        BABYLON[babylonFuncName] */
        return 'SolidParticleSystem'
    }

    executeBabylon(babylonFunc, name, _name, options, scene) {
        this.sps = new babylonFunc[name](_name, scene, options);
        // this._addEarly(this.sps, options)
        this.meshes = []
        if(options.updators){
            this.addUpdator(...options.updators)
        };
        var mat;
        for (var i = 0; i < options.items.length; i++) {
            let v = options.items[i];
            if(IT.g(v).is('array')) {
                this.add(v[0], v[1] || this.countProp(undefined, options), v[2])
                continue
            }

            let instanceMesh = this.add(v
                    , this.countProp(options.count, options)
                    , {
                        vertexFunction: (function(options, self){

                            return function(){
                                self.callUpdators('vertex', arguments)
                                if(options.vertexFunction != undefined) {
                                    options.vertexFunction.apply(self, arguments)

                                }
                            };

                        })(options, this)
                        , positionFunction: (function(options, self){

                            return function(){
                                self.callUpdators('position', arguments)
                                if(options.positionFunction != undefined) {
                                    options.positionFunction.apply(self, arguments)

                                }
                            };

                        })(options, this)
                    }
                )

            let m = this.sps.buildMesh()
            this.meshes.push(m)
            if(instanceMesh.material) {
                m.material = instanceMesh.material;
            }

            instanceMesh.dispose()
        }

        this._addEarly(this.sps, options)

        return this.sps
    }

    instanceMeshVertexFunction(){

    }

    instanceMeshPositionFunction(){

    }

    positionFunction(particle, spsIndex, shapeSetIndex) {
        /* Calls on update of every particle the initParticles */
        //return this._options.positionFunction && this._options.positionFunction(particle, vertex, index)
    }

    vertexFunction(particle, vertex, index) {
        //return this._options.vertexFunction && this._options.vertexFunction(particle, vertex, index)
    }

    babylonExecuted(babylon, ...args) {
        this._babylon = babylon;

        var self = this;

        babylon.initParticles = function(){
            self._initParticles.apply(self, arguments)
        }

        babylon.recycleParticle = function(){
            self._recycleParticle.apply(self, arguments)
        }
        babylon.updateParticle = function(){
            self._updateParticle.apply(self, arguments)
        }
        babylon.beforeUpdateParticles = function(){
            self._beforeUpdateParticles.apply(self, arguments)
        }
        babylon.afterUpdateParticles = function(){
            self._afterUpdateParticles.apply(self, arguments)
        }

        babylon.initParticles(babylon)
        // babylon.setParticles()
        this._addObserve = this._app._scene.onBeforeRenderObservable.add(this.step.bind(this))
        return babylon
    }

    step(){
        this.callUpdators('step', [this.sps])
        if(this._options.step) {
            this._options.step(this.sps)
        }

        this.spsSetParticles(this.sps)
    }

    spsSetParticles(sps) {

        // Ignore if false is passed;
        if(this._options.setParticles === false) return;
        this.callUpdators('setParticles', [this.sps])

        // Ensure call if true
        if( this._options.setParticles === true
            || this._initSetPartclesCalled == false
            ) {
            this.sps.setParticles()
            this._initSetPartclesCalled = true
        }
    }

    add(item, count=1, options) {

        if(this.sps == undefined) {
            this._items.push([item, count, options])
        } else {
            return this._addShape(this.sps, item, count, options)
        }
    }

    destroy(){
        if(this._addObserve){
            this._app._scene.onBeforeRenderObservable.remove(this._addObserve)
        }

        this.clearUpdators()
        super.destroy()
    }

    _addEarly(sps, options) {
        console.log('Add Earlies')
        for (var i = 0; i < this._items.length; i++) {
            this._addShape.call(this, sps, ...this._items[i])
        }
    }

    _addShape(sps, item, count, options) {
        let mesh = item;

        if(item.gardenType) {
            mesh = item.create()
        };

        sps.addShape(mesh, count, options)
        return mesh
    }

    _initParticles(){
        this.callUpdators('create', arguments)
        this.initParticles.apply(this, arguments)
    }
    _recycleParticle(){
        this.callUpdators('recycle', arguments)
        this.recycleParticle.apply(this, arguments)
    }
    _updateParticle(){
        this.callUpdators('update', arguments)
        this.updateParticle.apply(this, arguments)
    }
    _beforeUpdateParticles(){
        this.callUpdators('beforeUpdate', arguments)
        this.beforeUpdateParticles.apply(this, arguments)
    }
    _afterUpdateParticles(){
        this.callUpdators('afterUpdate', arguments)
        this.afterUpdateParticles.apply(this, arguments)
    }

    callUpdators(name, args) {
        let updators = this.updators;
        //console.log('call', name)
        for (var i = 0; i < updators.length; i++) {
            updators[i].callfunction(name, args)
        }
    }

    addUpdator(...updators) {
        let us = updators.map(x => (x.gardenType == 'class'? new x: x))
        this.updators = this.updators.concat(us)
    }

    removeUpdator(...updators) {
        for (var i = 0; i < updators.length; i++) {
            let ind = this.updators.indexOf(updators[i]);
            updators[i].destroy()
            if(ind > -1) {
                this.updators.splice(ind, 1)
            }
        }
    }

    clearUpdators(){
        let updators = this.updators;
        let updator;

        while(updators.length > 0){
            updator = updators.pop();
        // for (var i = 0; i < this.updators.length; i++) {
            let ind = this.updators.indexOf(updator);
            updator.callfunction('clear')
            if(ind > -1) {
                this.updators.splice(ind, 1)
            }
        }
    }

    initParticles(sps) {
        // : lets you set all the initial particle properties. You must iterate
        // over all the particles by using the SPS.nbParticles property. The
        // usage of this function is not mandatory.
    }

    recycleParticle(particle){
        // : lets you set a particle to be recycled. It is called per particle.
        //  The usage of this function is not mandatory.
    }

    updateParticle(particle){
        // : lets you set the particle properties. This function is called per
        // particle by SPS.setParticles().
        // The usage of this function is not mandatory.

        /*
            position : Vector3 default = (0, 0, 0)
            rotation : Vector3 default = (0, 0, 0)
            rotationQuaternion : Vector3 default = undefined
            velocity : Vector3 default = (0, 0, 0)
            color : Vector4 default = (1, 1, 1, 1)
            scaling : Vector3 default = (1, 1, 1)
            uvs : Vector(4) default = (0,0, 1,1)
            isVisible : boolean default = true
            alive : boolean default = true
         */
    }

    beforeUpdateParticles() {
        // : lets you make things within the call to SPS.setParticles() just
        // before iterating over all the particles.
        // The usage of this function is not mandatory.
    }

    afterUpdateParticles() {
        // : lets you make things within the call to SPS.setParticles() just
        // after the iteration over all the particles is done.
        // The usage of this function is not mandatory.
    }
}


class AsteriodField extends ParticleSystem {
    positionFunction(particle, i, s) {
        asXYZ(
            particle.scale
            , Math.random() + 0.8
            , Math.random() + 0.8
            , Math.random() + 0.8
            )

        asXYZ(
            particle.position
            , (Math.random() - 0.5) * 600
            , (Math.random() - 0.5) * 600
            , (Math.random() - 0.5) * 600
        )

        asXYZ(
            particle.rotation
            ,Math.random() * 3.5
            , Math.random() * 3.5
            , Math.random() * 3.5
        )

        particle.color = new BABYLON.Color3(Math.random(), Math.random(), Math.random())
    }

    vertexFunction(particle, vertex, i){
        vertex.x *= Math.random() + 1
        vertex.y *= Math.random() + 1
        vertex.z *= Math.random() + 1
    }

    step(){
        this.sps.mesh.rotation.y += 0.0005
        this.sps.mesh.position.y = Math.sin( (k - Date.now())/10000 )
         k += 0.0002
    }
}

var k = Date.now();

class ParticlePosition extends BaseClass {

    options(){
        return {};
    }

    on(v){
        this.stop = v == undefined ? false: v;
        return !this.stop;
    }

    off(v) {
        this.stop = v == undefined ? true: v;
        return this.stop;
    }

    init(config) {
        this.data = {};
        this.config = config
        this._createOptions(config || {})
    }

    create(config){
        console.log('Create ParticlePosition')
        this.config = config
        this.updateOptions(config)
    }

    _createOptions(config) {
        /* create the options for data access.
        Given initial config*/
        let opts = this.options();
        for(let key in opts) {
            this._createKeyOption(key, opts[key], opts, config)
        }
    }

    updateOptions(config) {
        /* create the options for data access.
        Given initial config*/
        let opts = this.options();
        for(let key in opts) {
            this.data[key] = opts[key];
        }
    }

    _createKeyOption(key, value, options, config){
        let v =  config[key]
        this.data[key] = v !== undefined? v: value;
        return this._createKeyFunction(key, value, options, config)
    }

    _createKeyFunction(key, value, options, config){

        (function(key){
            Object.defineProperty(this, key, {
                get: function(){ return this.data[key] }
                , set: function(v){ this.data[key] = v; return true; }
            })
        }).call(this, key);
    }

    callfunction(name, args){
        return (this[name] && !this.stop) && this[name].apply(this, args)
    }

    clear(){
        console.log('ParticlePosition clear')
        return this.destroy()
    }

    destroy(){
        console.log('ParticlePosition destroy')
    }

    // setParticles(sps){
    //     sps.setParticles()
    // }
    // create(){
    //     console.log('ParticlePosition create')
    // }
    // position(particle){
    //     console.log('ParticlePosition position')
    // }
    // vertex(){
    //     console.log('ParticlePosition vertex')
    // }
    // step(){
    //     console.log('ParticlePosition step')
    // }
    // recycle(){
    //     console.log('ParticlePosition recycle')
    // }
    // update(particle){
    //     console.log('ParticlePosition update')
    // }
    // beforeUpdate(){
    //     console.log('ParticlePosition beforeUpdate')
    // }
    // afterUpdate(){
    //     console.log('ParticlePosition afterUpdate')
    // }
}
