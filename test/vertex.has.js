let should = require('should');

let Graph = require('../src/index').Graph;
let gt = require('../src/index').gt;

describe('Vertex has test', function(){
    // init data;
    let g = new Graph();
    g.addV("","student","name","bob", "gender","boy","age",10,"grade","P3");
    g.addV("","student","name","mark", "gender","boy","age",11,"grade","P3");
    g.addV("","student","name","alice", "gender","girl","age",9,"grade","P2");
    g.addV("","student","name","anna", "gender","girl","age",10,"grade","P3");
    g.addV("","teacher","name","grace", "gender","girl","age",30);
    g.addV("","teacher","name","rain", "gender","boy","age",40);
    
    describe('has(...args) test', function(){
        it('has(key)', function(){
            g.V().has("grade").count().should.equal(4);
        })
        it('has(key, value)', function(){
            g.V().has("grade", "P3").count().should.equal(3);
        })
        it('has(key, predicate)', function(){
            g.V().has("age", gt(10)).count().should.equal(3);
        })
        it('has(label, key, value)', function(){
            g.V().has("student","gender","girl").count().should.equal(2);
        })

    })
    describe('hasId(...ids) test', function(){
        it('hasId(-1)', function(){
            let id1 = -1;
            g.V().hasId(id1).count().should.equal(0);
        })
        it('hasId(id)', function(){
            let id3 = g.V().next()[2].id;
            g.V().hasId(id3).count().should.equal(1);
        })
        it('hasId(id1, id2)', function(){
            let id1 = g.V().next()[0].id;
            let id3 = g.V().next()[2].id;
            g.V().hasId(id1, id3).next().length.should.equal(2);
        })
    })
    describe('hasLabel(...labels) test', function(){
        it('hasLabel(label)', function(){
            g.V().hasLabel("student").count().should.equal(4);
        })
        it('hasLabel(label1, label2)', function(){
            g.V().hasLabel("student","teacher").count().should.equal(6);
        })
    })
    describe('hasKey(...keys) test', function(){
        it('hasKey(key)', function(){
            g.V().hasKey("age").count().should.equal(6);
        })
        it('hasKey(key1, key2)', function(){
            g.V().hasKey("age","grade").count().should.equal(4);
        })

    })
    describe('hasValue(...values) test', function(){
        it('hasValue(key)', function(){
            g.V().hasValue("girl").count().should.equal(3);
        })
        it('hasValue(key1, key2)', function(){
            g.V().hasValue("girl","P3").count().should.equal(1);
        })
    })
    describe('hasNot(key) test', function(){
        it('', function(){
            g.V().hasNot("grade").count().should.equal(2);
        })
    })
})


