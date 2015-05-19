# Example with mixins and overrides

## Demo

<div class="clear"></div>
<div class="left">
	In the example, we create a sub-class of a constructor, override its properties and add a mixin to it.
</div>
<iframe src="../resources/demos/demo2.html" class="demo-frame" style="height:300px"></iframe>

<div class="clear"></div>

## Code


<div class="spacer"></div>
<div class="left">
Define our base class
</div>

```javascript
    // Define our base class
    var base = AdviceFactory.register('viewBase', {
        base: Backbone.View,
        el: '#instance1',
        name: 'Mr. Moo',
        events: {
            "click": "speak"
        },
        speak: function() {
            alert('Hi, my name is ' + this.name);
        }
    });
```

<div class="clear"></div>
<div class="left">
    Define our simple mixin that adds/removes a class on hover
</div>

```javascript
 var addClassOnHover = function(mixinOptions) {
         this.addToObj({
             events: {
                 "mouseover": function() {
                     this.$el.addClass('highlighted');
                 },
                 "mouseleave": function() {
                     this.$el.removeClass('highlighted');
                 }
             }
         });
     };
```

<div class="clear"></div>
<div class="left">
   Create a sub-class that inherits from our base class. Override the name property and add the mixin.
</div>

```javascript
    var extendedBase = AdviceFactory.register('extendedViewBase', {
        base: 'viewBase',
        // Override the name of the class
        name: 'Ms. Meow',
        el: '#instance2',
        mixins: [
            addClassOnHover
        ]
    });
```