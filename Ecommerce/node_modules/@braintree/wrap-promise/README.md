# wrap-promise

Small module to help support APIs that return a promise or use a callback.

### Example

```js
// my-method.js
var wrapPromise = require("wrap-promise");

function myMethod(arg) {
  return new Promise(function (resolve, reject) {
    doSomethingAsync(arg, function (err, response) {
      if (err) {
        reject(err);
        return;
      }

      resolve(response);
    });
  });
}

module.exports = wrapPromise(myMethod);

// my-app.js
var myMethod = require("./my-method");

myMethod("foo")
  .then(function (response) {
    // do something with response
  })
  .catch(function (err) {
    // handle error
  });

myMethod("foo", function (err, response) {
  if (err) {
    // handle error
    return;
  }

  // do something with response
});
```

### Wrap All Methods on the Prototype

```js
function MyObject() {}

MyObject.prototype.myAsyncMethod = function () {
  return new Promise(function (resolve, reject) {
    //
  });
};

MyObject.prototype.myOtherAsyncMethod = function () {
  return new Promise(function (resolve, reject) {
    //
  });
};

module.exports = wrapPromise.wrapPrototype(MyObject);
```

Static methods, sync methods on the prototype (though if you pass a function as the last argument of your sync method, you will get an error), and non-function properties on the prototype are ignored.

If there are certain methods you want ignored, you can pass an `ignoreMethods` array.

```js
module.exports = wrapPromise.wrapPrototype(MyObject, {
  ignoreMethods: ["myMethodOnThePrototypeIDoNotWantTransformed"],
});
```

By default, `wrapPrototype` ignores methods that begin with an underscore. You can override this behavior by passing: `transformPrivateMethods: true`

```js
module.exports = wrapPromise.wrapPrototype(MyObject, {
  transformPrivateMethods: true,
});
```
