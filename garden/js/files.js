var assets = [
   'js/vendors/babylon.3-1.js'
   , 'js/vendors/it.js'

   , 'js/vendors/acorn/acorn.js'
   , 'js/vendors/acorn/acorn_loose.js'
   , 'js/tools/parser/code-parser.js'

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
