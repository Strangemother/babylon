let js = '../alpha/js'
let v3 = `${js}-v3`

var assets = [
   // Vendor require
   `${js}/babylon-2-5.custom.js`
   // `${js}/babylon.2-6-light.js`
   , `${js}/vendor/IT.js`
   , `${js}/vendor/color.js`
   , `${v3}/vendor/vue.min.js`
   //, 'js-v2/vendor/jquery-3.1.1.min.js'
   // , 'js-v2/vendor/mocha/mocha.js'
   // , 'js-v2/vendor/unitjs/browser/dist/unit.js'

   , `${v3}/lib/2d/core.js`

   , `${v3}/lib/core/utils.js`
   //`, '${v3}/lib/tests.js`
   , `${v3}/lib/extras/PrintLogger.js`

   , `${v3}/lib/core/core.js`
   , `${v3}/lib/core/targetAssignment.js`
   , `${v3}/lib/core/interface.js`
   , `${v3}/lib/core/base.js`
   , `${v3}/lib/core/children.js`
   , `${v3}/lib/core/display.js`
   , `${v3}/lib/core/interface.js`
   , `${v3}/lib/core/adapter.js`
   , `${v3}/lib/Garden.js`

   , `${v3}/lib/core/liveProperties.js`

   , `${v3}/lib/mesh.js`
   , `${v3}/lib/babylon/colors.js`
   , `${v3}/lib/babylon/shapes.js`
   , `${v3}/lib/babylon/parametric-shapes.js`
   , `${v3}/lib/babylon/curves.js`
   , `${v3}/lib/babylon/lights.js`
   , `${v3}/lib/babylon/cameras.js`
   , `${v3}/lib/babylon/triggers.js`
   , `${v3}/lib/babylon/actions.js`
   , `${v3}/lib/babylon/controllers.js`

   , `${v3}/lib/extras/textures.js`
   , `${v3}/lib/extras/animators.js`
   , `${v3}/lib/extras/colors_extended.js`
   , `${v3}/lib/extras/scene_shapes.js`
   , `${v3}/lib/extras/fog.js`
   , `${v3}/lib/extras/particles.js`
   , `${v3}/lib/extras/particle-positions.js`
   , `${v3}/lib/extras/axis.js`
   , `${v3}/lib/extras/dev.js`
   , `${v3}/lib/extras/polygon.js`
   , `${v3}/lib/extras/patch.js`

   //` '${v3}/tests/test.js`

   , `${v3}/config.js`
   //` '${v3}/apps/app.js`
   // , `${v3}/apps/ribbon.js`
   // , `${v3}/apps/basic-scene.js`
   // , `${v3}/apps/basic-elements.js`
   // , `${v3}/apps/basic-app.js`
   // , `${v3}/apps/shape-columns.js`
   // , `${v3}/apps/particles.js`
   // , `${v3}/apps/animate-boxes.js`
   // , `${v3}/apps/axis.js`
   // , `${v3}/apps/curves-app.js`
   // , `${v3}/apps/simple.js`
   // , `${v3}/apps/texture.js`
   // , `${v3}/apps/gravity.js`
   // , `${v3}/apps/procedural-floor.js`
   // , `${v3}/apps/scaling.js`
   // , `${v3}/apps/2d.js`
   // , `${v3}/apps/polygons.js`
   // , `${v3}/apps/patchExample.js`
   // , `${v3}/apps/proc-play.js`
   // , `${v3}/apps/spotlight.js`
   // , `${v3}/apps/camera-vr.js`
   // , `${v3}/apps/forces-engines.js`

   // , `${v3}/main.js`
   // , `${v3}/vue-components/scrubber.js`
   // , `${v3}/view.js`
   // , `${v3}/view/class-reader.js`
];

assetLoader
   // Clear the cache
   .clear()
   .disable()
   // Some init config.
   .config({ bump: true, loadPath: './js-v2' })
   // Apply
   .assets(assets)
   // start: load(assets)
   .load()
   ;
