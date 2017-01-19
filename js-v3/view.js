
window.colorView = new Vue({
    el: '.panel.colors'
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
    }
})
