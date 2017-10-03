(function () {
    Array.prototype.remove = function (obj) {
        do {
            var index = this.indexOf(obj);
            if (index > -1) this.splice(index, 1);
        } while (index > -1);
    };
})();

var Helper = (function () {
    var helper = {};
    helper.isFunction = function (testing) {
        var getType = {};
        return testing && getType.toString.call(testing) === '[object Function]';
    };

    return helper;
})();