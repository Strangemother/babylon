Vue.component('markdown', {
    template: $('#markdown-template').html()
    , data(){
        return {
            fileData: "{}"
            , renderText: ''
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
        let path = `${this.file}.md`
        $.get(path, function(data){
            this.loadedFile(path, data)
        }.bind(this))
    }

    , methods: {
        loadedFile(path, data) {
            if( parseInt(this.part) > -1) {
                this.fileData = this.getSplit(data, this.part)
            } else {
                this.fileData = data
            }

            this.renderMardown()


            // $('pre code').each(function(i, block) {
            // });
        }

        , renderMardown() {
            this.renderText = marked(this.fileData);
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
