module('Lawnchair construction/destruction', {
    setup:function() {
    },
    teardown:function() {
    }
});

test('ctor requires callbacks in each form', function() {
    QUnit.stop();
    expect(8);
    // raise exception if no ctor callback is supplied
    try {
        var lc2 = new Lawnchair();    
    } catch(e) {
        ok(true, 'exception raised if no callback supplied to init');
    }
    try {
        var lc3 = new Lawnchair({}, {});
    } catch(e) {
        ok(true, 'exception raised if no callback supplied to init, but two args are present');
    }
    try {
        var lc3 = new Lawnchair({});
    } catch(e) {
        ok(true, 'exception raised if no callback supplied to init, but one arg is present');
    }
    // should init and call callback
    var lc = new Lawnchair({adaptor:store.adapter}, function() {
        ok(true, 'should call passed in callback when using obj+function ctor form');
        var elsee = this;
        setTimeout(function() {
            // need to timeout here because ctor doesnt return until after callback is called.
            same(elsee, lc, '"this"" is bound to the instance when using obj+function ctor form');
            var elc = new Lawnchair(function() {
                ok(true, 'should call passed in callback when using just function ctor form');
                var lawn = this;
                setTimeout(function() {
                    same(lawn, elc, '"this" is bound to the instance when using just function ctor form');
                    var elon = new Lawnchair('tableName', function() {
                        ok(true, 'should call passed in callback when using string+function ctor form');
                        var elan = this;
                        setTimeout(function() {
                            same(elon, elan, '"this" is bound to the instance when using string+function ctor form');
                            QUnit.start();
                        }, 250);
                    });
                }, 250);
            })
        }, 250);
    });
});
module('all()', {
    setup:function() {
        // I like to make all my variables globals. Starting a new trend.
        me = {name:'brian', age:30};
        store.nuke();
    },
    teardown:function() {
        me = null;
    }
});
test( 'chainable', function() {
    expect(1);
    same(store.all(function(r) {}), store, 'should be chainable (return itself)');
})
test( 'full callback syntax', function() {
    QUnit.stop();
    expect(4);
    store.all(function(r) {
        ok(true, 'calls callback');
        ok(r instanceof Array, 'should provide array as parameter');
        equals(r.length, 0, 'parameter should initially have zero length');
        same(this, store, '"this" should be scoped to the lawnchair object inside callback');
        QUnit.start();
    });
});
test( 'adding, nuking and size tests', function() {
    QUnit.stop();
    expect(2);
    store.save(me, function() {
        store.all(function(r) {
            equals(r.length, 1, 'parameter should have length 1 after saving a single record');
            store.nuke(function() {
                store.all(function(r) {
                    equals(r.length, 0, 'parameter should have length 0 after nuking');
                    QUnit.start();                    
                });
            })
        });
    });
});
test( 'shorthand callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.all('ok(true, "shorthand syntax callback gets evaled"); same(this, store, "`this` should be scoped to the Lawnchair instance"); QUnit.start();') ;
});

module('nuke()', {
    setup:function() {
        store.nuke();
    },
    teardown:function() {
    }
});
test( 'chainable', function() {
    expect(1);
    same(store.nuke(function() {}), store, 'should be chainable');
});
test( 'full callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.nuke(function() {
        ok(true, "should call callback in nuke");
        same(this, store, '"this" should be scoped to the Lawnchair instance');
        QUnit.start();
    });
});
test( 'shorthand callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.nuke('ok(true, "shorthand syntax callback gets evaled"); same(this, store, "`this` should be scoped to the Lawnchair instance"); QUnit.start();');
});


