(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'backbone', 'advicefactory', 'chai'], function(_, Backbone, Factory, Chai) {
            window.assert = Chai.assert;
            window.expect = Chai.expect;
            root.AdviceFactory = factory(root, _, Backbone, Factory);
            return root.AdviceFactory;
        });
    } else if (typeof exports !== 'undefined') {
        var _ = require('lodash');
        var Backbone = require('backbone');
        Backbone.$ = global.$;
        var Factory = require('../backbone-advicefactory');
        module.exports = factory(root, _, Backbone, Factory);
    } else {
        root.AdviceFactory = factory(root, root._, root.Backbone, root.AdviceFactory);
    }
})(this, function(root, _, Backbone, Factory) {
    console.log('running tests');
    describe('Backbone Advice Factory', function () {
        var dateVal = new Date();
        var arrVal = [1,2,3];
        var objVal = {
            foo: "bar"
        };
        var baseConstructor = Backbone.View.extend({
            bProp1: "foo",
            bProp2: 2,
            bProp3: arrVal,
            bProp4: dateVal,
            bProp5: objVal,
            oProp1: "some other value",
            oProp2: "some other value",
            oProp3: "some other value",
            oProp4: "some other value",
            oProp5: "some other value",
            ctr: 0,
            incrementCounter: function() {
                this.ctr++;
            }
        });
        describe('Creating an Instance', function () {
            var base = Factory.register('MyConstructor1', {
                base: baseConstructor,
                incrementCounter: function() {
                    this.ctr++;
                },
                prop1: "foo",
                prop2: 2,
                prop3: arrVal,
                prop4: dateVal,
                prop5: objVal,
                oProp1: "foo",
                oProp2: 2,
                oProp3: arrVal,
                oProp4: dateVal,
                oProp5: objVal
            });
            var inst = Factory.inst('MyConstructor1');
            it('should have base properties defined', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.bProp1, "foo");
                assert.equal(inst.bProp2, 2);
                assert.equal(inst.bProp3, arrVal);
                assert.equal(inst.bProp4, dateVal);
                assert.equal(inst.bProp5, objVal);
            });
            it('should have new properties defined', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.prop1, "foo");
                assert.equal(inst.prop2, 2);
                assert.equal(inst.prop3, arrVal);
                assert.equal(inst.prop4, dateVal);
                assert.equal(inst.prop5, objVal);
            });
            it('should have overriden properties defined', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.oProp1, "foo");
                assert.equal(inst.oProp2, 2);
                assert.equal(inst.oProp3, arrVal);
                assert.equal(inst.oProp4, dateVal);
                assert.equal(inst.oProp5, objVal);
            });
            it('functions should be afters by default', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.oProp1, "foo");
                assert.equal(inst.oProp2, 2);
                assert.equal(inst.oProp3, arrVal);
                assert.equal(inst.oProp4, dateVal);
                assert.equal(inst.oProp5, objVal);
            });
            it('should have put the function as an after', function() {
                assert.equal(inst.ctr, 0);
                inst.incrementCounter();
                assert.equal(inst.ctr, 2);
            })
        });

        describe('Apply mixins with options', function () {
            var base = Factory.register('MyConstructor2', {
                base: baseConstructor,
                mixins: [
                    function(options) {
                        if(options.doMixin) {
                            this.clobber({
                                prop1: "foo",
                                prop2: 2,
                                prop3: arrVal,
                                prop4: dateVal,
                                prop5: objVal,
                                oProp1: "foo",
                                oProp2: 2,
                                oProp3: arrVal,
                                oProp4: dateVal,
                                oProp5: objVal
                            });
                            this.after({
                                incrementCounter: function() {
                                    this.ctr++;
                                }
                            })
                        }
                    }
                ],
                mixinOptions: {
                    doMixin: true
                }
            });
            var inst = Factory.inst('MyConstructor2');
            it('should have base properties defined', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.bProp1, "foo");
                assert.equal(inst.bProp2, 2);
                assert.equal(inst.bProp3, arrVal);
                assert.equal(inst.bProp4, dateVal);
                assert.equal(inst.bProp5, objVal);
            });
            it('should have new properties defined', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.prop1, "foo");
                assert.equal(inst.prop2, 2);
                assert.equal(inst.prop3, arrVal);
                assert.equal(inst.prop4, dateVal);
                assert.equal(inst.prop5, objVal);
            });
            it('should have overriden properties defined', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.oProp1, "foo");
                assert.equal(inst.oProp2, 2);
                assert.equal(inst.oProp3, arrVal);
                assert.equal(inst.oProp4, dateVal);
                assert.equal(inst.oProp5, objVal);
            });
            it('functions should be afters by default', function () {
                assert.equal(inst.ctr, 0);
                assert.equal(inst.oProp1, "foo");
                assert.equal(inst.oProp2, 2);
                assert.equal(inst.oProp3, arrVal);
                assert.equal(inst.oProp4, dateVal);
                assert.equal(inst.oProp5, objVal);
            });
            it('should have put the function as an after', function() {
                assert.equal(inst.ctr, 0);
                inst.incrementCounter();
                assert.equal(inst.ctr, 2);
            })
        });

        describe('Apply reserved keywords', function () {
            var extendedBase = baseConstructor.extend({
                str1: '',
                str2: '',
                str3: '',
                bProp1: "foo",
                bProp2: 2,
                bProp3: arrVal,
                bProp4: dateVal,
                bProp5: objVal,
                add1: function() {
                    return this.str1 += 'a';
                },
                add2: function() {
                    return this.str2 += 'a';
                },
                add3: function() {
                    return this.str3 += 'a';
                },
                defaultObj: {
                    prop1: "some other value",
                    prop2: "some other value",
                    prop3: "some other value",
                    prop4: "some other value",
                    prop5: "some other value"
                },
                oProp1: "some other value",
                oProp2: "some other value",
                oProp3: "some other value",
                oProp4: "some other value",
                oProp5: "some other value",
                dProp: {
                    defaultVal1: 1
                }
            });
            var base = Factory.register('MyConstructor3', {
                base: extendedBase,

                after: {
                    add1: function() {
                        return this.str1 += 'b';
                    }
                },
                before: {
                    add2: function() {
                        return this.str2 += 'b';
                    }
                },
                around: {
                    add3: function(o) {
                        o.call(this);
                        return this.str3 += 'b';
                    }
                },
                setDefaults: {
                    prop1: "foo",
                    prop2: 2,
                    prop3: arrVal,
                    prop4: dateVal,
                    prop5: objVal,
                    bProp1: "some other value",
                    bProp2: "some other value",
                    bProp3: "some other value",
                    bProp4: "some other value",
                    bProp5: "some other value"
                },
                addToObj: {
                    defaultObj: {
                        prop1: "foo",
                        prop2: 2,
                        prop3: arrVal,
                        prop4: dateVal,
                        prop5: objVal,
                    }
                },
                extend: {
                    oProp1: "foo",
                    oProp2: 2,
                    oProp3: arrVal,
                    oProp4: dateVal,
                    oProp5: objVal
                },
                deepExtend: {
                    dProp: {
                        prop1: "foo",
                        prop2: 2,
                        prop3: arrVal,
                        prop4: dateVal,
                        prop5: objVal,
                    }
                }
            });
            var inst = Factory.inst('MyConstructor3');
            it('should apply before', function () {
                inst.add1();
                assert.equal(inst.str1, 'ab');
            });
            it('should apply after', function() {
                inst.add2();
                assert.equal(inst.str2, 'ba');
            });
            it('should apply around', function() {
                inst.add3();
                assert.equal(inst.str3, 'ab');
            });
            it('should set defaults', function() {
                assert.equal(inst.bProp1, "foo");
                assert.equal(inst.bProp2, 2);
                assert.equal(inst.bProp3, arrVal);
                assert.equal(inst.bProp4, dateVal);
                assert.equal(inst.bProp5, objVal);
                assert.equal(inst.prop1, "foo");
                assert.equal(inst.prop2, 2);
                assert.equal(inst.prop3, arrVal);
                assert.equal(inst.prop4, dateVal);
                assert.equal(inst.prop5, objVal);
            });
            it('should addToObj', function() {
                assert.equal(inst.defaultObj.prop1, "foo");
                assert.equal(inst.defaultObj.prop2, 2);
                assert.equal(inst.defaultObj.prop3, arrVal);
                assert.equal(inst.defaultObj.prop4, dateVal);
                assert.equal(inst.defaultObj.prop5, objVal);
            });
            it('should extend the base constructor with given values', function() {
                assert.equal(inst.oProp1, "foo");
                assert.equal(inst.oProp2, 2);
                assert.equal(inst.oProp3, arrVal);
                assert.equal(inst.oProp4, dateVal);
                assert.equal(inst.oProp5, objVal);
            });
            it('should deep extend objects on the base constructor', function() {
                assert.equal(inst.dProp.defaultVal1, 1);
                assert.equal(inst.dProp.prop1, "foo");
                assert.equal(inst.dProp.prop2, 2);
                assert.equal(inst.dProp.prop3, arrVal);
                assert.equal(inst.dProp.prop4, dateVal);
                assert.equal(inst.dProp.prop5, objVal);
            });
        });

    });
});
