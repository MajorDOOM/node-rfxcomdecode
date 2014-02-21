node-rfxcomdecode
=================

Thanks to Kevin McDermott [bigkevmcd](https://github.com/bigkevmcd) for the intial project node-rfxcom

How to Use
==========

rfxcom depends on the serialport module.

To install
----------

<pre>
  npm install rfxcomdeceode
</pre>

The only dependency is serialport 1.0.6+.

To Use
------

<pre>
	var rfxcom = require("rfxcomdecode");
	
	rfxcom.on("open", function () {
	  rfxcom.on('data', function(data) {
		  console.log('[RFXCOM] Data : ' + data.toString());
	  });
	});
	rfxcom.on("close", function () {
		 console.log('[RFXCOM] Closed');
	});
	rfxcom.on("end", function () {
		 console.log('[RFXCOM] Connection close');
	});	
	rfxcom.on("error", function (data) {
		 console.log('[RFXCOM] Error : '+data);
	});
	rfxcom.on("status", function (data) {
		 console.log('[RFXCOM] Status : '+data);
	});
	rfxcom.on("raw", function (data) {
		 console.log('[RFXCOM] RAW : '+data);
	});	
	rfxcom.open('/dev/ttyUSB0');
</pre>
