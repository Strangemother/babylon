

  var fact = 600;   // density
  var scaleX = 0.0;
  var scaleY = 0.0;
  var scaleZ = 0.0;
  var grey = 0.0;


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
        ]
    }

    positionFunctionProp(o){
        return o === undefined? this.positionFunction.bind(this): o
    }

    vertexFunctionKey(o){
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

    updateKey(o) {
        return o == undefined? true: o
    }

    init(){
        this._items = []
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
                        vertexFunction: options.vertexFunction
                        , positionFunction: options.positionFunction
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

    positionFunction(particle, spsIndex, shapeSetIndex) {
        /* Calls on update of every particle the initParticles */
        //return this._options.positionFunction && this._options.positionFunction(particle, vertex, index)
    }

    vertexFunction(particle, vertex, index) {
        //return this._options.vertexFunction && this._options.vertexFunction(particle, vertex, index)
    }

    babylonExecuted(babylon, ...args) {
        this._babylon = babylon;

        babylon.initParticles = this.initParticles
        babylon.recycleParticle = this.recycleParticle
        babylon.updateParticle = this.updateParticle
        babylon.beforeUpdateParticles = this.beforeUpdateParticles
        babylon.afterUpdateParticles = this.afterUpdateParticles

        babylon.initParticles(babylon)
        // babylon.setParticles()
        this._addObserve = this._app._scene.onBeforeRenderObservable.add(this.step.bind(this))
        return babylon
    }

    step(){
        if(this._options.step) {
            this._options.step(this.sps)
        } else {
            this.sps.setParticles()
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


class SprayParticles extends ParticleSystem {
    initParticles(sps) {
        // : lets you set all the initial particle properties. You must iterate
        // over all the particles by using the SPS.nbParticles property. The
        // usage of this function is not mandatory.
        let particles = sps.particles, pt
        for (var p = 0; p < sps.nbParticles; p++) {
            pt = particles[p]
            // pt.age = Math.random() * 20;
            this.recycleParticle(pt)
        }
    }

    positionFunction(particle, spsIndex, s) {
        /* Calls on update of every particle the initParticles */
        particle.rotation.y = s / 150;
        particle.position.x = s - 150;
        //particle.uvs = new BABYLON.Vector4(0, 0, 0.33, 0.33); // first image from an atlas
        //particle.scaling.y -= .01
    }

    recycleParticle(particle){
        // : lets you set a particle to be recycled. It is called per particle.
        //  The usage of this function is not mandatory.
        particle.position.x = 0;
        particle.position.y = 0;
        particle.position.z = 0;
        particle.velocity.x = (Math.random() - 0.5) * 1.5;
        particle.velocity.y = Math.random() * 1.5;
        particle.velocity.z = (Math.random() - 0.5) * 1.5;
        particle.color = colors.make([Math.random(), Math.random(), Math.random()])
    }

    updateParticle(particle) {
        if (particle.position.y < 0) {
            this.recycleParticle(particle);
        }

        particle.velocity.y += -0.01;                         // apply gravity to y
        (particle.position).addInPlace(particle.velocity);      // update particle new position
        particle.position.y += 1.5 / 2;

        var sign = (particle.idx % 2 == 0) ? 1 : -1;            // rotation sign and new value
        particle.rotation.z += 0.1 * sign;
        particle.rotation.x += 0.05 * sign;
        particle.rotation.y += 0.008 * sign;
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
