var systemLeader = false;

//Object data modelling library for mongo
const mongoose = require('mongoose');

//Mongo db client library
//const MongoClient  = require('mongodb');

//Express web service library
const express = require('express');

//used for the file reader
const fs = require('fs');

//Get the hostname of the node
const os = require('os');

//instance of express and port to use for inbound connections.
const app = express();
const port = 3000;

//bind node to the port
app.listen(port, () => {
  console.log('Express listening at port'  + port);
})

//Get the details of the host
var myhostname = os.hostname();

var nodeID = Math.floor(Math.random() * (100 - 1 + 1) + 1);
//print the hostname
console.log(myhostname);

//Parse the file into a structure
nodeTxtFile = fs.readFileSync('node.txt');
nodes = JSON.parse(nodeTxtFile);

//connection string listing the mongo servers.
const connectionString = 'mongodb://localmongo1:27017,localmongo2:27017,localmongo3:27017/NotFlixDB?replicaSet=rs0';

//tell express to use the body parser. Note - This function was built into express but then moved to a seperate package.
app.use(bodyParser.json());

//connect to the cluster
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

//Schema set up to cater for the data that is needed by the client.
var UserSchema = new Schema({
    AccountID: Number,
    UserName: String,
    TitleID: Number,
    UserAction: String,
    DateAndTime: Date,
    InteractionPoint: String,
    InteractionType: String
  });
  
  var UserActionModel = mongoose.model('UserInteraction', UserSchema, 'userInteraction');
  
  //Send object back for analytics that matches the interaction point / type desired.
  app.get('/', (req, res) => {
      UserActionModel.find({},'interactionPoint interactionType dateAndTime', (err, userInteraction) => {
        if(err) return handleError(err);
        res.send(JSON.stringify(userInteraction))
      }) 
    })
  
  //Save a new user interaction.
  app.post('/',  (req, res) => {
  var newEntry = new userActionModel(req.body);
  newEntry.save(function (err) {
  if (err) res.send('Error');
      res.send(JSON.stringify(req.body))
  });
  })
  
  //End of messege queueing service functions.