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
AdviceFactory is built on top of <a href="http://dataminr.github.io/advice" target="_blank">Advice</a>. It supports all the advice keywords and provides a safe, easy framework for composition and inheritance using advice.

When mixing inheritance models (Backbone's extends and Advice's mixins) there are often cases when you may overwrite mixins unintentionally. Backbone.AdviceFactory helps set up the inheritance the way you want it to work.

For instance you may extend "initialize" in a latter class that will not only override the former "initialize" method but also all the other mixins that were put on that function. To prevent this happening 
Backbone.AdviceFactory allows you to setup an inheritance structure that will compose all the extends THEN all the mixins together for that level rather than trying to just extend a constructor that already has mixins put on.

</div>

<div class="clear"></div>

## Examples ##
<a href="examples/example1.md.html">Basic example</a>
<div class="clear"></div>
<a href="examples/example2.md.html">Example with overrides and mixins</a>
<div class="clear"></div>

## API ##

The Backbone.AdviceFactory register

| Type      |  Behavior  |
| ------------ | ------------------------------------------------------------------------------------------- |
| register    | Registers a constructor using a namespace |
| inst       |  Returns an instance of a the given constructor namespace |
| get   |  Returns a constructor using a constructor namespace |
| getMixinsForType    |  Returns an array of mixins for a given constructor namespace |


#### register ####

Registers a constructor using a namespace. The second argument is the options object. This object can contain any of the [advice](http://dataminr.github.io/advice) keywords. 

*Note:* The method is smart about applying properties and methods that are not contained in an advice keyword. By default, all such methods will be applied as 'after's and all such properties will replace
ones that already exist on the base constructor.

In addition the register method options object has the following reserved keys:

| Keyword      |  Behavior  |
| ------------ | ------------------------------------------------------------------------------------------- |
| base    | the constructor to be used as the base for extension |
| mixins    | Array of mixins to be applied on the constructor |
| mixinOptions       |  Mixin options that are passed to the constructor |
| extend   |  extends the constructor with the given object |
| deepExtend    |  deep extends the constructor with the given object |

*Note:* Mixins are applied after the options object is used to extend the constructor. 

Example:
```
// Register the constructor using a namespace
Factory.register('MyConstructorName', {
	// Property is replaced on base constructor
	myProperty: "foo",
	
	// Method applied as an after on the constructor
	myMethod: function() {
		console.log(this, ' is me');
	},
	
	// Mixins applied on the constructor
	mixins: [
		function(mixinOptions) {
			// my mixin
		}
	],
	// Passed to all mixins in the 'mixins' keyword
	mixinOptions: {
		myOption1: 1,
		myOption2: "my other option"
	}
	
	// Extends the base constructor
	extend: {
		myProp1: 1
	},
	
	// Deep extends the base constructor
	deepExtend: {
		foo: {
			bar: 1
		}
	}
});
```

#### inst ####

Returns an instance of a the given constructor namespace

```javascript

	// Instantiate it using the same namespace
    
    var myInstance = Factory.inst('MyConstructorName');
    myInstance.myMethod(); // logs: object is me;

```

#### get ####

Gets the constructor given a namespace

```javascript

	// Get the constructor for the namespace 'myConstructorName'
    var myConstructor = Factory.get('myConstructorName');
    
    var inst = new myConstructor();

```

#### getMixinsForType ####

Gets the mixins associated with a given constructor namespace

```javascript

	// Get the mixins for the namespace 'myConstructorName'
    var mixins = Factory.getMixinsFprType('myConstructorName');
    
```