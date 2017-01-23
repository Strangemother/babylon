;(function(global){

var test = Test.assertions;


class InstanceTests {

    test_exists() {
        /* Ensure INSTANCE exists another large content block.*/
        test.value(_instance).isObject()
    }

}

class ChildManagerTests {

    test__babylon() {
        /* Get babylon instance if exists. */
        let c = new ChildManager()
        test.value(c._babylon).isUndefined()

        let expected = 'foo';
        c._babylon = expected
        test.value(c._babylon).is(expected)
    }
}

class BaseTests {

    test_init(){
        /* constructor calls init*/
        test.classMethodCalled(BaseClass, 'init')
    }
}


class BabylonBaseTests {

    test_init(){
        /* constructor calls init*/

        let config = { foo: 1, bar: 2 }
        let b = new BabylonBase(config)
        test.value(b._renderers).isArray()
        test.value(b.clearColor).isArray()
        test.value(b.clearColor.length).is(3)
        test.value(b.initConfig).match(config)
        test.value(b._ran).is(false)
        test.value(b._stop).is(false)
    }

    test_stop(){
        /* Ensure stop value stores and returns.*/
        let expected = 'foo'
        let b = new BabylonBase()
        let value = b.stop();

        test.value(value).is(true);
        value = b.stop(expected)
        test.value(value).is(expected);
        test.value(b._stop).is(expected);
    }
}


class ShapesTests {
    _shapes(){
        return [
            Box
            , Sphere
            , Cylinder
            , Plane
            , Ground
            , GroundFromHeightMap
            , TiledGround
            , Disc
            , Torus
            , TorusKnot
            , Polyhedron
            , IcoSphere
            , Decals
        ]
    }

    test_can_create(){
        var shapes = this.instance._shapes();
        describe('each shape instance', function(){
            for(let ShapeClass of shapes) {

                let shape = new ShapeClass
                it(`Expects ${ShapeClass.name} instance`, function(){
                    test.value(shape).isInstanceOf(ShapeClass)

                })
            }
        })
    }

    test_create(){
        /* Ensure elements inherit data correctly */

        let b = new Box();
        let e, result, expected
        e = b.create({ size: .1, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [0.05, -0.05, 0.05, -0.05, -0.05, 0.05, -0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, -0.05, -0.05, 0.05, -0.05, -0.05, -0.05, -0.05, 0.05, -0.05, -0.05, 0.05, 0.05, -0.05, 0.05, -0.05, -0.05, 0.05, -0.05, 0.05, 0.05, 0.05, 0.05, -0.05, 0.05, 0.05, -0.05, -0.05, 0.05, -0.05, -0.05, -0.05, -0.05, 0.05, -0.05, -0.05, 0.05, 0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05, 0.05, 0.05, 0.05, -0.05, 0.05, 0.05, -0.05, -0.05, -0.05, -0.05, -0.05, -0.05, -0.05, 0.05]

        test.array(expected).match(result)
        e.dispose();

        b = new Box()
        e = b.create({ size: 1, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5]

        test.array(expected).match(result)

        e.dispose();


        b = new Box()
        e = b.create({ size: 2, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1]

        test.array(expected).match(result)

        e.dispose();
        b = new Box()
        e = b.create({ size: 3, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [1.5, -1.5, 1.5, -1.5, -1.5, 1.5, -1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, -1.5, -1.5, 1.5, -1.5, -1.5, -1.5, -1.5, 1.5, -1.5, -1.5, 1.5, 1.5, -1.5, 1.5, -1.5, -1.5, 1.5, -1.5, 1.5, 1.5, 1.5, 1.5, -1.5, 1.5, 1.5, -1.5, -1.5, 1.5, -1.5, -1.5, -1.5, -1.5, 1.5, -1.5, -1.5, 1.5, 1.5, -1.5, 1.5, -1.5, 1.5, 1.5, -1.5, 1.5, 1.5, 1.5, 1.5, -1.5, 1.5, 1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, 1.5]

        test.array(expected).match(result)

        e.dispose();
        b = new Box()
        e = b.create({ height: 3, depth: 1, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [0.5, -1.5, 0.5, -0.5, -1.5, 0.5, -0.5, 1.5, 0.5, 0.5, 1.5, 0.5, 0.5, 1.5, -0.5, -0.5, 1.5, -0.5, -0.5, -1.5, -0.5, 0.5, -1.5, -0.5, 0.5, 1.5, -0.5, 0.5, -1.5, -0.5, 0.5, -1.5, 0.5, 0.5, 1.5, 0.5, -0.5, 1.5, 0.5, -0.5, -1.5, 0.5, -0.5, -1.5, -0.5, -0.5, 1.5, -0.5, -0.5, 1.5, 0.5, -0.5, 1.5, -0.5, 0.5, 1.5, -0.5, 0.5, 1.5, 0.5, 0.5, -1.5, 0.5, 0.5, -1.5, -0.5, -0.5, -1.5, -0.5, -0.5, -1.5, 0.5]

        test.array(expected).match(result)
        e.dispose();
    }

    test_position_overrides(){
        let tube = new app.shapes.Cylinder( { position: [1,2,3] })
        app.children.add(tube, { position: [0,1,2]})

        // Vector3 {x: 0, y: 1, z: 2}
        let p = tube.position()
        test.value(p.x).is(0)
        test.value(p.y).is(1)
        test.value(p.z).is(2)

        tube.destroy()
    }

    test_color_switching(){
        /* Can switch a color on the mesh */

        let b = new Box
        // Box {_options: Object, _args: Array[0], id: "37qsa2b4g4"}
        b.addToScene({color: 'red'})

        let redColor = b.color()
        this.instance.objRGB(redColor, 1, 0, 0)


        // Mesh {state: "", metadata: null, doNotSerialize: false, animations: Array[0], _ranges: Object…}
        let greenMat = b.color('green')
        test.value(greenMat).isInstanceOf(BABYLON.StandardMaterial)
        // StandardMaterial {checkReadyOnEveryCall: false, checkReadyOnlyOnce: false, state: "", alpha: 1, backFaceCulling: true…}
        let r = b.color()
        this.instance.objRGB(r, 0, 1, 0)

        let blueMat = b.color('blue')
        // StandardMaterial {checkReadyOnEveryCall: false, checkReadyOnlyOnce: false, state: "", alpha: 1, backFaceCulling: true…}
        test.value(blueMat).isInstanceOf(BABYLON.StandardMaterial)
        test.value(blueMat).isNot(greenMat)

        let bc = b.color()
        this.instance.objRGB(bc, 0, 0, 1)

        b.destroy()
    }

    objRGB(o, r, g, b){
        test.value(o.r).is(r)
        test.value(o.g).is(g)
        test.value(o.b).is(b)
    }

}


class CreateMethodTest {
    test_create_calls_make() {
        /* create function calls make function */
        var b;
        test.classStaticMethodCalled(Garden, 'make', function(mock, Klass){
            mock.returns(new Box)
            b = Klass.create('box');
        });

        b.destroy()
    }
}


class ColorsTests {

    test_make_color(){
        /* Ensure the color.make function returns a BABYLON type */
        let c3 = colors.make(.5, .3, .1)
        this.instance.objRGB(c3, .5, .3, .1)

    }

    test_add_colors(){
        /* Can add an object of values to colors.addColors */
        let cs = {
            'foo': [.4,.3,.2]
            , 'bar': [.9, .8, .7]
        }

        colors.addColors(cs)

        test.value(colors.foo).isFunction()
        let r = colors.foo()
        this.instance.objRGB(r, .4,.3,.2)
    }

    test_hex(){
        /* can convert hex to Color3 */
        let r = colors.hex('#FF0000')
        this.instance.objRGB(r, 1, 0, 0)

        r = colors.hex('#00FF00')
        this.instance.objRGB(r, 0, 1, 0)

    }

    test_mesh_apply() {
        /* Can apply a color to a mesh*/
        let box = new Box({color: 'red'});
        box.addToScene()
        let r = box.color();
        this.instance.objRGB(r, 1, 0, 0)

        box.color('green');
        let mat = box._babylon.material
        let diffuseColor = mat.diffuseColor;

        test.value(mat).isInstanceOf(BABYLON.StandardMaterial)
        test.object(box._babylon.material).match(mat)
        this.instance.objRGB(diffuseColor, 0, 1, 0)

        r = box.color()
        this.instance.objRGB(r, 0, 1, 0)

        box.destroy()
    }

    objRGB(o, r,g, b, a=null){
        test.value(o.r).is(r)
        test.value(o.g).is(g)
        test.value(o.b).is(b)
        if(a !==null) {
            test.value(o.a).is(a)
        }
    }

    test_colors_make(){
        /* Make returns Color3 and Color4 */

        let result, expected;

        result = colors.make3(.4, .1, .7, .8)
        test.value(result).isInstanceOf(BABYLON.Color3)
        this.instance.objRGB(result, .4, .1, .7)

        result = colors.make3(.4, .1, .7)
        test.value(result).isInstanceOf(BABYLON.Color3)
        this.instance.objRGB(result, .4, .1, .7)

        result = colors.make4(.4, .1, .7, .8)
        test.value(result).isInstanceOf(BABYLON.Color4)
        this.instance.objRGB(result, .4, .1, .7, .8)

        result = colors.make4(.4, .1, .7)
        test.value(result).isInstanceOf(BABYLON.Color4)
        this.instance.objRGB(result, .4, .1, .7, 1)

    }

    test_color_get(){
        let result;

        result = colors.get('green')
        test.value(result).isInstanceOf(BABYLON.Color4)

        this.instance.objRGB(result, 0, 1, 0, 1)


        result = colors.get('green', 3)
        test.value(result).isInstanceOf(BABYLON.Color3)
        this.instance.objRGB(result, 0, 1, 0)

    }
}

class BabylonObjectTests {

    test_args() {
        /* can provide options */
        let expected = { foo: 1, bar: 1};
        let b = new BabylonObject(expected);
        test.value(b._options).isObject(expected)
    }
}


class PropertyTests {
    test_properties() {
        let b = new Box({
            position: new BABYLON.Vector3(1,2,3)
            , scaling: new BABYLON.Vector3(1,2,3)
        });
        let mesh = b.addToScene();
        let _babylon = b._babylon;
        test.value(mesh).match(_babylon)

        let p = mesh.position;
        test.value(p.x).is(1)
        test.value(p.y).is(2)
        test.value(p.z).is(3)

        let s = mesh.scaling;
        test.value(s.x).is(1)
        test.value(s.y).is(2)
        test.value(s.z).is(3)

        b.destroy()
    }

    test_wireframe(){
        /* Can change wireframe */
        let b = new Box({
            position: new BABYLON.Vector3(1,2,3)
        });
        let mesh = b.addToScene();
        let _babylon = b._babylon;
        test.value(mesh).match(_babylon)

        test.value(b.wireframe).isFalse()

        b.destroy()
    }
}

class DisplayListManagerTests {
    test_destroy(){
        /* Will true destroy an entity. */
        let b = new Box();
        b.addToScene()
        let dli = b._displayListIndex;
        test.value(app.children.displayList[dli][0]).match(b);

        test.bool(app.children.displayList[dli] == undefined).isFalse()
        b.destroy();
        test.bool(app.children.displayList[dli] == undefined).isTrue()
    }
}

Test.add(InstanceTests)
Test.add(BaseTests)
Test.add(BabylonBaseTests)
Test.add(ShapesTests)
Test.add(ChildManagerTests)
Test.add(CreateMethodTest)
Test.add(ColorsTests)
Test.add(BabylonObjectTests)
Test.add(PropertyTests)
Test.add(DisplayListManagerTests)

})(window)


