var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var app = express();
var db;

app.use(express.static('static'));

/* Get a list of filtered records */
app.get('/api/datas', function(req, res) {
  console.log("Query HI", req.query);
  db.collection("datas").find().toArray(function(err, docs) {
    res.json(docs);
  });
});

app.use(bodyParser.json());

/* Insert a record */
app.post('/api/datas/', function(req, res) {
  console.log("Req body:", req.body);
  var newData = req.body;
  db.collection("datas").insertOne(newData, function(err, result) {
    var newId = result.insertedId;
    db.collection("datas").find({_id: newId}).next(function(err, doc) {
      res.json(doc);
    });
  });
});

/* Get a single record */
app.get('/api/datas/:id', function(req, res) {
  db.collection("datas").findOne({_id: ObjectId(req.params.id)}, function(err, data) {
    res.json(data);
  });
});

/* Modify one record, given its ID */
app.put('/api/datas/:id', function(req, res) {
  var data = req.body;
  console.log("Modifying data:", req.params.id, data);
  var oid = ObjectId(req.params.id);
  db.collection("datas").updateOne({_id: oid}, data, function(err, result) {
    db.collection("datas").find({_id: oid}).next(function(err, doc) {
      res.send(doc);
    });
  });
});

app.delete('/api/datas/:id', function(req, res) {
  var data = req.body;
  console.log("Deleting data:", req.params.id, data);
  var oid = ObjectId(req.params.id);
  db.collection("datas").remove({_id: oid}, data, function(err, result) {
    db.collection("datas").find({_id: oid}).next(function(err, doc) {
      res.send(doc);
    });
  });
});



MongoClient.connect('mongodb://localhost/datasdb', function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(3000, function() {
	  var port = server.address().port;
	  console.log("Started server at port", port);
  });
});
