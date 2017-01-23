# Colors

The `colors` help create Babylon `Color3` and `Color4` BABYLON types. Basic colors are supplied. importing `extended_colors.js` will provide about 200 built-in colors

```js
colors.black()
colors.white()
colors.limeGreen()
colors.blueViolet()
// All standard web colors.
```

### colors.get(name)

You can use the `colors.get()` function, providing a color string:

```js
colors.get('green')
// Color4 {r: 0, g: 1, b: 0, a: 1}
```
The `get()` function accepts arrays to generate a new color on the fly. It will generate a `Color3` or `Color4` depending upon the given array length.

```js
colors.get([1,2,3])
// Color3 {r: 1, g: 2, b: 3}
colors.get([1,2,3, 4])
// Color4 {r: 1, g: 2, b: 3, a: 4}
```

If you provide a `Color3` or `Color4` to the `get()` function, it'll be passed back. You can ensure a color type by providing an optional `count` paramater to the `get()` function

```js
colors.get(colors.red(), 3)
Color3 {r: 1, g: 0, b: 0}
colors.get(colors.red(), 4)
Color4 {r: 1, g: 0, b: 0, a: 1}
```

Colors get converted up. a `Color3` will convert to a `Color4` unless specified:

```
colors.red()
// Color4 {r: 1, g: 0, b: 0, a: 1}

colors.red(3)
// Color3 {r: 1, g: 0, b: 0}

colors.get(colors.red(3))
// Color4 {r: 1, g: 0, b: 0, a: 1}

colors.get(colors.red(3), 3)
// Color3 {r: 1, g: 0, b: 0}

colors.get(colors.red(4), 3)
// Color3 {r: 1, g: 0, b: 0}
```

A color returns a `Color4` type. Provide a `count` as the first argument to your color to provide a specific `Color4` or `Color3`

```js
let lightBlue = colors.lightSteelBlue()
// Color4 {r: 0.690, g: 0.768, b: 0.870, a: 1}
let blue = colors.lightBlue(3)
// Color3 {r: 0.678, g: 0.847, b: 0.901}
```

### colors.make(r, g, b, a)

Create a new BABYLON colour.

```js
colors.make(1,1,1)
// Color3 {r: 1, g: 1, b: 1}

colors.make(.7, .4, .3, .6)
// Color4 {r: 0.7, g: 0.4, b: 0.3, a: 0.6}

colors.make([.7, .4, .3])
// Color3 {r: 0.7, g: 0.4, b: 0.3}

colors.make([.7, .4, .3, .7])
// Color4 {r: 0.7, g: 0.4, b: 0.3, a: 0.7}
```

