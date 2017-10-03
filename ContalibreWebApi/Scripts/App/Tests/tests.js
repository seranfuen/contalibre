// Helper tests
QUnit.test("Remove item from array - not found to remove - array equal", function (assert) {
    var array = ['a', 'b', 'c', 'd'];
    array.remove('e');
    assert.equal(array.length, 4);
});

QUnit.test("Remove item from array - found one - removed", function (assert) {
    var array = ['a', 'b', 'c', 'd'];
    array.remove('c');
    assert.equal(array.length, 3);
    assert.equal(array[1], 'b');
    assert.equal(array[2], 'd');
});

QUnit.test("Remove item from array - found two - removed", function (assert) {
    var array = ['a', 'b', 'c', 'd', 'c'];
    array.remove('c');
    assert.equal(array.length, 3);
    assert.equal(array[1], 'b');
    assert.equal(array[2], 'd');
});

QUnit.test("Remove item from array with callbacks", function (assert) {
    var array = [];
    var func = function () {
        var a = 1;
        return a;
    };
    array.push(func);
    assert.equal(array.length, 1);
    array.remove(func);
    assert.equal(array.length, 0);
});

QUnit.test("Test if function - null passed", function (assert) {
    var test = null;
    assert.notOk(Helper.isFunction(test));
});

QUnit.test("Test if function - int passed", function (assert) {
    var test = 3;
    assert.notOk(Helper.isFunction(test));
});

QUnit.test("Test if function - empty function passed", function (assert) {
    var test = function () { };
    assert.ok(Helper.isFunction(test));
});

QUnit.test("Test if function - function passed", function (assert) {
    var test = function (a) { return a * a; };
    assert.ok(Helper.isFunction(test));
});