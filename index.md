<div class="project-header">
    <div class="project-name">Backbone.AdviceFactory</div>
    <div class="intro">
         Advice factory provides an interface to apply advice onto object constructors. It allows you to write to and instantiate from a cache of constructors using a namespace. Allows for creating new constructors from previously cached base constructors.
    </div>
</div>

## Source ##

Read the annotated source <a href="backbone-advicefactory.js.html" target="_blank">here</a>


<div class="clear"></div>
<div class="spacer"></div>

## Overview ##
<div class="left">
When mixing inheritance models (Backbone's extends and Advice's mixins) there are often cases when you may overwrite mixins unintentionally. Backbone.AdviceFactory helps set up the inheritance the way you want it to work.
         For instance you may extend "initialize" in a latter class that will not only override the former "initialize" method but also all the other mixins that were put on that function. To prevent this happenning
         Backbone.AdviceFactory allows you to setup an inheritance structure that will compose all the extends THEN all the mixins together for that level rather than trying to just extend a constructor that already has mixins put on.
</div>

<div class="clear"></div>

## Examples ##
<a href="docs/basic.md.html">Basic example</a>
<div class="clear"></div>
<a href="docs/simple-backbone.md.html">Simple example with a Backbone app</a>
<div class="clear"></div>
<a href="docs/complex-backbone.md.html">Complex example with a Backbone app</a>
<div class="clear"></div>

## API ##

### before ###
Functions are run before any functions that already exist with the same name.
#### addAdvice(object) ####
- `object` - [_Object_] the object to add _Advice_ to

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
```
After running this code, all subsequent methods will be available on the object.

### around ###
Will call the new functions around the existing ones
#### around(method, function) ####
- `method` - [_String_] the name of the object's function to attach your method.
- `function` - [_Function (originalFunction, arguments)_] the function to call around the original method

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.around('doSomething', function(originalFunction, val) {
    console.log("Running before doSomething() with " + val);
    originalFunction(val);
	console.log("Running after doSomething() with " + val);
});
```

#### around(methods) ####
- `methods` - [_Object_] an object with keys corresponding to named functions with the object, and values which contain the function to attach to each named function

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.around({
	'doSomething': function(originalFunction, val) {
    	console.log("Running before doSomething() with " + val);
    	originalFunction(val);
		console.log("Running after doSomething() with " + val);
	}
});
```
### before ###
Will call the new function before the old one with same arguments
#### before(method, function) ####
- `method` - [_String_] the name of the object's function to attach your method.
- `function` - [_Function (arguments)_] the function to call prior to calling the original method

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.before('doSomething', function(val) {
    console.log("Running before doSomething() with " + val);
});
```

#### before(methods) ####
- `methods` - [_Object_] an object with keys corresponding to named functions with the object, and values which contain the function to attach to each named function

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.before({
    'doSomething': function(val) {
        console.log("Running before doSomething() with " + val);
    }
});
```
### after ###
Will call the new function after the old one with same arguments
#### after(method, function) ####
- `method` - [_String_] the name of the object's function to attach your method.
- `function` - [_Function (arguments)_] the function to call prior to calling the original method

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.after('doSomething', function(val) {
    console.log("Running after doSomething() with " + val);
});
```

#### after(methods) ####
- `methods` - [_Object_] an object with keys corresponding to named functions with the object, and values which contain the function to attach to each named function

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.after({
    'doSomething': function(val) {
        console.log("Running after doSomething() with " + val);
    }
});
```
### clobber ###
Override properties on an object with new values
#### clobber(method, function) ####
- `key` - [_String_] the name of the object's property to override
- `value` - [_Anything_] the value to set the property to

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.clobber('doSomething', function(val) {
    console.log("Running instead of usual doSomething() with " + val);
});
```

#### clobber(keys) ####
- `keys` - [_keys_] an object with keys corresponding to the object's properties to override

Example:
```
var myObject = {
    'doSomething': function(val) {
        console.log("Running doSomething() with " + val);
    }
};
Advice.addAdvice(myObject);
myObject.clobber({
    'doSomething': function(val) {
        console.log("Running instead of usual doSomething() with " + val);
    }
);
```
### addToObj ###
will extend all key-values in a the base object, given another objects key-values
#### addToObj(keys) ####
- `keys` - [_Object_] an object with keys corresponding to the object's properties to extend

Example:
```
var myObject = {
    'property': {
        'score': 1
    }
};
Advice.addAdvice(myObject);
myObject.addToObj({
    'property': {
        'rank': 2
    }
);
```
After running this code, `myObject` will be:
```
{
    'property': {
        'score': 1,
        'rank': 2
    }
};
```
### setDefaults ###
Acts like a guarded extend. Will only set the given key-values on the base if they don't already exist
#### setDefaults(keys) ####
- `keys` - [_Object_] an object with keys corresponding to the object's for which to set defaults

Example:
```
var myObject = {
    'property': {
        'score': 1
    }
};
Advice.addAdvice(myObject);
myObject.setDefaults({
    'property': {
        'score': 3
    },
    'enabled': true
);
```
After running this code, `myObject` will be:
```
{
    'property': {
        'score': 1
    },
    'enabled': true
}
```
### findVal ###
Utility function for finding a value in a prototype chain
#### findVal(key) ####
- `key` - [_String_] the name of the property to search for
Example:
```
var myObject = {
    'property': {
        'score': 1
    }
};
Advice.addAdvice(myObject);
myObject = myObject.findVal('property');
```
After running this code, `myObject` will be:
```
{
    'score': 1
}
```

## Usage ##
<div class="left">
There are a number of ways of adding advice to an object. But first, one must add the advice API to a given object class.
</div>

```javascript
Advice.addAdvice(recipientOfAdvice);
```

<div class="clear"></div>
