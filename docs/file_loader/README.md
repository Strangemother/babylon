# File Loader

The live file loader implements a dynamic JS loading library to assist development and faster deployment.

In your main HTML file, add the `loader.js` file before your requirements.

```html
<script type="text/javascript" src='js-v2/lib/loader.js'></script>
<script type="text/javascript" src='js-v2/files.js'></script>
```

Within `files.js`, add the asser loader and your required JS files:

```js
var assets = [
   // Vendor require
   "js/babylon/dist/preview release/babylon.max.js"
   , "js/babylon/dist/preview release/cannon.js"
   , "js/babylon/dist/preview release/Oimo.js"
   , 'js/vendor/IT.js'

   // Lib
   , 'js-v2/lib/core/utils.js'
   , 'js-v2/lib/PrintLogger.js'
   , 'js-v3/lib/base.js'
   // App
   , 'js-v2/config.js'
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
```

The asset loader will live load the requirements in order. Once complete the application boots. You can utilize the loading patten using the `assetLoader`.

If you allow caching, The JS files are cached client-side within the localstorage. Next time the page loads, these assets are not loaded again. They are compiled from the clients local cache.

This will drastically reduce download size and speed up load times. Up to 5 meg is cached locally.

You can clear the cache by performing a `clear` or `disable`.

By providing an alternative config, you can load multiple versions of the application files for easy dev. It's a good idea to `disable` during developement as an alternative version of your server code may exist client-side.
