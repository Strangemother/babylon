var assets = [
   'js/vendors/lib.js'
   , 'js/vendors/it.js'

   , 'js/vendors/acorn/acorn.js'
   , 'js/vendors/acorn/acorn_loose.js'
   , 'js/tools/parser/code-parser.js'

   , 'js/app/DisplayObject.js'

   , 'js/app/base.js'
   , 'js/app/RenderLoop.js'
   , 'js/app/RenderList.js'
   , 'js/app/EngineMount.js'
   , 'js/app/Garden.js'


   , 'js/core/adapter.js'
   , 'js/core/Register.js'

   , 'js/display/colors.js'
   , 'js/display/colors_extended.js'
   , 'js/display/shapes.js'

   , 'js/examples/core.js'


];

assetLoader
   // Clear the cache
   .clear()
   .disable()
   // Some init config.
   .config({ bump: true, loadPath: './js' })
   // Apply
   .assets(assets)
   // start: load(assets)
   .load()
   ;
