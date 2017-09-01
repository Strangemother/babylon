var assets = [
   // Vendor require
   "js/babylon-2-5.custom.js"
   // "js/babylon.2-6-light.js"
   , 'js/vendor/IT.js'
   , 'js/vendor/color.js'
   , 'js-v3/vendor/vue.min.js'
   , 'js-v2/vendor/jquery-3.1.1.min.js'
   // , 'js-v2/vendor/mocha/mocha.js'
   // , 'js-v2/vendor/unitjs/browser/dist/unit.js'

   , 'js-v3/lib/2d/core.js'

   , 'js-v3/lib/core/utils.js'
   // , 'js-v3/lib/tests.js'
   , 'js-v3/lib/extras/PrintLogger.js'

   , 'js-v3/lib/core/core.js'
   , 'js-v3/lib/core/targetAssignment.js'
   , 'js-v3/lib/core/interface.js'
   , 'js-v3/lib/core/base.js'
   , 'js-v3/lib/core/children.js'
   , 'js-v3/lib/core/display.js'
   , 'js-v3/lib/core/interface.js'
   , 'js-v3/lib/core/adapter.js'
   , 'js-v3/lib/Garden.js'

   , 'js-v3/lib/core/liveProperties.js'

   , 'js-v3/lib/mesh.js'
   , 'js-v3/lib/babylon/colors.js'
   , 'js-v3/lib/babylon/shapes.js'
   , 'js-v3/lib/babylon/parametric-shapes.js'
   , 'js-v3/lib/babylon/curves.js'
   , 'js-v3/lib/babylon/lights.js'
   , 'js-v3/lib/babylon/cameras.js'
   , 'js-v3/lib/babylon/triggers.js'
   , 'js-v3/lib/babylon/actions.js'
   , 'js-v3/lib/babylon/controllers.js'

   , 'js-v3/lib/extras/textures.js'
   , 'js-v3/lib/extras/animators.js'
   , 'js-v3/lib/extras/colors_extended.js'
   , 'js-v3/lib/extras/scene_shapes.js'
   , 'js-v3/lib/extras/fog.js'
   , 'js-v3/lib/extras/particles.js'
   , 'js-v3/lib/extras/particle-positions.js'
   , 'js-v3/lib/extras/axis.js'
   , 'js-v3/lib/extras/dev.js'
   , 'js-v3/lib/extras/polygon.js'
   , 'js-v3/lib/extras/patch.js'

   //, 'js-v3/tests/test.js'

   , 'js-v3/config.js'
   //, 'js-v3/apps/app.js'
   , 'js-v3/apps/ribbon.js'
   , 'js-v3/apps/basic-scene.js'
   , 'js-v3/apps/basic-elements.js'
   , 'js-v3/apps/basic-app.js'
   , 'js-v3/apps/shape-columns.js'
   , 'js-v3/apps/particles.js'
   , 'js-v3/apps/animate-boxes.js'
   , 'js-v3/apps/axis.js'
   , 'js-v3/apps/curves-app.js'
   , 'js-v3/apps/simple.js'
   , 'js-v3/apps/texture.js'
   , 'js-v3/apps/gravity.js'
   , 'js-v3/apps/procedural-floor.js'
   , 'js-v3/apps/scaling.js'
   , 'js-v3/apps/2d.js'
   , 'js-v3/apps/polygons.js'
   , 'js-v3/apps/patchExample.js'
   , 'js-v3/apps/spotlight.js'

   , 'js-v3/main.js'
   , 'js-v3/vue-components/scrubber.js'
   , 'js-v3/view.js'
   , 'js-v3/view/class-reader.js'
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
