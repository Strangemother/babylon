# SkyBox

Using a `SkyBox` class

```js
b = new SkyBox({assetName: 'mountains'});
mesh = b.addToScene();
```

With a `SkyMaterial`

```js
b = new SkyMaterial({assetName: 'mountains'})
box = new Box({ size: 100 })

mesh = box.addToScene()
mesh.material = b.create()
mesh.renderingGroupId = 0
mesh.infiniteDistance = true
```

Box and Cube material

```js
box = new Box({size: 100})
mesh = box.addToScene();

mat = materials.standard()
mat.backFaceCulling = false
mat.disableLighting = true
mat.diffuseColor = colors.black()
mat.specularColor = colors.black()
p = './assets/textures/CubeTexture/mountains/'
mat.reflectionTexture = new BABYLON.CubeTexture(p, app.scene())
mat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE

mesh.material = mat
mesh.renderingGroupId = 0
mesh.infiniteDistance = true
```
