# Fog

A `Fog` applies a distance fade to the scene. A Fog works like other Garden classes. Additional `on()`, `off()` functions exist

```js
fog = new Fog({ color: 'red' })
fog.addToScene()
```

turn a fog `off` and `on`. The values are reapplied to the scene.

```
fog.off()
fog.on()
```

Recalling the `on` with new optionals will update the existing options
```
fog.on({ density: .2 })
```
