class TestBase {

    constructor(TestClass) {
        this.testClass = TestClass;
    }

    static get assertions(){
        return unitjs;
    }

    static add(...TestClasses) {
        for(let TestClass of TestClasses) {
            if(Test.tests[TestClass.name] == undefined) {
                Test.tests[TestClass.name] = []
            };

            Test.tests[TestClass.name].push(TestClass);
        }
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

class Test extends TestBase {

    static createAssertion(func, name) {
        if(name == undefined) {
            name = func.name
        }

        unitjs[name] = func;

    }

    static classAssertion(cls, key) {

        let c = new cls()
        Test.createAssertion(c[key], key)
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
                let n = testTestList[i].testClass.name || this.name || this.constructor.name
                let s = `${n}:: class`;
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

                    before((function(testClass, title){
                        /* Anon function required here to ensure
                        the inner class keeps the relative class
                        rather than the newest to convertTests*/
                        return function(){
                            this.title = title;
                            this.instance = testClass
                        }
                    })(testClass, title))

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

class ClassTestAssertions {

    static add(...TestClasses) {
        let Cls = ClassTestAssertions
        for(let TestClass of TestClasses) {
            if(Cls._asserts[TestClass.name] == undefined) {
                Cls._asserts[TestClass.name] = []
            };

            Cls._asserts[TestClass.name].push(TestClass);

            Cls.implement(TestClass)
        }
    }

    static implement(TestClass) {
        let methods = this._ownMethods(TestClass);
        let key;

        for (var i = 0; i < methods.length; i++) {
            key = methods[i]
            if(key == 'constructor') continue;

            Test.classAssertion(TestClass, key)

        }
    }


    static _chainMethods(Cls){
        // ["length", "name", "prototype", "add", "implement", "_asserts"]
        return Object.getOwnPropertyNames(Object.getPrototypeOf(Cls))
    }

    static _ownMethods(Cls){
        // ["constructor", "classMethodCalled"]
        return Object.getOwnPropertyNames(Cls.prototype)
    }
}

ClassTestAssertions._asserts = {};

class IsClassAssertion extends ClassTestAssertions {

    classStaticMethodCalled(Cls, methodName, action, caller) {
        /* same as `classMethodCalled`, providing `useProto=false`
        to access to static method */
        return this.classMethodCalled(Cls, methodName, action, caller, false)
    }

    classMethodCalled(Cls, methodName, action, caller, useProto=true) {
        /* using the `mock` determine if a method was called when using
        a class. Provide the class, method name, an optional action function
        and an optional evoke caller function

        If the action is not defined, the default action creates a new instance
        of your class.

        The default caller expects the class method of `methodName` to be
        called once.

            // Test the 'init' method was called on new BaseClass
            classMethodCalled(BaseClass, 'init')

            // Test 'foo' method is called when performing `.something()`
            classMethodCalled(BaseClass, 'foo', function(mock, Klass){
                var cls = new Klass
                cls.something()
            })

        The mock function is setup, ran then destroyed once complete.
        */
        let _p = useProto ? Cls.prototype: Cls
        let _mock = Test.assertions.mock(_p)
        action = action || function(mock, Klass) {
            new Klass
        }

        caller = caller || function(mock, Klass){
            let _mock = mock.expects(methodName).once()
            action(_mock, Klass)
        }

        caller(_mock, Cls);

        _mock.verify()
    }
}

ClassTestAssertions.add(IsClassAssertion)
