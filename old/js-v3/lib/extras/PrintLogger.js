/* Laura Doktorova https://github.com/olado/doT */
;(function(){function p(b,a,d){return("string"===typeof a?a:a.toString()).replace(b.define||h,function(a,c,e,g){0===c.indexOf("def.")&&(c=c.substring(4));c in d||(":"===e?(b.defineParams&&g.replace(b.defineParams,function(a,b,l){d[c]={arg:b,text:l}}),c in d||(d[c]=g)):(new Function("def","def['"+c+"']="+g))(d));return""}).replace(b.use||h,function(a,c){b.useParams&&(c=c.replace(b.useParams,function(a,b,c,l){if(d[c]&&d[c].arg&&l)return a=(c+":"+l).replace(/'|\\/g,"_"),d.__exp=d.__exp||{},d.__exp[a]=
d[c].text.replace(new RegExp("(^|[^\\w$])"+d[c].arg+"([^\\w$])","g"),"$1"+l+"$2"),b+"def.__exp['"+a+"']"}));var e=(new Function("def","return "+c))(d);return e?p(b,e,d):e})}function k(b){return b.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var f={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0},m;f.encodeHTMLSource=function(b){var a={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},d=b?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(b){return b?
b.toString().replace(d,function(b){return a[b]||b}):""}};m=function(){return this||(0,eval)("this")}();"undefined"!==typeof module&&module.exports?module.exports=f:"function"===typeof define&&define.amd?define(function(){return f}):m.doT=f;var r={start:"'+(",end:")+'",startencode:"'+encodeHTML("},s={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},h=/$^/;f.template=function(b,a,d){a=a||f.templateSettings;var n=a.append?r:s,c,e=0,g;b=a.use||a.define?p(a,b,d||{}):b;b=("var out='"+(a.strip?
b.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):b).replace(/'|\\/g,"\\$&").replace(a.interpolate||h,function(b,a){return n.start+k(a)+n.end}).replace(a.encode||h,function(b,a){c=!0;return n.startencode+k(a)+n.end}).replace(a.conditional||h,function(b,a,c){return a?c?"';}else if("+k(c)+"){out+='":"';}else{out+='":c?"';if("+k(c)+"){out+='":"';}out+='"}).replace(a.iterate||h,function(b,a,c,d){if(!a)return"';} } out+='";e+=1;g=d||"i"+e;a=k(a);return"';var arr"+
e+"="+a+";if(arr"+e+"){var "+c+","+g+"=-1,l"+e+"=arr"+e+".length-1;while("+g+"<l"+e+"){"+c+"=arr"+e+"["+g+"+=1];out+='"}).replace(a.evaluate||h,function(a,b){return"';"+k(b)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,"");c&&(a.selfcontained||!m||m._encodeHTML||(m._encodeHTML=f.encodeHTMLSource(a.doNotSkipEncoded)),b="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+f.encodeHTMLSource.toString()+
"("+(a.doNotSkipEncoded||"")+"));"+b);try{return new Function(a.varname,b)}catch(q){throw"undefined"!==typeof console&&console.log("Could not create a template function: "+b),q;}};f.compile=function(b,a){return f.template(b,null,a)}})();

;function loremIpsum(min, max) {
    var loremIpsumWordBank = new Array("lorem","ipsum","dolor","sit","amet,","consectetur","adipisicing","elit,","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua.","enim","ad","minim","veniam,","quis","nostrud","exercitation","ullamco","laboris","nisi","ut","aliquip","ex","ea","commodo","consequat.","duis","aute","irure","dolor","in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla","pariatur.","excepteur","sint","occaecat","cupidatat","non","proident,","sunt","in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum.","sed","ut","perspiciatis,","unde","omnis","iste","natus","error","sit","voluptatem","accusantium","doloremque","laudantium,","totam","rem","aperiam","eaque","ipsa,","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt,","explicabo.","nemo","enim","ipsam","voluptatem,","quia","voluptas","sit,","aspernatur","aut","odit","aut","fugit,","sed","quia","consequuntur","magni","dolores","eos,","qui","ratione","voluptatem","sequi","nesciunt,","neque","porro","quisquam","est,","qui","dolorem","ipsum,","quia","dolor","sit,","amet,","consectetur,","adipisci","velit,","sed","quia","non","numquam","eius","modi","tempora","incidunt,","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem.","ut","enim","ad","minima","veniam,","quis","nostrum","exercitationem","ullam","corporis","suscipit","laboriosam,","nisi","ut","aliquid","ex","ea","commodi","consequatur?","quis","autem","vel","eum","iure","reprehenderit,","qui","in","ea","voluptate","velit","esse,","quam","nihil","molestiae","consequatur,","vel","illum,","qui","dolorem","eum","fugiat,","quo","voluptas","nulla","pariatur?","at","vero","eos","et","accusamus","et","iusto","odio","dignissimos","ducimus,","qui","blanditiis","praesentium","voluptatum","deleniti","atque","corrupti,","quos","dolores","et","quas","molestias","excepturi","sint,","obcaecati","cupiditate","non","provident,","similique","sunt","in","culpa,","qui","officia","deserunt","mollitia","animi,","id","est","laborum","et","dolorum","fuga.","harum","quidem","rerum","facilis","est","et","expedita","distinctio.","Nam","libero","tempore,","cum","soluta","nobis","est","eligendi","optio,","cumque","nihil","impedit,","quo","minus","id,","quod","maxime","placeat,","facere","possimus,","omnis","voluptas","assumenda","est,","omnis","dolor","repellendus.","temporibus","autem","quibusdam","aut","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet,","ut","et","voluptates","repudiandae","sint","molestiae","non","recusandae.","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus,","aut","reiciendis","voluptatibus","maiores","alias","consequatur","aut","perferendis","doloribus","asperiores","repellat");
    var minWordCount = min || 10;
    var maxWordCount = max || min;

    var randy = Math.floor(Math.random()*(maxWordCount - minWordCount)) + minWordCount;
    var ret = "";
    for(i = 0; i < randy; i++) {
        var newTxt = loremIpsumWordBank[Math.floor(Math.random() * (loremIpsumWordBank.length - 1))];
        if (ret.substring(ret.length-1,ret.length) == "." || ret.substring(ret.length-1,ret.length) == "?") {
            newTxt = newTxt.substring(0,1).toUpperCase() + newTxt.substring(1, newTxt.length);
        };

        ret += " " + newTxt;
    }
    return ret.substring(0,ret.length-1)
}

