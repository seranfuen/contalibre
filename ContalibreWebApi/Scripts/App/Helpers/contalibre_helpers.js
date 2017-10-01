(function () {
    Array.prototype.remove = function (obj) {
        do {
            var index = this.indexOf(obj);
            if (index > -1) this.splice(index, 1);
        } while (index > -1);
    };
})();