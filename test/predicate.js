let should = require('should');

let gt = require('../src/index').gt;
let ge = require('../src/index').ge;
let lt = require('../src/index').lt;
let le = require('../src/index').le;

describe('predicate test', function(){
    describe('predicate test', function(){
        it('gt()', function(){
            gt(20)(30).should.be.true;
            gt(20)(20).should.be.false;
            gt(20)(10).should.be.false;
        })
        it('ge()', function(){
            ge(20)(30).should.be.true;
            ge(20)(20).should.be.true;
            ge(20)(10).should.be.false;
        })
        it('lt()', function(){
            lt(20)(30).should.be.false;
            lt(20)(20).should.be.false;
            lt(20)(10).should.be.true;
        })
        it('le()', function(){
            le(20)(30).should.be.false;
            le(20)(20).should.be.true;
            le(20)(10).should.be.true;
        })
    })


})