var stringCache = {}

/*
    var pl = nre PrintLogger('default')
    pl.add('Simple message')
    //=> spawns logger;
 */
// basic printer for logs.
class PrintLogger {

    constructor(name, consoler) {
        if(arguments.length == 1) {
            consoler=name;
            name = undefined;
        }

        this.name = name || 'default';
        this._nameMap = {};
        this._listMap = {};
        this._containerMap = {};
        this._containers = [];
        this._counts= {};
        this._viewCache = {};
        this._lastData = {};

        if(consoler == true) {
            return this._console()
        }
    }

    _console() {
        var v = function printLogger(){};

        v.create = this.create.bind(this);
        v.add = this.add.bind(this);
        v.logger = this
        v.log = this.consoleLog.bind(this)
        return v

    }

    create(data, name) {
        /* build all internal values to facilitate a logger.*/
        var _name = name || data.name || this.name;

        // Fetch the live node template
        this._template = this.getTemplate(_name, data);

        // Add to the UI
        var container = this.appendTemplate(this._template, _name, data);

        if(this._nameMap[_name] == undefined) this._nameMap[_name] = [];

        this._nameMap[_name].push(container.id);
        this._containers.push(container);
        this._containerMap[container.id] = container;
        this._viewCache[container.id] = []
        return container;
    }

    getTemplate(name){
        /* Return the template node from the UI or cache*/

        if(this._template) {
            return this._template;
        }

        var selector = `[data-logger=${name}]`;

        // Fetch main logger template for complete printer
        var $node = $(selector)[0];

        if($node == undefined) {
            $node = $('[data-logger]')[0]
        };

        return $node;
    }

    appendTemplate(template, name, data) {
        //  Apply this template item to the parent
        var container = {}
        // get parent to append to
        var parent = template.parentElement;

        // Clone the template
        var $node = template.cloneNode(true);

        // Create a new name for the render entity.
        $node.id = this.randomName();

        if($node.dataset.template !== undefined) {
            delete $node.dataset.template
        };
        // slice out data-list template.

        var listItems = $($node).find('[data-list]');
        var res = [];
        var self = this;
        var lists = [];

        if(this._listMap[name] == undefined) this._listMap[name] = [];

        listItems.each(function(){
            this.id = self.randomName();
            lists.push(this.id)
            self._listMap[name] = this.id // .push(this.id);
            res.push( [this.id, doT.template(this.innerHTML) ]);
            this.innerHTML = '';
        })

        var _c0 = this._containers[0];

        data.showIndex = (data.showIndex == undefined) ? (_c0 == undefined ? true: _c0.showIndex): data.showIndex
        data.showTime = (data.showTime == undefined) ? (_c0 == undefined ? true: _c0.showTime):  data.showTime
        // data.indexCheck = data.showIndex ? 'checked': ''
        // data.timeCheck = data.showTime ? 'checked': ''


        // Create template function based on mutated template
        var tempFn = doT.template($node.outerHTML);

        // Generate the inital rendered item
        if(data.name == undefined) data.name = name
        var $result = tempFn(data || {});

        stringCache[$node.id] = res;

        var _$child = $($result).appendTo(parent)
        // Return appender content.


        var container = {
            parent: parent
            , add: function(obj){
                self.add(obj, this)
            }
            , data: {}
            , historyLimit: 100
            , count: -1
            , name: name || 'default'
            , template: $node
            , id: $node.id
            , renderer: tempFn
            , result: $result
            , initData: data
            , scrollBottom: true
            , indexCheck: data.showIndex? '': 'hidden'
            , timeCheck:  data.showTime? '': 'hidden'
            ,showIndex: data.showIndex
            ,showTime: data.showTime
            , dateTimeFormatter: self.dateTimeFormatter
            , data: data.data || []
        }

        for (var i = 0; i < lists.length; i++) {
            this._containerMap[lists[i]] = container
        }

        _$child.find('input.lineo').on('change', function(){

            container.showIndex = $(this).prop('checked');

        }).attr('checked', data.showIndex);

        _$child.find('input.timestamp').on('change', function(){

            container.showTime = $(this).prop('checked');

        }).attr('checked', data.showTime);

        return container
    }

