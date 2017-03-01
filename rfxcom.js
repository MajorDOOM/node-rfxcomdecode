var SerialPort = require("serialport");
var EventEmitter = require('events').EventEmitter;
var Decoder = require('./rfxcomDecoder.js');
var util = require('util');
var data = [];

function rfxcom() {
	var self = this;
	self._cmnd = 0;
    self.rfxtrxParser = function() {
		return function(emitter, buffer) {
            data.push.apply(data, buffer);
            while (data.length >= (data[0] + 1)) {
               emitter.emit("data", data.slice(0, data[0] + 1));
               data = data.slice(data[0] + 1);
               if (data[0]<5) { 
                  data = [];
                  break;
               }
            }
		};
    };
	rfxcom.prototype.reset = function(ms) {
		self.emit("status","reset");
		return self.sendMessage(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	};
	rfxcom.prototype.flush = function() {
		self.emit("status","flush");
		self.serialport.flush(function(error) {});
		data = [];
	};
	rfxcom.prototype.getStatus = function() {
		self.emit("status","status");
		return self.sendMessage(0, 0, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	};
	rfxcom.prototype.initialize = function(ms) {
		self.reset();
		setInterval(function() {
			self.flush();
			self.getStatus();
		clearInterval(this);},500);
	};	
	rfxcom.prototype.getCmndNumber = function() {
		if (self._cmnd > 256) self._cmnd = 0;
		return self._cmnd++;
	};	
	rfxcom.prototype.readMessage = function(data) {
		var deco=Decoder.decode(data);
		self.emit("data", deco);
	};
	rfxcom.prototype.sendMessage = function(type, subtype, extra) {
		cmdId = self.getCmndNumber();
		var buffertmp = [extra.length + 3,	type, subtype, cmdId];
		buffertmp=buffertmp.concat(extra);
		self.serialport.write(buffertmp);
		return cmdId;
	};	
	rfxcom.prototype.open = function (serialport) {
		self.serialport = new SerialPort(serialport, {
			baudrate: 38400,
			autoOpen:false,
			parser: self.rfxtrxParser()
		});
		self.serialport.on("open", function() {
			self.emit("open");
			self.initialize();
		});
		self.serialport.on("data", function(data) {
			self.emit("raw", data);
			self.readMessage(data);
		});
		self.serialport.on("error", function(data) {
			self.emit("error",data);
		});
		self.serialport.on("end", function() {
			self.emit("end");
		});
      setInterval(function() {
         self.serialport.open();
         clearInterval(this);},500);      
		
	};

}



util.inherits(rfxcom, EventEmitter);
module.exports = new rfxcom();
