let should = require('should');

let Graph = require('../src/index').Graph;

describe('Vertex test', function(){
    describe('addV test', function(){
        it('addV count', function(){
            let g = new Graph();
            g.addV();
            g.addV();
            g.V().next().length
                .should.equal(2);
        })
        it('addV()', function(){
            let g = new Graph();
            g.addV().next().label
                .should.equal("default");
        })
        it('addV(label)', function(){
            let g = new Graph();

            let label = "test_label";
            g.addV(label).next().label
                .should.equal(label);
        })
        it('addV(label, label, prop1, value1)', function(){
            let g = new Graph();

            let label = "test_label";
            let prop = "name";
            let value = "rain";
            let v = g.addV("", label, prop, value).next();
            v.label
                .should.equal(label);
            v.properties[prop]
                .should.equal(value);
        })
        it('addV(label, label, prop1, value1, prop2, value2)', function(){
            let g = new Graph();

            let label = "test_label";
            let prop = "name";
            let value = "rain";
            let prop2 = "name2";
            let value2 = "rain2";
            let v = g.addV("", label, prop, value, prop2, value2).next();
            v.label.should.equal(label);
            v.properties[prop].should.equal(value);
            v.properties[prop2].should.equal(value2);
        })

    })

    // describe('V(...ids) test', function(){
    //     it('V() should return all vertex.', function(){

    //     })
    //     it('V(id) should return matched vertex.', function(){

    //     })
    //     it('V(id1, id2) should return matched vertexes.', function(){

    //     })
    // })


})


