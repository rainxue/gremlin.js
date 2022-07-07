'use strict';

function get_json_values(json) { 
    let arr = [];
    for(let key in json) {
        arr.push(json[key]);
    }
    return arr;
}


function gt(value) {
    return (val => {
        return val>value;
    })
}

function lt(value) {
    return (val => {
        return val<value;
    })
}

function ge(value) {
    return (val => {
        return val>=value;
    })
}

function le(value) {
    return (val => {
        return val<=value;
    })
}

// let func = {}
// function out() {
//     func.action = "out";
//     //func.args = args
// }

function all_or_in(args) {
    switch(args.length) {
        case 0:
            return (arg => { return true })
        case 1: 
            return (arg => { return arg == args[0]})
        default :
            return (arg => { return args.includes(arg) })
    }
}

// let xx = ge(20);
// let xx2;
// let xx3 = {};
// let xx4 = [];

// console.log(typeof(xx)=="function");
// console.log(typeof(xx2)=="function");
// console.log(typeof(xx3)=="function");
// console.log(typeof(xx4)=="function");

// console.log(gt(20)(12));

// console.log(get_json_values({"aa":11, "bb":"ccc"}));
// console.log(get_json_values({"aa":11, "bb":"ccc"}).includes("ccc"));
// console.log(get_json_values({"aa":11, "bb":"ccc"}).includes("ddd"));


function values(property) {
    return (list => {
        let arr = [];
        list.forEach(item => {
            arr.push(item.properties[property]);
        })
        return arr;
    })
}
function count() {
    return (map => {
        for (let [key, value] of map) {
            map.set(key, value.length);
        }
    })
}


// // console.log(typeof count());

// class label{

// }

// function test(arg) {
//     console.log(typeof arg);
//     // if((typeof arg)=="function") 
//     //     console.log("=================");
//     // else
//     //     console.log("****************")
// }

// test(label);
// let map = new Map();
// map.set("aa", ["aaa","bbb"]);
// map.set("aa1", ["aaa"]);
// map.set("aa2", ["aaa","bbb"]);
// map.set("aa3", ["aaa","bbb","dd"]);
// map.set("bb", ["ccccc"]);

// count()(map);

// console.log(map);

let vertex = {
    id:"",
    label:"",
    properties:{key:"value"},

    _out:[],
    _in:[],
}

let edge = {
    id:"",      // S{source_vertex.id}>id>>S{target_vertex.id}
    label:"",
    source:"",  // source vertex id
    target:"",  // target vertex id
    properties:{key:"value"},

    _source:null,
    _target:null
}
class Graph {
    constructor() {
        this._vertexes = [];
        this._edges = [];

        this._max_id = 1;
        this._as_kv = {};
        this._curr_data = [];
        this._step_cache = "";
    }

    // _getAllVertexes() {
    //     return Array.from(this._vertexes);
    // }

    // _getVertexById(id) {
    //     for(let i=0;i<this._vertexes.length; i++) {
    //         if(this._vertexes[i].id == id) return [this._vertexes[i]];
    //     }
    //     return [];
    // }

    // _getVertexesByIds(ids) {
    //     let vs = []
    //     for(let i=0; i<this._vertexes.length && ids.length>0; i++) {
    //         let id = this._vertexes[i].id;
    //         if(ids.includes(id)) {
    //             vs.push(this._vertexes[i]);
    //             ids = ids.splice(ids.findIndex(item => item.id === id), 1);
    //         }
    //     }

    //     return vs;
    // }

    // _set_curr_data(data) {
    //     this._curr_data = data;
    // }
    load() {

    }


