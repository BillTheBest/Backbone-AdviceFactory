# Backbone Advice-Factory #

Advice factory provides an interface to apply advice onto object constructors. It writes to and instantiate from a cache of constructors using a namespace and allows for creating new constructors from previously cached bases.

# Website #

Visit the [website](http://dataminr.github.io/Backbone-AdviceFactory) for API docs and examples

# Development #

## Tests and Coverage ##

To run tests

```javascript
grunt test
```

To run tests and generate a coverage report in the browser:

```javascript
grunt karmaTests
```

## Documentation ##
To generate documentation from source code:

```javascript
grunt docs
```
When satisfied with docs generated, commit your changes.

To create a gh-pages branch:

```javascript
grunt publishDocs
```