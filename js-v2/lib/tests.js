class Test {

    constructor(TestClass) {
        this.testClass = TestClass;
    }

    static get assertions(){
        return unitjs;
    }

    static add(TestClass) {
        if(Test.tests[TestClass.name] == undefined) {
            Test.tests[TestClass.name] = []
        };

        Test.tests[TestClass.name].push(TestClass);
    }

    static run(name) {
        this.runner = new Test.Runner(name);
        return this.runner.run()
    }

    static getMethodNames(TestClass) {
        return Object.getOwnPropertyNames(TestClass.prototype)
    }

    static getTestMethodNames(TestClass) {
        return Test.getMethodNames(TestClass).filter( (v) => v.startsWith('test_') )
    }

    getMethodNames() {
        return Test.getMethodNames(this.testClass)
    }


    getTestMethodNames() {
        return Test.getTestMethodNames(this.testClass)
    }

    getMethod(name) {
        return this._instance[name]
    }

    initiate(){
        return this._instance = new this.testClass
    }
}

Test.tests = {};
mocha.setup('bdd');

Test.Runner = class TestRunner {

    constructor(name) {
        this.name = name;
    }

    run(){

        let found = this.findTests(this.name);
        let created = this.createTests(found);
        let converted = this.convertTests(created);
        return this.runTests(converted)
    }

    findTests(name) {
        let r = []
        if(name) {
            r = Test.tests[name]
        } else {
            for(var n in Test.tests) {
                r = r.concat(Test.tests[n])
            }
        }
        return r
    }

    createTests(testList) {
        let r =[]
        for (var i = 0; i < testList.length; i++) {
            var test = new Test(testList[i]);
            r.push(test);
        };

        return r;
    }

    convertTests(testTestList) {

        if(document.getElementById('mocha') == null) {
            var d = document.createElement('div')
            d.id = 'mocha'
            document.body.appendChild(d)
        };

        var commentRegex = /\/\/(.*$)|\/\*([\W\S\n\r]*?)\*\//m;

        for (var i = 0; i < testTestList.length; i++) {
            var names = testTestList[i].getTestMethodNames();
            for (var j = 0; j < names.length; j++) {
                let n = this.name || this.constructor.name
                let s = `${n}::`;
                var testClass = testTestList[i].initiate()
                var func = testTestList[i].getMethod(names[j]);
                var match = commentRegex.exec(func.toString());
                var title = func.name;
                describe(s, function(){
                    title = title === undefined? names[j]: title;
                    if (match != null) {
                        let m = match[1] || match[2]
                        title = `${names[j]}::${m}`
                    }

                    it(title, func)

                })
            }
        }
    }

    runTests() {
        mocha.checkLeaks();
        mocha.globals(['INSTANCE', '_']);
        mocha.run();
    }
}

