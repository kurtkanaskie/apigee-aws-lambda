var AWS = require('aws-sdk');
var apigee = require('apigee-access');
var http = require('http');
var lambda = null;

console.log('node.js application starting...');
var mapping = [];
mapping["GET/status"] = "get-pingstatus-status";
mapping["POST/status"] = "post-pingstatus-status";

var server = http.createServer(function (request, resp) {
    console.log( "\nREQUEST");
    var accessKeyId = apigee.getVariable(request, 'private.accessKeyId');
    var secretAccessKey = apigee.getVariable(request, 'private.secretAccessKey');
    var region = apigee.getVariable(request, 'private.region');
    var requestPayload = apigee.getVariable(request, 'request.content');


    if(!lambda){
        lambda = new AWS.Lambda({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: region});
    }

    var functionName = mapping[request.method+request.url];
    console.log( "Mapped " + request.method+request.url + " To " + functionName);

    resp.setHeader('Content-Type', 'application/json');
    if( request.method === "GET" && request.url === '/ping' ) {
        resp.end(JSON.stringify({'status':'OK','message':'PONG'}));
    } else if( functionName === undefined ) {
        resp.statusCode = 500;
        resp.statusMessage = "Internal Server Error";
        resp.end(JSON.stringify({'error':'NoFunctionMapping','message':'Mapping function not found for path'}));
    } else {
        var params = {
            FunctionName: functionName,
            InvocationType: 'RequestResponse',
            LogType: 'Tail',
            Payload: requestPayload
        };
        console.log( "Params " + JSON.stringify(params));
        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log( "ERR " + err.toString());
                var errorSegs = err.toString().split(':');
                var errorMsg = { 'error':errorSegs[0].trim(), 'message':errorSegs[1].trim() };
                resp.statusCode = 500;
                resp.statusMessage = "Internal Server Error";
                resp.end(JSON.stringify(errorMsg));
            } else {
                resp.end(data.Payload);
            }
        });
    }
});

server.listen(9000, function () {
    console.log('Node HTTP server is listening');
});