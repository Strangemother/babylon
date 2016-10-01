class ObjectsBase extends CoreClass {
}


class ObjectsRender extends GameSceneObject {

    init(level, gameScene) {
        var name = 'objects'
        super.init(name);
        this.level = level;
        this.gameScene = gameScene;
    }

    create(scene, definition, name){
        var obj = this[definition.type](scene, name, definition);
        return obj;
    }

    render(scene, definition, name) {
        /* Given an object, use the definition to produce a Babylon
        component using the internal methods. */
        if(arguments.length == 2) {
            // def, name;
            name = definition;
            definition = scene;
            scene = definition.scene || this.scene
        }
        var _ignore = [];

        var obj = this.create(scene, definition, name);
        if(obj != undefined){
            _ignore.push('type');
        };

        return this._render(scene, definition, obj, _ignore);
    }

    instanceRender(scene, instanceMesh, item) {
        /* given in instance of an object (i.e. box), perform color
        rendering as these items are not inherited. */
        return this._render(scene, item, instanceMesh, ['type']);
    }

    _render(scene, definition, obj, _ignore){
        // console.log('Rendering instance', definition)
        for(var key in definition) {
            var n = `_render_${key}`
            if(_ignore.indexOf(key) > -1) {
                continue;
            };
            var args = [].slice.apply(definition[key], [0]);
            args.unshift(scene, obj);
            if(this[n] != undefined) {
                this[n].apply(this, args);
            }

        }
        return obj;
    }

    static add(klass) {
        var [name, func] = klass.functionCaller();
        // meshCacheObject
        _ObjectsMeshes[name] = { klass, func, name };
    }

    objectMeshCaller(meshCacheObject, name) {
        var self = this;
        return (function(){
            var o   = this.meshCacheObject
                , n = this.name
                , p = this.self
                ;

            return function(scene, name, config) {

                if(scene == undefined) {
                    scene = p.gameScene._scene;
                };

                return o.func(scene, name, config);
            }

        }).apply({ meshCacheObject, name, self})
    }
}

var _ObjectsMeshes = {};

class ObjectsMesh extends ObjectsRender {

    _simpleMeshCall(scene, name, config, creatorFunc) {
        // Generate a _simple_ object, requiring a config call, returning
        // a creator function, name and conf.
        //
        // The func will be called with the [name config scene] in order -
        // in repect to BABYLON.MeshBuilder.CreateBox

        var [scene, func, n, conf] = this._conf(scene, name, config, creatorFunc);

        // Call the creator function returned from the config function
        var object = func(n, conf, scene);
        // Return the value generated from the creator function
        return object;
    }

    _conf(scene, name, config, creatorFunc) {
        /* return a configuration object for the bablyon object creation
        .
        (scene, name)
        (scene, {config})
        (scene, name, {config})
        */


        var _name = name
            , _config = config
            ;

        if( it(name).is('object')
            && config == undefined ) {
            // scene, config
            _conf = name;
            // Provide name
            _name = _conf.name;
            if(_conf.name !== undefined) {
                delete _conf.name;
            }
        } else if(it(name).is('string')) {
            // scene name [config]
        }
        if(_config == undefined) {
            _config = 1;
        }
         if(_name == undefined) {
            _name = 'object1'
         }

         if(scene == undefined) {
            scene = this.gameScene._scene;
         }

        var cf = creatorFunc || this[`_conf_${type}`];
        var [creator, defaults] = cf != undefined ? cf(scene, _name, _config): {}
        _config = Object.assign(defaults, _config)
        return [scene, creator, _name, _config]
    }

    _baseCreator(type) {
        var f = (function(type){
            return function(scene, name, config){
                return [type, {}]
            }
        }).apply({}, [type]);
        return f;
    }
}


class Objects extends ObjectsMesh {

    box(scene, name, config){
        /* Build a box, providing scene, name and config.
        config is optional. */

        //var [n, conf] = this._conf(scene, 'box', name, config);
        // var object = BABYLON.MeshBuilder.CreateBox(n, conf, scene);

        var object = this._simpleMeshCall(scene, name, config, this._boxConfig)
        return object;
    }

    sphere(scene, name, config) {
        var babylon = this._sphereConfig || this._baseCreator(BABYLON.MeshBuilder.CreateSphere);
        var object = this._simpleMeshCall(scene, name, config, babylon)
        return object
    }


    _sphereConfig(scene, name, config) {
        return [BABYLON.MeshBuilder.CreateSphere, {
            diameter: 2
        }]
    }

    _boxConfig(scene, name, config) {
        /* required values for a box configuration */

        return  [BABYLON.MeshBuilder.CreateBox, {
            size: 1
            , sideOrientation: BABYLON.Mesh.FRONTSIDE
            , updatable: false
        }];
    }

    _render_color(scene, object, color) {
        var material            = new BABYLON.StandardMaterial("White", scene);
        material.diffuseColor   = new BABYLON.Color3(.7,.7,.7);
        try {
            object.material = material
            console.log('colored')
        } catch(e){
            if(e instanceof TypeError){
                // debugger;
            }
        }

        return this;
    }

    _render_edge(scene, object, width, color) {
        // console.log('edging');

        object.edgesWidth = width || 4.0;
        object.edgesColor = color || new BABYLON.Color4(1, 1, 1, 1);
        object.enableEdgesRendering();

        if(object.convertToFlatShadedMesh !== undefined){
            console.log('converted mesh')
            object.convertToFlatShadedMesh();
        } else {
            // debugger;
        }

        return this;
    }
}

var objectProxy = function(obj, getFunction){
    var f = getFunction || function(target, name) {
        if(name in target) {
            return target[name]
        }

        if(name in _ObjectsMeshes) {
            var o = _ObjectsMeshes[name]
            return target.objectMeshCaller(o, name)
        }
    };

    var handler = {
        get: f
    }

    var p = new Proxy(obj, handler);

    return p;
}
