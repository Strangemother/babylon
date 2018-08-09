class TargetObjectAssignmentRegister extends BaseClass {

    static make(type, options) {
        /* Genetate an instance*/

        if(arguments.length <= 1) {
            options = type;
            type = undefined;
        };

        // Options or default options
        options = options || {};
        // Given type or the options.type or DEFAULT
        type = (type || options.type).toLowerCase()

        if(options._type) {
            delete options.type;
        };

        let named = this.assignmentName()
        let location = Garden.instance()[named] || {};
        let item = location[type].make(location[type], options);
        Garden.instance()[named] = location
        return item;
    }

    static create(type, options, scene) {
        let item = this.make(type, options);
        // The given scene or the options scene
        scene = scene || (options != undefined? options.scene: undefined)

        if(scene == undefined) {
            let engine, canvas;
            [scene, engine, canvas] = item._app.babylonSet;
        };

        // Create new mesh
        let mesh = item.create(scene);
        // Add to display list.
        item._app.children.append(item, mesh, options)
        return item;
    }

    static register(...items){
        // let named = Garden.assignmentName();
        let _instance = Garden.instance();
        /* Register a component for later creation via MeshTool.make and .create*/
        let location = {};
        let name, camelName, aName, inst, instName

        for(let item of items) {
            inst = item.assignmentReference ? item.assignmentReference(item): item;
            aName = item.assignmentName ? item.assignmentName(item): 'named';
            location = _instance[aName] || location;
            name = item.name.toLowerCase();
            instName = inst.name || name;
            camelName = `${name.slice(0,1).toLowerCase()}${name.slice(1)}`

            if(location[instName] != undefined) {
                console.warn('Overwriting', instName, 'on', location)
            }

            location[instName] = inst;
            console.log('Registering', instName)
            if(item.targetObjectAssignment) {
                let n = item.targetObjectAssignment(inst, _instance)
                if(n != null) {

                    if(n === undefined) {
                        console.warn('targetObjectAssignment name was undefined for', inst);
                    }

                    if(_instance[n] == undefined) {
                        _instance[n] = {}
                    };

                    _instance[n][instName] = inst;
                }
            }

            _instance[aName] = location
        };
    }

    static assignmentName(){
        return 'named'
    }
}

