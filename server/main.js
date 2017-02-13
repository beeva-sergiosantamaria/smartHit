var server = require("./server");
var router = require("./routes");
var router = require("./database");
var requestHandlers = require("./requestHandler");

var handle = {}
	handle["/"] = requestHandlers.iniciar;
	handle["/iniciar"] = requestHandlers.iniciar;
	handle["/subir"] = requestHandlers.subir;

server.iniciar(router.route, handle);