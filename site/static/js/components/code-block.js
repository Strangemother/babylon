Vue.component('code-block', {
    template: $('#code_block_template')/*.remove()*/.html()
    , data(){
        return {
            fileData: "{}"
        }
    }
    , props: {
        label: {
            type: String
            , required: false
            , default: undefined
        }

        , part: {
            type: [Number, String]
            , required: false
            , default: -1
        }
        , file: {
            type: String
            , required: true
        }
    }
    , mounted(){
        this.refresh()
    }

    , methods: {

        refresh(){
            let path = `${this.file}.js`
            $.get(path, function(data){
                this.loadedFile(path, data)
            }.bind(this))
        }

        , loadedFile(path, data) {
            if( parseInt(this.part) > -1) {
                this.fileData = this.getSplit(data, this.part)
            } else {
                this.fileData = data
            }

            this.$nextTick(function(){
                this.$refs["code-block"].innerHTML = this.fileData
                hljs.highlightBlock(this.$refs["code-block"]);
            }.bind(this))

            // $('pre code').each(function(i, block) {
            // });
        }

        , run(){
            let canvas = this.$refs['canvas']
            let body = `(function(){ ${this.fileData} }).apply(self)`
            let executor = new Function('canvasNode', body)
            executor(canvas)

            //debugger
            // s= new w.appClasses.SimpleBasicScene({canvas: $0}).run()
            // Garden.run({ canvas: $0 })

        }

        , getSplit(data, index) {
            var regex = /\/\/ # Part (\d)/i;
            let result = data.split(regex);
            let record = {}
            for (var i = 0; i < result.length; i++) {
                let value = result[i];
                if(value.length == 0) {
                    continue;
                }

                if( isNaN(parseInt(value))
                    && ( isNaN(parseInt(last)) == false) ) {
                    record[last] = value.trim();
                }

                last = value
            }
            if( index in record) {
                return record[index]
            }

            console.warn(`Could not find index "${index}" in record "${path}"`)
        }
    }
})
