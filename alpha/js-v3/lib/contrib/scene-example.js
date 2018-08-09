

s = new Scener(app)
// run a method; adding the item to the scen with default config
s.basicScene()
// Merge with given config
s.basicScene({})
// with app and config
s.basicScene(app, {})
// Setup a single string with default config
o = s.setup('basicScene')
// with config
o = s.setup('basicScene', {})

// with app
s.setup(app, 'basicScene')
s.setup(app, 'basicScene', {})

// As config objects
s.setup(app, { 'basicScene': {} }, {})


// array of strings with default config
s.setup(app, ['basicScene'])
// with exact config
s.setup(['basicScene'], { basicScene: {}, otherThing: {}})
// with group config; merged down with group config
s.setup(app, ['basicScene'], { basicScene: {}, otherThing: {}}, {})

// data matching array length
o = s.setup(app, ['basicScene'], [{}], {})

// A received object can be manipulated before addition to the scene
//
o.spotLight.position.y == -10
// Add the entire object to an app.
o.addTo(app)

/* an item configured may have a callback. after scene add
    addTo(scene)
Call the callback or call the default callback
call next() at the best time to continue to add to next step - you
can time you added elements until something else is added.

Return a function to be exectured on the next() call.
Provide your own to function to hook after last item is applied to the
scene. This is useful for after-all items appended actions.
*/
s.setup(app, ['basicScene'], { basicScene: {
    callback: function(data, next){

        next()
        return undefined
    }

}, otherThing: {
}}, {
    callback: function(data, next){
        let late = function() { next() }
        return late
    }
})


