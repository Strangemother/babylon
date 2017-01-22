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
        ]
    }

    type(){
        return 'Box'
    }

    sizeKey() {
        return 100.0
    }

    babylonExecuted(mesh, name, options, scene,...args) {
        /* Will build keys written by key() ordered params.
        name, size, material, scene */
        let sky = new SkyMaterial()
        let mat = sky.create(options, scene)
        this._sky = sky
        this._skyMaterial = mat

        mesh.material = mat
        mesh.renderingGroupId = 0
        mesh.infiniteDistance = true
        console.log('Created sky', mesh.name, name)
        this._name = mesh.name;
        this._app.children.postModifiers.add('renderingGroupId', this.modifyRenderingGroupId.bind(this), true)
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