    dateTimeFormatter(d) {
        var _d = [ 'getHours'
        , 'getMinutes'
        , 'getSeconds'
        , 'getMilliseconds' ]

        var v = _d.map((a) => `${d[a]()}`)
        var _v = v;
        if(this._last) {

            _v = v.map((a,i) => this._last[i] == a? `<em>${a}</em>`: a)

        }
        this._last = v;
        let s = _v.join(':')
        return s;
    }

    randomName(){
        return Math.random().toString(32).slice(2, 10)
    }

    getContainer(name, template) {
        /* Return the container object - an entire Printer HTML object.*/

         selector = `[data-printlogger=${name}]`;
        // Find internal log item of logger template
        var $template = this.getElement(selector, $node)

        if($template == undefined) {
            // Create a new UI render.
            // Duplicate template,
            // append to parent
        }


        this._template = $template;
    }

    add(obj, container) {
        container = container || undefined
        var _container = this._containers[0];

        /* Add a statement to the logger; If a logger of the name does not exist
        a new logger will be created*/;


        // Get ui child template
        var templates = this.getChildTemplate(this._name, container);
        var name = obj.name || _container.name || this._container.name || 'default'
        var res = [];


        if(this._nameMap[name] == undefined) {
            console.warn('missing', name)
            _container = this.create(obj)
        } else {
            _container = this._containerMap[this._nameMap[name][0]]
        }

        let co = _container.data[_container.data.length - 1];
        if(obj.value == (co? co.value: undefined)) {
            var $e = _container._lastItem;
            var $ind = $e.find('.index')[0];
            var count = parseInt($ind.dataset.count)+1 || 1;
            $ind.dataset.count = count;
            $e.find('.index').text(count);
            var _cd = (_container ? _container: container).dateTimeFormatter(obj.time || (new Date))
            $e.find('.time').html( _cd )
            return
        };

        _container.data.push(obj);


        for (var i = 0; i < templates.length; i++) {
            var [parent, template] = templates[i];
             _container = container || _container;

            // TODO> Fix name propogratin
            if('name' in obj && name in this._listMap) {
                parent = this._listMap[name]
                _container = this._containerMap[parent]
            };

            var count = _container ? ++_container.count: 0
            this._counts[_container.id] = count
            if(count > _container.historyLimit) {
                var li = $(`#${parent}`).children().first().remove()
                let vi = this._viewCache[_container.id].push(li);


                // change history count
                var $elem = $(document.getElementById(_container.id));
                $elem.find('[data-history-bar]').removeClass('hidden')
                var $dataVals = $elem.find('[data-history-count]');

                $dataVals.text(vi);

            } else if(_container.scrollBottom) {
                let ul=$(`#${parent}`)[0];
                ul.scrollTop = ul.scrollHeight;
            };
            var d = obj.time || (new Date);
            // Generate the complete item
            obj.index = ((count === -1 || count === undefined)? (container.data.length): count)
            obj.index1 = obj.index + 1;
            obj.time = _container.dateTimeFormatter? _container.dateTimeFormatter(d):d;
            obj.value = obj.value || ('No value')
            obj.indexCheck = obj.indexCheck || _container.showIndex? '': 'hidden'
            obj.timeCheck = obj.timeCheck || _container.showTime? '': 'hidden'
            obj.name = obj.name || _container.name
            obj.info = obj.info || ''
            var $result = template(obj);
            // Add to the UI
            res.push([$result, parent]);

            _container._lastItem = $($result).appendTo(`#${parent}`)

        };

        var _id = _container.id;
        var $elem = document.getElementById(_id);

        var $dataVals = $($elem).find('[data-count]');
        $dataVals.text(this._counts[_id] + 1);

        // debugger;
        // <span data-count></span>

        return res;
    }

    getChildTemplate(name, container) {
        name = name || this.name;
        var template = stringCache[(container || this._containers[0]).id]
        return template
    }

    append($result, container) {

        // Append the new printout logger to the parent.
        container = container || (this._containers[0] ? this._containers[0].parent: undefined)
        if(container) {
            container.innerHTML += $result;
        }
    }

    consoleLog(...args) {
        return this.add({
            value: args
        })
    }
}

