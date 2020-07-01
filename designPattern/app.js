var Broadcaster = require('./broadcaster');
var Listener = require('./listener');


var event = new Broadcaster('Holidays');

var a = new Listener("a");
var b = new Listener("b");
var c = new Listener("c");
var d = new Listener("d");
var e = new Listener("e");

event.subscribe(a);
event.subscribe(b);
event.subscribe(c);
event.subscribe(d);
event.subscribe(e);

event.post("New Year");