module('save()', {
    setup:function() {
        // I like to make all my variables globals. Starting a new trend.
        me = {name:'brian', age:30};
        store.nuke();
    },
    teardown:function() {
        me = null;
    }
});
test( 'chainable', function() {
    expect(1);
    same(store.save(me), store, 'should be chainable');
});
test( 'full callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.save(me, function(it) {
        ok(true, 'should call passed in callback');
        same(it, me, 'should pass in original saved object in callback');
        QUnit.start();
    });
});
test( 'shorthand callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.save(me, 'ok(true, "shorthand syntax callback gets evaled"); same(this, store, "`this` should be scoped to the Lawnchair instance"); QUnit.start();');
});
test( 'saving objects', function() {
    QUnit.stop();
    expect(1);
    store.save(me, function() {
        this.save({key:"something", value:"else"}, function() {
            store.all(function(r) {
                equals(r.length, 2, 'after saving two keys, num. records should equal to 2');
                QUnit.start();
            });
        });
    })
});

module('batch()', {
    setup:function() {
        // I like to make all my variables globals. Starting a new trend.
        me = {name:'brian', age:30};
        store.nuke();
    },
    teardown:function() {
        me = null;
    }
});

test('batch insertion', function(){
    expect(2);
    ok(store.batch, 'batch implemented');
    QUnit.stop();
    store.batch([{i:1},{i:2}], function() {
        store.all(function(r){
            equals(r.length, 2, 'should be two records from batch insert with array of two objects');
            QUnit.start();
        });
    });
});
test( 'full callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.batch([{j:'k'}], function() {
        ok(true, 'callback called with full syntax');
        same(this, store, '"this" should be the LAwnchair instance');
        QUnit.start();
    })
});
test( 'shorthand callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.batch([{o:'k'}], 'ok(true, "shorthand syntax callback gets evaled"); same(this, store, "`this` should be scoped to the Lawnchair instance"); QUnit.start();')
});

module('get()', {
    setup:function() {
        // I like to make all my variables globals. Starting a new trend.
        me = {name:'brian', age:30};
        store.nuke();
    },
    teardown:function() {
        me = null;
    }
});
test( 'should it be chainable?', function() {
    ok(false, 'should get() be chainable? or try to return obj synchronously?');
});
test('get functionality', function() {
    QUnit.stop();
    expect(3);
    store.save({key:'xyz', name:'tim'}, function() {
        store.get('xyz', function(r) {
            equals(r.name, 'tim', 'should return proper object when calling get with a key');
            store.get('doesntexist', function(s) {
                ok(true, 'should call callback even for non-existent key');
                equals(s, null, 'should return null for non-existent key');
                QUnit.start();                
            });
        });
    });
});
test( 'full callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.get('somekey', function(r){
        ok(true, 'callback got called');
        same(this, store, '"this" should be teh Lawnchair instance');
        QUnit.start();
    });
});
test('short callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.get('somekey', 'ok(true, "shorthand syntax callback gets evaled"); same(this, store, "`this` should be scoped to the Lawnchair instance"); QUnit.start();');
});

module('remove()', {
    setup:function() {
        // I like to make all my variables globals. Starting a new trend.
        me = {name:'brian', age:30};
        store.nuke();
    },
    teardown:function() {
        me = null;
    }
});
test( 'chainable', function() {
    expect(1);
    same(store.remove('me'), store, 'should be chainable');
});
test( 'full callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.remove('somekey', function(r){
        ok(true, 'callback got called');
        same(this, store, '"this" should be teh Lawnchair instance');
        QUnit.start();
    });
});
test('short callback syntax', function() {
    QUnit.stop();
    expect(2);
    store.remove('somekey', 'ok(true, "shorthand syntax callback gets evaled"); same(this, store, "`this` should be scoped to the Lawnchair instance"); QUnit.start();');
});
// FIXME need to add tests for batch deletion 
test( 'remove functionality', function() {
    QUnit.stop();
    expect(2);
    store.save({name:'joni'}, function() {
        store.find("r.name == 'joni'", function(r){
            store.remove(r, function(r) {
                store.all(function(all) {
                    equals(all.length, 0, "should have length 0 after saving, finding, and removing a record using entire object");
                    store.save({key:'die', name:'dudeman'}, function(r) {
                        store.remove('die', function(r){
                            store.all(function(rec) {
                                equals(rec.length, 0, "should have length 0 after saving and removing by string key");
                                QUnit.start();
                            });
                        });
                    });
                });
            });
        });
    });
});