    /**
     * addV()
     * addV(label)
     * addV(label, "label", "prop1", "prop value1", ...)
     * @param  {...any} args 
     */
    addV(...args) {
        let label;

        let v = { id:this._max_id++, properties:{} };
        switch(args.length) {
            case 0:
                v.label = "default";
                break;
            case 1:
                v.label = args[0];
                break;
            default:
                v.label = args[1];
                // v.properties = {};
                for(let i=2; i<args.length-1; i+=2) {
                    v.properties[args[i]] = args[i+1];
                }
        }
        
        this._vertexes.push(v);
        this._curr_data = v;
        return this;
    }

    _handleStepCache() {
        // 处理 group().by() groupCount().by() dedup().by()  order().by()  
        if(this._step_cache == "group") {
            this._group_by_id();
        } else if(this._step_cache == "order") {

        } else {

        }

        this._step_cache = "";
    }

    /**
     * 返回当前创建或过滤的上下文对象
     */
    next() {
        if(this._step_cache != "") this._handleStepCache();
        
        return this._curr_data;
    }



    as(key) {
        this._as_kv[key] = this._curr_data;
        return this;
    }
    /**
     * 统计查询结果集中元素的个数
     */
    count() {
        return this._curr_data.length;
    }

    /**
     * 等效于range(0, n)，语义是“获取前n个元素”。比如limit(3)能获取前3个元素；
     * @param {*} n 
     */
    limit(n) {
        return this.range(0, n);
    }

    /**
     * 等效于range(count - n, -1)，语义是“获取后n个元素”。
     * @param {*} n 
     */
    tail(n) {
        // return this.range(this.count() - n, -1);
        this._curr_data = this._curr_data.slice(-n);
        return this;
    }

    /**
     * 等效于range(n, -1)，语义是“跳过前n个元素，获取剩余的元素”。
     * @param {*} n 
     */
    skip(n) {
        return this.range(n, -1);
    }

    /**
     * 指定下界和上界的截取，左闭右开。比如range(2, 5)能获取第2个到第4个元素（0作为首个元素，上界为-1时表示剩余全部）；
     * @param {*} m 
     * @param {*} n 
     */
    range(m, n) {
        this._curr_data = this._curr_data.slice(m, n);
        return this;
    }

    group() {
        this._step_cache = "group";
        // let map = new Map();
        // this._curr_data.forEach( item => {
        //     let list = map.get(item.id);
        //     if(list== undefined) {
        //         list = [];
        //         map.set(item.id, list);
        //     }
        //     list.push(item);
        // })
        // this._curr_data = map;
    }

    _group_by_id() {
        let map = new Map();
        this._curr_data.forEach( item => {
            let list = map.get(item.id);
            if(list== undefined) {
                list = [];
                map.set(item.id, list);
            }
            list.push(item);
        })
        this._curr_data = map;
    }

    _by_property(property) {
        let map = new Map();
        for (let list of this._curr_data.values()) {
            for(let item of list) {
                let value = item.properties[property];
                let new_list = map.get(value);
                if(new_list == undefined) {
                    new_list = [];
                    map.set(value, new_list);
                }
                new_list.push(item);
            }
        }

        this._curr_data = map;
        return this;
    }

    _by_label() {
        let map = new Map();
        for (let list of this._curr_data.values()) {
            for(let item of list) {
                let value = item.label;
                let new_list = map.get(value);
                if(new_list == undefined) {
                    new_list = [];
                    map.set(value, new_list);
                }
                new_list.push(item);
            }
        }

        this._curr_data = map;
        return this;
    }

    _by_func(func) {
        func(this._curr_data);
        return this;
    }

    by(arg) {
        this._step_cache = "";

        if(typeof arg == "function") {
            return this._by_func(arg);
        } else if(arg==label) {
            return this._by_label();
        } else {
            return this._by_property(arg);
        }
    }

    dedup() {
        this._curr_data = [...new Set(this._curr_data)];
        return this;
    }

