# Basic Example

## Demo

<div class="clear"></div>
<div class="left">
	In the example, we create a sub-class of a constructor.
</div>
<iframe src="../resources/demos/demo1.html" class="demo-frame" style="height:300px"></iframe>

<div class="clear"></div>

## Code


<div class="spacer"></div>
<div class="left">
Define our sub-class inheriting from Backbone.View.
</div>

```javascript

 var base = AdviceFactory.register('viewBase', {
        base: Backbone.View,
        name: 'Mr. Moo',
        el: 'body',
        render: function() {
            this.$el.html('<div><button class="speak-btn">Speak</button></div>');
        },
        events: {
            "click .speak-btn": "speak"
        },
        speak: function() {
            alert('Hi, my name is ' + this.name);
        }
    });

```

<div class="clear"></div>
<div class="left">
Create our instance and render it to the page.
</div>

```javascript
    var inst = AdviceFactory.inst('viewBase');
    inst.render();
```