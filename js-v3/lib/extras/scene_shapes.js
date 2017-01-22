class SkyBox extends Box {
    /*
        s = new SkyBox()
        s.addToScene()

        b = new SkyBox({assetName: 'mountains'})
        mesh = b.addToScene();
     */

    keys(){
        return [
            'size'
            , 'assetName'
            , 'assetPath'
            , 'lightColor'
        ]
    }

    type(){
        return 'Box'
    }

    sizeKey() {
        return 100.0
    }

    lightColorKey(optionValue){
        return optionValue || colors.white()
    }

    babylonExecuted(mesh, name, options, scene,...args) {
        /* Will build keys written by key() ordered params.
        name, size, material, scene */
        let app = this._app;
        let children = app.children;

        let skyLight = new app.lights.HemisphericLight({color: options.lightColor });
        this.light = skyLight;
        this.lightMesh = children.add(skyLight)
        //skyLight.color()

        let sky = new SkyMaterial()
        let mat = sky.create(options, scene)
        this._sky = sky
        this._skyMaterial = mat

        mesh.material = mat
        mesh.renderingGroupId = 0
        mesh.infiniteDistance = true
        console.log('Created sky', mesh.name, name)
        this._name = mesh.name;

        children.postModifiers.add('renderingGroupId', this.modifyRenderingGroupId.bind(this), true)
        return mesh
    }

    modifyRenderingGroupId(entity, options, ...args) {
        if(entity.name == this._name) {
            return null;
        };

        if(entity.renderingGroupId == 0) {
            entity.renderingGroupId = 1
        }
    }

}
