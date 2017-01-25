var assets = [
   // Vendor require
   "js/babylon-2-5.custom.js"
   , 'js/vendor/IT.js'
   , 'js/vendor/color.js'
   , 'js-v3/vendor/vue.min.js'
   , 'js-v2/vendor/jquery-3.1.1.min.js'
   , 'js-v2/vendor/mocha/mocha.js'
   , 'js-v2/vendor/unitjs/browser/dist/unit.js'


   , 'js-v3/lib/core/utils.js'
   , 'js-v3/lib/tests.js'
   , 'js-v3/lib/extras/PrintLogger.js'

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
   , 'js-v3/lib/babylon/lights.js'
   , 'js-v3/lib/babylon/cameras.js'
   , 'js-v3/lib/babylon/triggers.js'
   , 'js-v3/lib/babylon/actions.js'

   , 'js-v3/lib/extras/textures.js'
   , 'js-v3/lib/extras/animators.js'
   , 'js-v3/lib/extras/colors_extended.js'
   , 'js-v3/lib/extras/scene_shapes.js'
   , 'js-v3/lib/extras/fog.js'
   , 'js-v3/tests/test.js'

   , 'js-v3/config.js'
   , 'js-v3/app.js'
   , 'js-v3/app_animateboxes.js'
   , 'js-v3/main.js'
   , 'js-v3/view.js'
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
