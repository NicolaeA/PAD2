var net = require('net');
var JsonSocket = require('json-socket');
var validator = require('xsd-schema-validator');
var Validator = require('jsonschema').Validator;
var v = new Validator();
var path = require('path');
var fs = require('fs');
const args = process.argv;
var messageFormat = args[2];
var dictionary = {"command":messageFormat, "methode":args[3], "field":args[4]};

var client = new JsonSocket(new net.Socket());
client.connect(6512, '127.0.0.1', function() {
    console.log('Connected');
    console.log(JSON.stringify(dictionary))
    client.sendMessage(dictionary);
    console.log("Sent to proxy: " + JSON.stringify(dictionary));
});

client.on('message', function(data) {
    if(messageFormat === "sendxml"){
        console.log(data);
        validator.validateXML(data, 'C:/Users/nicol/Desktop/lab2PAD-master/xmlSchema/angajati.xsd',function (err, result) {
            if(err){
                throw err;
            }
            console.log("Xml validating: " + result.valid);
        });
    }else if(messageFormat === "sendjson"){
        var schema = JSON.parse(fs.readFileSync('C:/Users/nicol/Desktop/lab2PAD-master/xmlSchema/jsonSchema.json', 'utf-8'));

        console.log(schema);
        console.log(data);
        var result = v.validate(data, schema);
        console.log("Validated: " + result.valid);
    }

});

client.on('close', function() {
    console.log('Connection closed');
});