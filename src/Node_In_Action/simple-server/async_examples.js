// sets timeout
function asyncFunction(callback) {
    setTimeout(callback, 200);
}

// set color to blue
var color = 'blue';

// calls func after timeout
asyncFunction(function() {
    console.log('The color is ' + color);
});

// sets color to green
color = 'green';

// flow-control w. nimble
var flow = require('nimble');

flow.series([
    function(callback) {
        setTimeout(function() {
            console.log('I execute first.');
            callback();
        }, 1000);
    },
    function(callback) {
        setTimeout(function() {
            console.log('I execute next.');
            callback();
        }, 500);
    },
    function (callback) {
        setTimeout(function() {
            console.log('I execute last.');
            callback();
        }, 100);
    }
]);

