
var colorView = new Vue({
    el: '.colors'
    , data: {
        colors: colors.names
        , colorStyle: {
            backgroundColor: 'red'
        }
        , lightContrastValue: 130
        , redMultiplier: 100
        , greenMultiplier: 587
        , blueMultiplier: 144
        , isOpen: false
        , isOpenControls: false
    }
    , methods: {
        toggleIsOpen() {
            this.isOpen = !this.isOpen
        }
        , contrastValue(name) {
            var c = colors.get(name)
            let [r,g,b] = [c.r, c.g, c.b].map(x => x * 255)
            var yiq = (
                    (r * this.redMultiplier)
                    + (g * this.greenMultiplier)
                    + (b * this.blueMultiplier)
                ) / 1000;
            return yiq;
        }

        , lightContrast: function(name){
            let yiq = this.contrastValue(name)
            return (yiq <= this.lightContrastValue) // ? 'dark' : 'light';
        }
        , hexColor: function(name){
            let v = colors.get(name);
            let hex = colors.rgbToHex.apply({}, [v.r, v.g, v.b])
            // this.colorStyle.backgroundColor = hex;
            return hex;
        }
        , sliderChange: function(event) {
            let k = event.currentTarget.dataset.multiplier;
            let v = event.currentTarget.value;
            this[k] = v;
            console.log('sliderchange', event, v)
        }
        , selectColor: function(color){
            console.log('selected color', color)
            if(developer
                && developer.selected
                && developer.selected.color) {
                developer.selected.color(color)
            }
        }
    }
})

var cleanAppsList = (items) => {
    var regex = /([A-Z])/mg;
    return items.splice(0).sort().map((x)=> [x , x.replace(regex, ' $1')])
}

var appsView = new Vue({
    el: '.panel.apps'
    , data: {
        apps: cleanAppsList(Garden.apps)
        , storageName: appViewStorageName
        , selected: (function(){
            let l = localStorage[appViewStorageName]
            let v = l || Garden.config().appName
            return v;
        })()
    }
    , watch: {
        selected(){
            //console.log('change Garden to', this.selected)
            localStorage[this.storageName] = this.selected;
            window.location.reload()
            //Garden.switch(this.selected)
        }
    }
})

var shapesView = (function(){
    let v = ['Shapes'].concat(Object.keys(Garden.instance().shapes))
    return new Vue({
        el: '.shapes'
        , data: {
            items: v
            , selected: 'Shapes'
        }
    })
})()

var classSelectView = (function(){
    let v = Object.keys(Garden.instance().named)
    return new Vue({
        el: '#garden-class-list'
        , data: {
            items: v
        }

        , methods: {
            submit(e){
                debugger
            }
        }
    })
})()

var classInputView = (function(){
    let v = Object.keys(Garden.instance().named)
    return new Vue({
        el: '#garden-class-input'
        , data: {
            items: v
        }

        , methods: {
            submit(e){
                let v = this.$el.value;
                if( this.items.indexOf(v) > -1 ) {
                    classView.itemName = v;
                }
            }
        }
    })
})()

var classView = (function(){

    return new Vue({
        el: '.class-content'
        , data: {
            //items: v
        }

        , watch: {
            itemName: {

                get: function(){
                    console.log('get itemName')
                }

                , set: function(){
                    console.log('set itemName')
                }
            }
        }

        , methods: {
            submit(e){
                let v = this.$el.value;
                if( this.items.indexOf(v) > -1 ) {
                    console.log('Show', v)
                }
            }
        }
    })
})()


var animatorView = new Vue({
    el: '.animator'
    , data: {
        value: 0
        , selectedId: undefined
        , animations: []
        , selectedData: {
            name: 'item Name'
            , type: 'type'
        }
    }

    , methods: {

        loadSelected: function(e){
            if(developer
                && developer.selected
                && developer.selected.color) {
                this.selected = developer.selected
                this.selectedId = this.selected.name || this.selected.id
            }

            console.log('selected', this.selectedId)
            if(this.selectedId) {
                this.renderItem(this.selected)
            }
        }

        , renderItem(item) {

            this.selectedData.name = item.id
            this.selectedData.type = item.constructor.name

            while(this.animations.length > 0) {
                this.animations.pop()
            }

            let anims = item._babylon.animations;
            let r = []
            for(let anim of anims) {
                this.animations.push(this.renderAnim(anim))
            }

            return r;
        }

        , renderAnim(anim) {

            return {
                name: anim.name
                , property: anim.targetProperty
                , keys: this.renderAnimKeys(anim.getKeys())
                , fps: anim.framePerSecond
                , highestFrame: anim.getHighestFrame()
                , easingFunction: anim.getEasingFunction()
            }
        }

        , renderAnimKeys(keys) {
            let r =[]

            for(let k of keys) {
                r.push({frame: k.frame, value: k.value})
            };

            return r;
        }
        , animStyle(key, anim) {
            let l = (100 / anim.highestFrame) * key.frame;
            return {
                percent: 1
                , left: `${l}%`
            }
        }
    }

})