    out(...labels) {
        let arr = [];
        this._curr_data.forEach(v => {
            if(v._out) {
                v._out.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e._target);
                })
            } 
        });
        this._curr_data = arr;
        return this;
    }

    in(...labels) {
        let arr = [];
        this._curr_data.forEach(v => {
            if(v._in) {
                v._in.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e._source);
                })
            } 
        });
        this._curr_data = arr;
        return this;
    }

    both(...labels) {
        let arr = [];
        this._curr_data.forEach(v => {
            if(v._out) {
                v._out.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e._target);
                })
            }
            if(v._in) {
                v._in.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e._source);
                })
            } 
        });
        this._curr_data = arr;
        return this;        
    }

    outE(...labels) {
        let arr = [];
        this._curr_data.forEach(v => {
            if(v._out) {
                v._out.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e);
                })
            } 
        });
        this._curr_data = arr;
        return this;
    }

    inE(...labels) {
        let arr = [];
        this._curr_data.forEach(v => {
            if(v._in) {
                v._in.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e);
                })
            } 
        });
        this._curr_data = arr;
        return this;
    }

    bothE(...labels) {
        let arr = [];
        this._curr_data.forEach(v => {
            if(v._out) {
                v._out.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e);
                })
            }
            if(v._in) {
                v._in.forEach(e => {
                    if(all_or_in(labels)(e.label)) arr.push(e);
                })
            } 
        });
        this._curr_data = arr;
        return this;        
    }

    outV() {
        let arr = [];
        this._curr_data.forEach(e => {
            arr.push(e._source);
        });
        this._curr_data = arr;
        return this;
    }

    inV() {
        let arr = [];
        this._curr_data.forEach(e => {
            arr.push(e._target);
        });
        this._curr_data = arr;
        return this;
    }

    bothV() {
        let arr = [];
        this._curr_data.forEach(e => {
            arr.push(e._source);
            arr.push(e._target);
        });
        this._curr_data = arr;
        return this;
    }

    // out(...edge_labels) {
    //     switch(edge_labels.length) {
    //         case 0:
    //             break;
    //         case 1:
    //             break;
    //         default:

    //     }
    // }
    _create_edge_id(source_id, target_id) {
        return "S" + source_id + ">" + this._max_id++ + ">>S" + target_id;
    }

    _addE_label(label) {
        this._temp_edge = {label: label, properties:{}};

        return this;
    }

    _addE_lt(label, targetVertex) {

    }

    _storeE(e, source, target) {
        e.id = this._create_edge_id(source.id, target.id);
        e._source = source;
        e._target = target;

        if(!source._out) source._out = [];
        source._out.push(e);
        if(!target._in) target._in = [];
        target._in.push(e);

        this._edges.push(e);
    }

    _addE_ltp(label, targetVertex) {

    }
    /**
     * addE(label).to(targetVertex)
     * addE(label, targetVertex);
     * addE(label, targetVertex, ...props);
     * @param  {...any} args 
     */
    addE(...args) {
        switch(args.length) {
            case 0:
                // v.label = "default";
                throw new Error("need edge label.");
            case 1:
                // e.label = args[0];
                this._addE_label(args[0]);
                break;
            default:
                let source = this._curr_data;
                let target = args[1];

                let e = {label: args[0], properties:{}};                
                for(let i=2; i<args.length-1; i+=2) {
                    e.properties[args[i]] = args[i+1];
                }

                this._storeE(e, source, target);
                this._curr_data = e;
        }
        
        return this;
    }


    to(vertex) {
        let source = this._curr_data;
        let target = vertex;

        let e = this._temp_edge;
        this._storeE(e, source, target);

        this._curr_data = e;
        return this;        
    }

    /**
     * to(lable)
     * to(vertex)
     * to(vertexes)
     * @param  {...any} args 
     */
    to2(...args) {
        let source_id = this._curr_data.id;
        let target_id = args[1].id;

        this._temp_edge.id = this._create_edge_id(source_id, target_id);
        this._curr_data.id = "S" + this._old_vertex.id + ">" + this._curr_data.id + ">>S" + vertex.id;
    }

    /**
     * 给当前对象增加属性
     * @param {*} property 
     * @param {*} value 
     */
    property(property, value) {
        this._curr_data.properties[property] = value;
        return this;
    }

    /**
     * 获取顶点
     * V()
     * V(id)
     * V(id1,id2,...)
     * @param  {...any} ids 
     */
    V(...ids) {
        let arr = [];
        this._vertexes.forEach(v => {
            if(all_or_in(ids)(v.id)) arr.push(v);
        })
        this._curr_data = arr;
        return this;
    }

    E(...ids) {
        let arr = [];
        this._edges.forEach(e => {
            if(all_or_in(ids)(e.id)) arr.push(e);
        })
        this._curr_data = arr;
        return this;
    }

    label() {
        let arr = [];
        for(let item of this._curr_data) {
            arr.push(item.label);
        }
        return arr;
    }

    id() {
        let arr = [];
        for(let item of this._curr_data) {
            arr.push(item.id);
        }
        return arr;
    }

    /**
     * object的label与labels列表中任何一个匹配就可以通过
     * @param  {...any} labels 
     */
    hasLabel(...labels) {
        let arr = [];
        switch(labels.length) {
            case 1:
                for(let item of this._curr_data) {
                    if(item.label == labels[0]) arr.push(item);
                }
                break;
            default:
                for(let item of this._curr_data) {
                    if(labels.includes(item.label)) arr.push(item);
                }
        }

        this._curr_data = arr;
        return this;
    }

    hasId(...ids) {
        let arr = [];
        switch(ids.length) {
            case 1:
                for(let item of this._curr_data) {
                    if(item.id == ids[0]) arr.push(item);
                }
                break;
            default:
                for(let item of this._curr_data) {
                    if(ids.includes(item.id)) arr.push(item);
                }
        }

        this._curr_data = arr;
        return this;
    }

    _has_kv(key, value) {
        let arr = [];
        for(let item of this._curr_data) {
            if(item.properties[key] == value) arr.push(item);
        }
        this._curr_data = arr;
        return this;
    }

    _has_k(key) {
        let arr = [];
        for(let item of this._curr_data) {
            if(key in item.properties) arr.push(item);
        }
        this._curr_data = arr;
        return this;
    }

    _has_lkb(label, key, value) {
        let arr = [];
        for(let item of this._curr_data) {
            if(item.label == label && item.properties[key] == value) arr.push(item);
        }
        this._curr_data = arr;
        return this;
    }

    _has_kp(key, predicate) {
        let arr = [];
        for(let item of this._curr_data) {
            if(key in item.properties && predicate(item.properties[key])) {
                arr.push(item);
            }
        }
        this._curr_data = arr;
        return this;
    }

    /**
     * has(key) 包含键为key的属性的object通过，作用于顶点或者边
     * has(key, value) 包含属性“key=value”的object通过，作用于顶点或者边
     * has(key, predicate) 包含键为key且对应的value满足predicate的object通过，作用于顶点或者边，如：g.V().has('age', gt(20))
     * has(label, key, value) 包含属性“key=value”且label值匹配的object通过，作用于顶点或者边
     * @param  {...any} args 
     */
    has(...args) {
        switch(args.length) {
            case 1:
                return this._has_k(args[0]);
            case 2:
                if(typeof(args[1])=="function")
                    return this._has_kp(args[0], args[1]);
                else
                    return this._has_kv(args[0], args[1]);
            default:
                return this._has_lkb(args[0], args[1], args[2])
        }
    }


    /**
     * 不包含键为key的属性的object通过，作用于顶点或者边
     * @param {*} key 
     */
    hasNot(key) {
        let arr = [];
        for(let item of this._curr_data) {
            if(!(key in item.properties)) arr.push(item);
        }
        this._curr_data = arr;
        return this;
    }

    /**
     * object的属性键包含所有的keys列表成员才能通过，作用于顶点属性
     * hasKey(key)
     * hasKey(key1, key2, ...)
     * @param  {...any} keys 
     */
    hasKey(...keys) {
        let arr = [];
        for(let item of this._curr_data) {
            let keyNotExist = false;
            for(let i=0; i<keys.length; i++) {
                if(!(keys[i] in item.properties)) {
                    keyNotExist = true;
                    break;
                }
            }
            if( !keyNotExist ) arr.push(item);
        }
        this._curr_data = arr;
        return this;
    }

    /**
     * object的属性值包含所有的values列表成员才能通过，作用于顶点属性
     * hasValue(value)
     * hasValue(value1, value2, ...)
     * @param  {...any} values 
     */
    hasValue(...values) {
        let arr = [];
        for(let item of this._curr_data) {
            let valueNotExist = false;
            for(let i=0; i<values.length; i++) {
                if(!(get_json_values(item.properties).includes(values[i]))) {
                    valueNotExist = true;
                    break;
                }
            }
            if( !valueNotExist ) arr.push(item);
        }
        this._curr_data = arr;
        return this;
    }

    properties() {
        let arr = [];
        for(let item of this._curr_data) {
            arr.push(item.properties);
        }
        this._curr_data = arr;
        return this;
    }

    repeat(func) {

    }

    toJson() {
        return JSON.stringify(this._vertexes);
    }

    test(...ids) {
        console.log(ids.length);
    }

    pr(...ids) {
        console.log(ids);
    }
}

