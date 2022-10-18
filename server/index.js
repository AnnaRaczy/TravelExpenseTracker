const express = require("express");
const path = require('path');

const app = express();

const port = 3001

// Have Node serve the files for our built React app 

app.use(express.static(path.resolve(__dirname, '../client/build'))); // to access built React project 
 
app.get('/api', function(req, res){
    res.send('Hello from server')
});

// All other GET requests not handled before will return static React app 
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})
 
app.listen(port, function(){
    console.log(`Listening on port ${port}`);
}); 