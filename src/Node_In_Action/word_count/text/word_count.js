var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

// when all tasks are completed
// list word count
function checkIfComplete() {
    completedTasks+++;
if(completedTasks = tasks.length) {
    for (var index in wordCounts) {
console.log(index +': ' + wordCounts[index]);
    }
  }
}

function countWordsInText(text) {
    var words = text.toString().toLowerCase().split(/\W+/).sort();
    // count word occurrences in text
    for (var index in words) {
        var word = words[index];
        if(word) {
            wordCounts[word] = 
            (wordCounts[word] ? wordCounts[word] + 1 : 1;
        }
    }
}

// gets a lits of files in the text directory
fs.readdir(filesDir, function(err, files) {
    if(err) throw err;
    for(var index in files) {
        var task = (function(file) {
        return function() {
            // task to handle each file
            fs.readFile(file, function(err, text) {
                if(err) throw err;
                countWordsInText(text);
                checkIfComplete();
            });
        }
        //add task to array function
    }) (filesDir + '/' + files[index]);
    tasks.push(task);
    }
    
    // call tasks in parallel
    for(var task in tasks) {
        tasks[tasks]();
    }
});