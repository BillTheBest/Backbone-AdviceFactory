/**
 * @version 0.4.0
 * @copyright Copyright 2013 Dataminr
 * @license Licensed under The MIT License http://opensource.org/licenses/MIT
 * @fileOverview Advice factory provides an interface to apply advice onto object constructors.
 * It allows you to write to and instantiate from a cache of constructors using a namespace.
 * Allows for creating new constructors from previously cached base constructors.
 * When mixing inheritance models (Backbone's extends and Advice's mixins) there are often cases when you may overwrite
 * mixins unintentionally. Backbone.AdviceFactory helps set up the inheritance the way you want it to work.
 * For instance you may extend "initialize" in a latter class that will not only override the former "initialize"
 * method but also all the other mixins that were put on that function. To prevent this happening
 * Backbone.AdviceFactory allows you to setup an inheritance structure that will compose all the extends THEN all
 * the mixins together for that level rather than trying to just extend a constructor that already has mixins put on.
 *
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['mutation-js/lodash.mutation', 'backbone', 'functional-advice'], function(_, Backbone, Advice) {
            root.AdviceFactory = factory(root, _, Backbone, Advice);
            return root.AdviceFactory;
        });
    } else if (typeof exports !== 'undefined') {
        var _ = require('mutation-js/lodash.mutation');
        var Backbone = require('backbone');
        var Advice = require('functional-advice');
        module.exports = factory(root, _, Backbone, Advice);
    } else {
        root.AdviceFactory = factory(root, root._, root.Backbone, root.Advice);
    }
})(this, function(root, _, Backbone, Advice) {

    Advice.addAdvice(Backbone.View);
    Advice.addAdvice(Backbone.Model);
    Advice.addAdvice(Backbone.Collection);

    // holds the nodes
    var cache = {};

    // keys that should be passed to the mixin function
    var adviceKeywords = [
        'after',
        'before',
        'around',
        'clobber',
        'addToObj',
        'setDefaults',
        'mixin'
    ];

    // reserved keys used by AdviceFactory
    var reserved = adviceKeywords.concat([
        'mixins',
        'extend',
        'deepExtend',
        'base',
        'options',
        'mixinOptions'
    ]);

    // keys that should clobbered, even if they are a function
    var extendKeys = [
        'itemView',
        'content',
        'header',
        'endorsed',
        'parse',
        'model',
        'template',
        'widget',
        'serialize'
    ];

    /**
     * Holds information for an inheritance level
     * @constructor
     * @param {string|function(new:object)} base
     * @param {object} ext
     * @param {object} mixins
     * @param {object} options
     */
    var BaseNode = function BaseNode(base, ext, deepExt, mixins, options) {
        this.base = _.isString(base) ? cache[base] : base;
        this.ext = ext || {};
        this.deepExt = deepExt || {};
        this.mixins = mixins || {};
        this.options = options || {};
        this.main = null;
    };

    return {
        /**
         * register a type with the factory
         * @param name {string} Namespace to register the constructor as
         * @param options {object} Options object to define the new constructor
         * @param options.base {@link Backbone.View | @link Backbone.Model, @link Backbone.Collection} The base for defining the new constructor
         * @returns {Function}
         */
        register: function(name, options) {
            var opts = {};

            // get the base node
            var base = options.base;
            opts.base = _.isString(base) ?
                cache[base] :
                new BaseNode(base);

            // makes sure we have the options structure we need
            _.extend(opts, {
                deepExtend: options.deepExtend || {},
                extend: _.clone(options.extend) || {},
                mixins: _.clone(_.isArray(options.mixins) ?
                {
                    mixin: options.mixins,
                    after: {},
                    before: {}
                } :
                    options.mixins) || {},
                options: _.clone(options.mixinOptions || options.options) || {}
            });

            // this is where the magic happens
            for (var key in options) {

                // skip reserved keys
                if (!_.contains(reserved, key)) {

                    // functions should be put on as an 'after' otherwise extend
                    if (_.isFunction(options[key]) &&
                        !_.contains(extendKeys, key)) {
                        opts.mixins.after = opts.mixins.after || {}
                        opts.mixins.after[key] = options[key];
                    } else {
                        opts.extend[key] = options[key];
                    }
                }

                // add mixin keywords to a mixin
                if (_.contains(adviceKeywords, key)) {
                    opts.mixins[key] = opts.mixins[key] || {};
                    _.extend(opts.mixins[key], options[key]);
                }
            }

            // create the inheritance node and return it's constructor
            cache[name] = new BaseNode(opts.base, opts.extend, opts.deepExtend, opts.mixins, opts.options);
            cache[name].main = this.create(name);
            cache[name].main.__name = name;
            return cache[name].main;
        },
        /**
         * return the constructor for a namespace
         * @param type {string} Namespace for the constructor to be returned
         * @returns {Function}
         */
        get: function(type) {
            return cache[type].main;
        },
        /**
         * return an instance of the specified constructor namespace
         * @param type {string | object} string namespace of constructor or constructor itself
         * @returns {Object}
         */
        inst: function(type) {
            var base = (_.isString(type)) ? this.get(type) : type;
            return this._inst.apply(this, [base].concat(Array.prototype.slice.call(arguments, 1)));
        },
        /**
         * instantiate a constructor with arguments
         * @param base
         * @private
         */
        _inst: function(base) {
            if (arguments.length == 1)
                return new (base)();
            if (arguments.length == 2)
                return new (base)(arguments[1]);
            if (arguments.length == 3)
                return new (base)(arguments[1], arguments[2]);
            if (arguments.length == 4)
                return new (base)(arguments[1], arguments[2], arguments[3]);
            if (arguments.length == 5)
                return new (base)(arguments[1], arguments[2], arguments[3], arguments[4]);
        },
        /**
         * extends an objects properties that are objects as well as arrays
         * e.g.
         * Factory.extend({
         *      a:{a:1},
         *      b:[1]
          * },
         *  {
         *      a:{b:1},
         *      b:[2]
         *  });
         * logs: {
         *      a: {a:1,b:1},
         *      b[1,2]
         *  };
         * @param obj Object to be extended
         * @param ext Object to be extended with
         * @returns {*}
         */
        extend: function(obj, ext) {
            if (arguments.length > 2) {
                for (var i = arguments.length - 1; i > 1; i--) {
                    Factory.extend(obj, arguments[i]);
                }
                return obj;
            }
            for (var key in ext) {
                if (_.isArray(ext[key]) && _.isArray(obj[key]))
                    obj[key].push.apply(obj[key], ext[key]);
                else if (_.isObject(ext[key]) && _.isObject(obj[key]))
                    _.extend(obj[key], ext[key]);
                else
                    obj[key] = ext[key];
            }
            return obj;
        },
        /**
         * Get the mixins associated with a given constructor namespace
         * @param type {string} constructor namespace
         * @returns {array}
         */
        getMixinsForType: function(type) {
            return _.flatten(_.compact(_.map(this.getMixins(cache[type]), function(level) {
                return level.mixin;
            })));
        },
        /**
         * Get the mixin options associated with a given constructor namespace
         * @param type
         * @returns {object}
         */
        getMixinOptionsForType: function(type) {
            return this.getOptions(cache[type]);
        },
        /**
         * get array of mixins object for a BaseNode
         * @param {BaseNode} node
         * @return {array}
         */
        getMixins: function(node) {
            if (!(node instanceof BaseNode)) {
                return [{}]
            }
            return this.getMixins(node.base).concat([node.mixins || {}]);
        },
        /**
         * get the options for mixins for a BaseNode
         * @param {BaseNode} node
         * @return {object}
         */
        getOptions: function(node) {
            if (!(node instanceof BaseNode)) {
                return {}
            }
            return _.extend({}, this.getOptions(node.base), node.options);
        },
        /**
         * get the extends for a BaseNode
         * @param {BaseNode} node
         * @return {object}
         */
        getExt: function(node) {
            if (!(node instanceof BaseNode)) {
                return {};
            }
            return _.extend({}, this.getExt(node.base), node.ext);
        },
        /**
         * get the deep extends for a BaseNode
         * @param {BaseNode} node
         * @return {object}
         */
        getDeepExt: function(node) {
            if (!(node instanceof BaseNode)) {
                return {};
            }
            return _.deepExtendWith(_.merge({}, this.getDeepExt(node.base)), node.deepExt);
        },
        /**
         * get the base constructor for a BaseNode
         * @param {BaseNode} node
         * @return {function(new:object)}
         */
        getBase: function(node) {
            if (!(node.base instanceof BaseNode)) {
                return node.base;
            }
            return this.getBase(node.base);
        },
        /**
         * create a constructor using a BaseNode
         * @param {string} type
         * @param {object} options
         * @return {function(new:object)}
         */
        create: function(type, options) {
            var ret =  this.getBase(cache[type])
                .extend(this.getExt(cache[type]));
            var deepExt = this.getDeepExt(cache[type]);
            if(!_.isEmpty(deepExt)) _.deepExtendBase(ret, deepExt);
            var options = _.extend({}, this.getOptions(cache[type]), options);
            _.each(this.getMixins(cache[type]), function(mixin) {
                ret.mixin(mixin, options);
            });
            return ret;
        },
        getBaseConstructor: function(inputConstructor) {
            return cache[inputConstructor.__name].base.main;
        }
    };

});