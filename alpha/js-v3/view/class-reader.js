/* vue application to read classes and their content for easier
navigation of the API,*/

function getAllMethodNames(obj) {
  let methods = new Set();
  while (obj = Reflect.getPrototypeOf(obj)) {
    let keys = Reflect.ownKeys(obj)
    keys.forEach((k) => methods.add(k));
  }
  return methods;
}

let clApp = new Vue({
    el: '#class_reader'
    , data: {
        classes: Object.keys(Garden.instance().named)
        , loaded: {
            classChain:[]
            , methodNames: []
            , keys: []
        }
    }

    , methods: {
        loadItem() {
            let name = this.$refs.selected.value

            let gi = Garden.instance().named[name];
            // copy the class chain
            this.loaded.classChain = gi.classChain().slice()
            this.loaded.methodNames = this.methodNames(gi)
            this.loaded.name = gi.name
            this.loaded.keys = (new gi).keys()

        }

        , methodNames(gi){
            let r = []
            for(let item of getAllMethodNames(gi.prototype)){
                r.push(item)
            }
            return r
        }

        , sorted(items) {
            return items.slice().sort(function(a, b) {
                if(a>b) return 1;
                if(a<b) return -1;

                return 0
            })
        }
    }
})
