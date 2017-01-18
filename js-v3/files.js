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

   , 'js-v3/lib/PrintLogger.js'
   // App
   , 'js-v3/config.js'
   , 'js-v3/lib/base.js'
   , 'js-v3/lib/adapter.js'
   , 'js-v3/lib/core/liveProperties.js'
   , 'js-v3/lib/mesh.js'
   , 'js-v3/lib/colors.js'
   , 'js-v3/lib/colors_extended.js'
   , 'js-v3/lib/shapes.js'
   , 'js-v3/lib/lights.js'
   , 'js-v3/lib/cameras.js'
   , 'js-v3/lib/triggers.js'
   , 'js-v3/lib/actions.js'

   , 'js-v3/tests/test.js'
   , 'js-v3/main.js'
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
