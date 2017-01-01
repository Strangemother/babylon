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

        b = new Box()
        e = b.create({ size: 1, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5]

        test.array(expected).match(result)

        b = new Box()
        e = b.create({ size: 2, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1]

        test.array(expected).match(result)

        b = new Box()
        e = b.create({ size: 3, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [1.5, -1.5, 1.5, -1.5, -1.5, 1.5, -1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, -1.5, -1.5, 1.5, -1.5, -1.5, -1.5, -1.5, 1.5, -1.5, -1.5, 1.5, 1.5, -1.5, 1.5, -1.5, -1.5, 1.5, -1.5, 1.5, 1.5, 1.5, 1.5, -1.5, 1.5, 1.5, -1.5, -1.5, 1.5, -1.5, -1.5, -1.5, -1.5, 1.5, -1.5, -1.5, 1.5, 1.5, -1.5, 1.5, -1.5, 1.5, 1.5, -1.5, 1.5, 1.5, 1.5, 1.5, -1.5, 1.5, 1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, -1.5, 1.5]

        test.array(expected).match(result)

        b = new Box()
        e = b.create({ height: 3, depth: 1, updatable: false})
        result = e._geometry._vertexBuffers.position._data
        expected = [0.5, -1.5, 0.5, -0.5, -1.5, 0.5, -0.5, 1.5, 0.5, 0.5, 1.5, 0.5, 0.5, 1.5, -0.5, -0.5, 1.5, -0.5, -0.5, -1.5, -0.5, 0.5, -1.5, -0.5, 0.5, 1.5, -0.5, 0.5, -1.5, -0.5, 0.5, -1.5, 0.5, 0.5, 1.5, 0.5, -0.5, 1.5, 0.5, -0.5, -1.5, 0.5, -0.5, -1.5, -0.5, -0.5, 1.5, -0.5, -0.5, 1.5, 0.5, -0.5, 1.5, -0.5, 0.5, 1.5, -0.5, 0.5, 1.5, 0.5, 0.5, -1.5, 0.5, 0.5, -1.5, -0.5, -0.5, -1.5, -0.5, -0.5, -1.5, 0.5]

        test.array(expected).match(result)
    }
}


class MeshToolsTests {
    test_create_calls_make() {
        /* create function calls make function */
        test.classStaticMethodCalled(MeshTools, 'make', function(mock, Klass){
            mock.returns(new Box)
            Klass.create('box');
        })
    }
}

class ColorsTests {

    test_make_color(){
        /* Ensure the color.make function returns a BABYLON type */
        let c3 = colors.make(.5, .3, .1)
        test.value(c3.r).is(.5)
        test.value(c3.g).is(.3)
        test.value(c3.b).is(.1)
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
        test.value(r.r).is(.4)
        test.value(r.g).is(.3)
        test.value(r.b).is(.2)
    }

    test_hex(){
        /* can convert hex to Color3 */
        let r = colors.hex('#FF0000')
        test.value(r.r).is(1)
        test.value(r.g).is(0)
        test.value(r.b).is(0)

        r = colors.hex('#00FF00')
        test.value(r.r).is(0)
        test.value(r.g).is(1)
        test.value(r.b).is(0)
    }
}

Test.add(InstanceTests)
Test.add(BaseTests)
Test.add(BabylonBaseTests)
Test.add(ShapesTests)
Test.add(ChildManagerTests)
Test.add(MeshToolsTests)
Test.add(ColorsTests)

})(window)


