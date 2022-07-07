let should = require('should');

let Graph = require('../src/index').Graph;

describe('Edge test', function(){
    describe('addE test', function(){
        it('addE(label, vertex)', function(){
            let g = new Graph();
            let bill = g.addV("", "person", "name", "bill").next();
            g.addV("","person", "name", "rose").addE("friends", bill);
            g.V().hasValue("rose").out("friends").count().should.equal(1);
        })
        it('addE(label, targetVertex, ...props)', function(){
            let g = new Graph();
            let bill = g.addV("", "person", "name", "bill").next();
            g.addV("","person", "name", "rose").addE("friends", bill, "aaa", 33);
            g.V().hasValue("rose").out("friends").count().should.equal(1);
            g.E().hasValue(33).count().should.equal(1);            
        })
        it('addE(label).to(vertex)', function(){
            let g = new Graph();
            let bill = g.addV("", "person", "name", "bill").next();
            g.addV("","person", "name", "rose").addE("friends").to(bill);
            g.V().hasValue("rose").out("friends").count().should.equal(1);
        })
    })




})


