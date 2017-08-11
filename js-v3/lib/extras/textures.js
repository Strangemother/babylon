textures = {};
textures.DIFFUSE = 'diffuseTexture'
textures.EMISSIVE = 'emissiveTexture'


textTexture = function(text,color='white',  size=2, font="bold 36px Arial"){

    let scene = app.scene()

    var textPlane = function(text, color, size, font) {
        var texture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        texture.hasAlpha = true;
        texture.drawText(text, 5, 40, font, color , "transparent", true);

        var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = materials.standard()
        plane.material.backFaceCulling = false;
        plane.material.specularColor = colors.white()
        plane.material.diffuseTexture = texture;
        return plane;
    };

    return textPlane(text, color, size, font)
}


class Texture extends BabylonObject {
    static assignmentName(item) {
        return 'textures'
    }

    keys(){
        return [
            'assetName'
            , 'assetPath'
        ]
    }

    assetPathKey(){
        return "./assets/textures/"
    }

    assetNameKey(ov){
        return ov || undefined
    }

    makePath(n, p){
        if(n == undefined) return p;
        return `${p}${n}`
    }

    executeBabylon(babylonFunc, funcName, uniqueName, assetName, assetPath, scene, ...args) {
        let p = this.makePath(assetName, assetPath)
        return new babylonFunc[funcName](p, scene);
    }

    asMaterial(options, scene, type){
        /*
        s = new Sphere;
        m = s.create({ position: [0, 1, 0]});
        t = new Texture;
        tm = t.asMaterial({ assetName: '1.jpg' })
        m.material = tm
         */
        options = options || this._options || {}
        scene = scene || options.scene || this._app.scene();
        type = type == undefined? textures.DIFFUSE: type;

        let mat = this.makeMaterial(options, scene, type);

        if(options.scene) {
            delete options.scene
        };

        mat[type] = this.create(options, scene, false);
        return mat
    }

    makeMaterial(options, scene, type=textures.EMISSIVE) {
        let mat = materials.standard(scene);
        return mat;
    }

    addToMesh(mesh, config, scene) {
        let mat = this.asMaterial(config, scene)
        mesh.material = mat
        return mat
    }

}

class SkyMaterial extends Texture {
    /*
        b = new SkyMaterial({assetName: 'mountains'})
        box = new Box({ size: 100 })
        mesh = box.addToScene()
        mesh.material = c

     */
    babylonFuncName(){
        return 'CubeTexture'
    }

    texturePathKey(optionValue, options, scene){
        let pn = this.babylonFuncName()
        let bp = this.getTextureBasePath()
        return `${bp}${pn}/`
    }

    babylonExecuted(texture, name, assetName, assetPath, scene, ...args) {

        let mat = materials.standard()
        mat.backFaceCulling = false
        mat.disableLighting = true
        mat.diffuseColor = colors.black()
        mat.specularColor = colors.black()

        let p = this.makePath(assetName, assetPath)

        mat.reflectionTexture = texture
        mat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE

        return mat
    }

    makePath(n, p){
        n = n || this._options.assetName
        p = p || this._options.assetPath
        let pn = this.babylonFuncName()
        p = p || this.assetPathKey()
        return `${p}${pn}/${n}/`
    }

}

Garden.register(Texture)
