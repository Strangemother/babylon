var assets = [
   // Vendor require
   "js/babylon/dist/preview release/babylon.max.js"
   , "js/babylon/dist/preview release/cannon.js"
   , "js/babylon/dist/preview release/Oimo.js"
   , 'js/vendor/IT.js'

   // Lib
   , 'js-v2/lib/core/utils.js'

   , 'js-v2/lib/core/BaseClass.js'
   , 'js-v2/lib/objects.mutators.js'
   , 'js-v2/lib/BabylonInterface.js'
   , 'js-v2/lib/AppInterface.js'

   , 'js/lib/materials.js'

   , 'js-v2/lib/objects/BabylonMesh.js'

   , 'js-v2/vendor/mocha/mocha.js'
   , 'js-v2/vendor/unitjs/browser/dist/unit.js'
   , 'js-v2/lib/tests.js'

   , 'js-v2/tests/InstanceTests.js'

   // App
   , 'js-v2/config.js'
   , 'js-v2/main.js'
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
