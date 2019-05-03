const assert = require('chai').assert;
//const sayHello = require('../app').sayHello;
//const addNumbers = require('../app').addNumbers;
const app = require('../app');
sayHelloResult = app.sayHello();
addNumbersResult = app.addNumbers(5,4);

describe('App', function () {
    describe('sayHello()', function () {
        it('app should return hello', function () {
            //let result = sayHello();
            assert.equal(sayHelloResult, 'hello');
        });

        it('sayHello should return type string', function () {
            //let result = sayHello();
            assert.typeOf(sayHelloResult, 'string');
        });
    });
   describe('addNumbers()', function () {
       it('addNumbers should return the total', function () {
           //let result = addNumbers(4,3);
           assert.equal(addNumbersResult, 9)
       });

       it('addNumbers should return type integer', function () {
           //let result = addNumbers(4,3);
           assert.typeOf(addNumbersResult, 'number')
       });
   });
})

