/*
The base application
 */
let defaultConfig = {
    sceneColor: 'green'
}

var SIZE = {
    // CSS map to full width height
    FULL: 'full'
}


class EngineMount extends RenderList {
    /* The garden applications hosts the interface and adaption to the
    rendering engine. A user may extend this explicitly
    however it'd be cleaner to use the exposed App class. */

    run(canvas_entity, config) {
        /* Run the engine performing mounting and running of the entity and
        the configuration. */
        if(this._mounted == false) {
            this.mount(canvas_entity, config)
        }

        console.log('EngineMount.run - Mounted and ran.')
    }

    mount(canvas_entity, config) {
        /* Create and start the canvas, engine and base scene for
        the internal rendering engine. */
        let [conf, canvas, engine, scene] = this.create(canvas_entity, config)
        log(`EngineMount.mount - Mount with ${Object.keys(conf)} on ${canvas.id}`)
        this._mounted = true
        this.$emit('mounted', { config: conf, canvas, engine, scene, parent: conf.owner})
        return this.mounted(conf, canvas, engine, scene);
    }

    create(canvas_entity, config){
        /* start a new application with the given config.
        the entity may be a string selector or canvas item.
        if one argument is given, config.element is used. */
        console.log('EngineMount.create', canvas_entity)
        config = Object.assign({}, defaultConfig, this.config,  config)

        if(canvas_entity == undefined) {
            canvas_entity = this.canvas
        }

        let canvas = this.bindCanvas(canvas_entity, config)
        let engine = this.createEngine(canvas)
        let scene = this.createScene(canvas, engine, config)

        return [config, canvas, engine, scene]
    }

    bindCanvas(entity, config){
        /* Alter the given canvas id or entity
        and return the HTML node prepared for engine use*/

        if(arguments.length == 1){
            config = entity;
            entity = config.element
        }

        if(it(entity).is('string')) {
            entity = document.getElementById(entity)
            if(entity == null) {
                entity = document.querySelector(name)
            }
        }


        if(entity == null) {
            console.warn('entity name cannot be found:', name)
            return undefined
        }

        if(config.size == SIZE.FULL){
            entity.classList.add('game-entity');
        } else if(config.size !== undefined) {
            entity.width = config.size[0]
            entity.height = config.size[1]
        };

        return entity
    }

    createEngine(canvas, engine){
        // Load the LIB 3D engine
        var engine = new LIB.Engine(canvas, true);

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
           engine.resize();
        });

        return engine;
    }

    createScene(canvas, engine, config){
        if(canvas == undefined){
            canvas = this.canvas;
        }

        var scene = new LIB.Scene(engine);
        scene.clearColor = this.sceneColor(config);
        return scene;
    }

    sceneColor(fromConfig){
        /* Return a colour used for the scene referencing
        this.data.config.sceneColor */
        var [r,g,b] = [.3,.3,.3] // this.data.config.sceneColor;
        let c;

        if(fromConfig != undefined) {
            c = colors.get(fromConfig.sceneColor || fromConfig)
        } else {
            c = new LIB.Color3(r,g,b);
        }
        return c
    }

    mounted(config, canvas, engine, scene) {
        /* The application engine, scene and canvas are setup and ready to use
        the interface has initialized to its idle state.
        */
        console.log('EngineMount.mounted')
        return this.startLoop(config, canvas, engine, scene)
    }

}
