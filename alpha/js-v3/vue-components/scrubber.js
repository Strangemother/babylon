
Vue.component('scrubber', {
    template: `
<div class="timeline">

    <label>
        <slot name='label'><slot></slot></slot>
    </label>

    <span class="tiny label min">{{ min }}</span>

    <div class="scrubber-container secondary-low"
        v-on:mouseover='scrubberContainerOver'
        v-on:mouseup='scrubberContainerUp'
        v-on:mousedown='scrubberContainerDown'>
        <div class="scrubber primary"
            v-on:mousedown='scrubberDown'
            v-on:mouseup='scrubberUp'
            v-bind:class='{ selected: scrubberSelected }'
            v-bind:style="{ left: scrubberLeft }">{{ scrubberText }}</div>
    </div>

    <span class="tiny label max" v-model='value' contenteditable="true">{{ max }}</span>
</div>
`
    , props: {
        value: Number
    }

    , data: function() {

        return {
            min: 0
            , max: 100
            , scrubberLeft: '10px'
            , scrubberSelected: false
            , delta: 0
            , value: 0
            , selectedId: undefined
            , animations: []
            , scrubberText: '-'
        }
    }
    , watch: {
        value: function(ov, nv){
            //console.log('value', arguments)
        }
    }
    , computed: {
        value: {
            get: function(){
                return this.delta
            }
            , set: function(nv) {
                console.log('computed', nv)
            }
        }
    }
    , methods: {
        getContainer: function(){
            return $(this.$el).find('.scrubber-container')
        }

        , getScrubber: function(){
            return $(this.$el).find('.scrubber')

        }

        , positionScubberPX: function(px) {
            let w = this.getContainer().width() - this.getScrubber().width()
            let p = (this.max / w) * px;
            if(p<0)p=0;
            if(p>this.max)p=this.max;
            this.setValue(p)
        }

        , setValue: function(percent) {
            this.delta = Number(percent.toFixed(4))
            this.value = Math.round(percent)
            this.positionScubber(percent)
        }

        , positionScubber: function(percent){
            let w = this.getContainer().width() - this.getScrubber().width()
            let v = (w / this.max) * percent
            if(v<0)v=0;
            if(v>w)v=w;
            this.scrubberLeft = `${v}px`
            this.scrubberText = v.toFixed(0)
        }
        , scrubberContainerOver: function(e){
            console.log('scrubberContainerOver')
        }

        , scrubberContainerDown: function(e){
            console.log('scrubberContainerDown')
            let p = this.getScrubber().width()
            console.log('scrubberContainerUp', p)
            if(this.getContainer().is(e.target)) {
                this.positionScubberPX(e.offsetX - p*.5)
            }
        }

        , scrubberContainerUp: function(e){
        }

        , scrubberDown: function(e){
            this.scrubberSelected = true
            $('body').on('mousemove', this.mousemoveLock)
            this.x = this.getContainer().offset().left + e.offsetX
            var self = this;
            var mouseup = function(e){
                $('body').off('mousemove', self.mousemoveLock)
                $('body').off('mouseup', mouseup)
                self.scrubberUp(e)
            };
            $('body').on('mouseup', mouseup)
        }

        , mousemoveLock: function(e){
            this.deltaX = e.clientX;
            e.preventDefault()
            let m = this.x - this.deltaX
            this.positionScubberPX(-m)
        }

        , scrubberUp: function(e){
            this.scrubberSelected = false;
            console.log('scrubberUp', this.delta)
        }

    }
})


Vue.component('pointer-keys', {
    _template: `<div class='pointer-keys'>

         <div class="renderline">
            <div class="pointers secondary-low">
                <span class="pointer static">{{ anim.keys.length }}</span>
                <span
                    v-bind:class='[pointerClasses]'
                    v-bind:style="animStyle(key, anim)"
                    v-for='key in anim.keys'>+</span>
            </div>

        </div>
    </div>
    `
    , template: `<div class='pointer-keys'>
       <div class="renderline">
          <div class="pointers secondary-low">
             <span class="pointer static">{{ anim.keys.length }}</span>
             <span
                v-bind:class='[pointerClasses]'
                v-bind:style="animStyle(value, anim)"
                v-for='(value, key, index) in anim.keys'>
                   <div class="pointer-content">
                      <div class="pointer-visible">+</div>
                      <div class="pointer-tip">
                         <div class="row" v-for='(pointValueName, pointValue) in value'>
                            <span class="label">{{ pointValue }}</span>
                            <span class="value">{{ pointValueName }}</span>
                         </div>
                      </div>
                   </div>
             </span>
          </div>
      </div>
    </div>`
    , props: ['anim']
    , data: function(){

        return {
            pointerClasses: 'pointer spot'
        };

    }

    , methods:{

        animStyle(key, anim) {
            let l = (100 / anim.highestFrame) * key.frame;
            return {
                percent: 1
                , left: `${l}%`
            }
        }

    }
})
