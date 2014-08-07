
var typeRfxcom = require('./rfxcomDecoder.json');

function isset (variable) {return (typeof variable != 'undefined');}
function getbit(val,pos) {return (((val<<(7-pos))&0xFF)>>7);}
function str_packetType(data) {
	if (data.exist) return typeRfxcom[data.packetType].name;
	else return typeRfxcom.utype;
}
function str_subType(data) {
	if (data.exist) return typeRfxcom[data.packetType][data.subType];
	else return typeRfxcom.ustype;
}
function str_replace_adv(str,value,unit) {
   str = str.replace(/%v/g,value);
   str = str.replace(/%u/g,unit);
   return str
}
function round(value, precision, mode) {
  var m, f, isHalf, sgn;
  precision |= 0;
  m = Math.pow(10, precision);
  value *= m;
  sgn = (value > 0) | -(value < 0);
  isHalf = value % 1 === 0.5 * sgn;
  f = Math.floor(value);

  if (isHalf) value = f + (sgn > 0);

  return (isHalf ? value : Math.round(value)) / m;
}


function analyse(data) {
   var ret={};
	if (data.exist) {
      for (var key in typeRfxcom[data.packetType].data){
         var datakey =typeRfxcom[data.packetType].data[key];
         var nbyte   =datakey.byte;
         ret[key]={};
         switch(datakey.type) {
            case "direct":
               ret[key].value = data.extra[nbyte];
               ret[key].intdiv = 1;
               if (isset(datakey[data.extra[nbyte]])) ret[key].toString=datakey[data.extra[nbyte]];
               else ret[key].toString = typeRfxcom.udval;
               break;
            case "value":
               var val=0;
               if (!isset(datakey.nbyte)) datakey.nbyte=1;
               if (!isset(datakey.mask)) datakey.mask=255;
               if (!isset(datakey.rdecal)) datakey.rdecal=0;
               if (!isset(datakey.div)) datakey.div=1;
               if (!isset(datakey.value)) datakey.value="%v%u";
               if (!isset(datakey.unit)) datakey.unit="";
               if (!isset(datakey.sign)) datakey.sign=0;
               if (!isset(datakey.signval)) datakey.signval=1;
               
               if (datakey.sign) {
                    datakey.signval=getbit(data.extra[nbyte],7)*-2+1;
                    data.extra[nbyte]=data.extra[nbyte]&0x7F;
               }                
               for (var i=0;i<datakey.nbyte;i++) {
                  val+=(((data.extra[nbyte+i] & datakey.mask) >> datakey.rdecal)*Math.pow(256,datakey.nbyte-i-1))/datakey.div*datakey.signval;
               }
               ret[key].value=round(val,2);
               ret[key].intdiv = datakey.div;               
               ret[key].toString=str_replace_adv(datakey.value,val,datakey.unit);
               break;
            case "bit":
               for (var i=0;i<8;i++) {
                  if (isset(datakey[i])) ret[key][datakey[i]]=getbit(data.extra[nbyte],i);
               }
               ret[key].value=data.extra[nbyte];
               ret[key].intdiv = 1;                 
               break;
         }
      }
   } else ret.unknow=data.raw;
	return ret;
}


function rfxdata(buffraw) {
var self = this;

   self.raw        = buffraw.slice();
   self.length		 = buffraw.shift();
   self.packetType = buffraw.shift();
   self.subType	 = buffraw.shift();
   self.seqNbr		 = buffraw.shift();
   self.extra      = buffraw;
   
   self.exist = isset(typeRfxcom[self.packetType]);
   if (self.exist) self.exist = (self.length==typeRfxcom[self.packetType].length);
   if (self.exist) self.exist = isset(typeRfxcom[self.packetType][self.subType]);
   
	self.str_packetType = str_packetType(self);
	self.str_subType    = str_subType(self);
	self.analyse        = analyse(self);
	self.toString = function () {
		return self.str_packetType+':'+self.str_subType+':'+JSON.stringify(self.analyse,null, 4);
	};
	
}
exports.decode = function(buffraw) {return new rfxdata(buffraw);};
exports.typeRfxcom = typeRfxcom;
