let should = require('should');

let Graph = require('../src/index').Graph;
let label = require('../src/index').label;

describe('group test', function(){
    let g = new Graph();
    g.addV("","student","name","bob", "gender","boy","age",10,"grade","P3");
    g.addV("","student","name","mark", "gender","boy","age",11,"grade","P3");
    g.addV("","student","name","alice", "gender","girl","age",9,"grade","P2");
    g.addV("","student","name","anna", "gender","girl","age",10,"grade","P3");
    g.addV("","teacher","name","grace", "gender","girl","age",30);
    g.addV("","teacher","name","rain", "gender","boy","age",40);

    describe('group test', function(){
        it('group()', function(){
            g.V().group().next().size.should.equal(6);
        })
        it('group().by(property)', function(){
            g.V().group().by("gender").next().size.should.equal(2);
        })
        it('group().by(label)', function(){
            g.V().group().by(label).next().size.should.equal(2);
        })
        it('group().by(property).by(count())', function(){
            // g.V().group().by(property).by(count()).next().size.should.equal(2);
        })
        it('group().by(property).by(values(property).mean())', function(){
            // g.V().group().by("gender").by(values("age").mean()).next().
        })
    })
    describe('groupCount test', function(){
        it('groupCount()', function(){

        })
        it('groupCount().by(property)', function(){

        })
    })




})