// let g = new Graph();

// g.addV("person1");
// g.addV("person2");
// g.addV("person3");
// g.addV("person4");
// g.addV("label", "person");
// g.addV("label", "person", "name", "p1");
// g.addV("label", "person", "name", "p2", "age", 33);
// g.addV("label", "person", "name", "p3").property("age", 44);
// g.addV("label", "person", "name", "p4").property("age", 44).property("addr", "fuzhou");
// g.addV("label", "person2", "name", "p5").property("age", 44).property("addr", "fuzhou");
// g.addV("label", "person2", "name", "p6").property("age", 45).property("addr", "fuzhou");

// console.log(g.V().next().length);
// let v = g.addV("person").property("name", "rain").next();

// g.addV("person").property("name", "cloud").addE("friends").to(v);

// g.V().out("friends").next();

// console.log(g.V().label());
// console.log(g.V(1).label());
// console.log(g.V(1,3).label());
// console.log(g.V(2,6,7).label());

// console.log(g.V().id());
// console.log(g.V(1).id());
// console.log(g.V(1,3).id());
// console.log(g.V(2,6,7).id());

// console.log(g.V().hasLabel("person"));
// console.log(g.V().hasId(3));
// console.log(g.V().hasId(3, 6));
// console.log(g.V().has("age"));
// console.log(g.V().has("age", 44));
// console.log(g.V().has("person2", "age", 44));
// console.log(g.V().hasKey("age"));
// console.log(g.V().hasKey("addr","age"));

// console.log(g.V().hasValue(44));
// console.log(g.V().hasValue(44, "fuzhou"));

// console.log(g.V().hasNot("age"));

// console.log(g.V().has("age", gt(30)));
// console.log(g.V().has("age", gt(40)));
// console.log(g.V().has("age", gt(44)));
// console.log(g.V().has("age", ge(44)));

// console.log(g.toJson());


// g.test();
// g.test('aa');
// g.test('aa','bb','cc');


// g.pr("333");
// g.pr("444","555");

exports.Graph = Graph;
exports.g = new Graph();

exports.gt = gt;
exports.lt = lt;
exports.ge = ge;
exports.le = le;

// function test(a, b, ...labels) {
//     console.log("--------------------------------")
//     console.log(a);
//     console.log(b);
//     console.log(labels.length);
// }


// test("aa","bb","cc","dd");