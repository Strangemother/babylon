class SkyBox extends Box {

    keys(){
        return [
            'size'
            , 'material'
            , 'textureName'
        ]
    }

    type(){
        return 'Box'
    }

    propKeys(){
        return [
        ]
    }

    sizeKey() {
        return 100.0
    }

    textureNameKey(){
        let name = "assets/textures/skybox/1"
        return name;
    }

    materialKey(optionValue, options, scene) {
        scene = scene || this._app.scene()
        let mat = materials.standard(scene)
        // Group Texture

        let name = options.textureName || this.textureNameKey()
        mat.backFaceCulling = false
        mat.disableLighting = true
        mat.diffuseColor = colors.black()
        mat.specularColor = colors.black()
        mat.reflectionTexture = new BABYLON.CubeTexture(name, scene)
        mat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
        return mat
    }

    babylonExecuted(mesh, name, options, scene,...args) {
        /* Will build keys written by key() ordered params.
            name, size, material, scene */

        mesh.renderingGroupId = 0
        mesh.material = options.material
        mesh.infiniteDistance = true
        return mesh
    }
}

