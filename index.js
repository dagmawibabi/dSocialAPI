let express = require('express');
let app = express();

//! Config
let PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})


//! Globals
let messages = [
    { from: '1', to: '2', message: "How are you" },
    { from: '2', to: '1', message: "I'm fine" },
    { from: '3', to: '4', message: "Hello Fam" },
    { from: '4', to: '3', message: "Sup Bro" },
];

let requests = [];

//! Routes
// Intro
app.get('/ds/', (req, res) => {
    res.send("Hello!");
})

// Send Messages
app.get('/ds/sendMessage/:from/:to/:message', (req, res) => {
    let messageOBj = {
        from: req.params.from,
        to: req.params.to,
        message: req.params.message,
    }
    messages.push(messageOBj);
    console.log(messages);
    res.send("Message sent");
})

// Get Messages
app.get('/ds/getMessages/:user1/:user2', (req, res) => {
    let result = [];
    for( i of messages){
        if (i['from'] == req.params.user1 && i['to'] == req.params.user2 ){
            result.push(i);
        }
        if (i['from'] == req.params.user2 && i['to'] == req.params.user1 ){
            result.push(i);
        }
    }
    res.send(result);
})


//!
app.get('/ds/giveData/:userID/:data', (req, res) => {
    for(i of requests){
        if (i['requestedFrom'] == req.params.userID){
            i['result'] = req.params.data
        }
    }
    res.send('given');
})

app.get('/ds/requestData/:userID/:fromID', (req, res) => {
    // for(let i = 0; i < requests.length; i++){
    //     if (requests[i]['isSent'] == true){
    //         delete requests[i];
    //     }
    // }
    let requestObj = {
        'requestedBy': req.params.userID,
        'requestedFrom': req.params.fromID,
        'result': '',
        'isSent': false,
    };
    let notExist = true;
    for(i of requests){
        if (i['requestedBy'] == req.params.userID && i['requestedFrom'] == req.params.fromID){
            notExist = false;
        }
    }

    let response = '';
    if(notExist){
        requests.push(requestObj);
        response = 'request added';
    } else {
        for(let i = 0; i < requests.length; i++){
            if (requests[i]['requestedBy'] == req.params.userID && requests[i]['requestedFrom'] == req.params.fromID){
                if(requests[i]['result'] != ''){
                    response = JSON.stringify(requests[i]['result']);
                    requests[i]['isSent'] = true;
                } else {
                    response = 'no peer yet';
                }
            }
        }        
    }
    console.log(requests);
    res.send(response);
})
