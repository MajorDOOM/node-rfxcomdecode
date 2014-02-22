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
	rfxcom.on("error", function (err) {
		 console.log('[RFXCOM] Error : '+err);
	});
	rfxcom.on("status", function (info) {
		 console.log('[RFXCOM] Status : '+info);
	});
	rfxcom.on("raw", function (rawdata) {
		 console.log('[RFXCOM] RAW : '+rawdata);
	});	
	rfxcom.open('/dev/ttyUSB0');
</pre>

data variable of data events
----------------------------

rfxcomdata
   .raw       
   .length		
   .packetType
   .subType	 
   .seqNbr		
   .extra     
   .exist
   .str_packetType 
   .str_subType    
   .analyse 
       .variable1:{toString:"",value:""},
       .variable2:{toString:"",value:""},
       ...
   .toString()

raw variable of raw events
----------------------------

raw is an array of each raw data byte
   .raw       
   .length		
   .packetType
   .subType	 
   .seqNbr		
   .extra     
   .exist
   .str_packetType 
   .str_subType    
   .analyse 
       .variable1:{toString:"",value:""},
       .variable2:{toString:"",value:""},
       ...
   .toString()
