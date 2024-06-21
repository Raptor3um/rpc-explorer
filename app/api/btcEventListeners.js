const zmq = require('zeromq');
const Bitcore = require('bitcore-lib');
const Dashcore = require('@dashevo/dashcore-lib');
const DaemonUtils = require('./DaemonUtils.js');
const utils = require("./../utils.js");
class BTCEventListener {
  constructor(config) {
    this.coreApi = config.coreApi;
    this.socket = new zmq.Subscriber();
    this.socket.connect(`tcp://${config.ip}:${config.zmq_port}`);
    this.socket.subscribe("rawblock");
    //this.socket.subscribe("hashblock");
		//this.socket.subscribe("rawtx");
    //this.socket.subscribe("hashtx");
    this.network = Bitcore.Networks.add(config.network);
    this.btcjsNetwork = config.network;
    this.masternodeSupported = config.masternodeSupported;

    console.log(`tcp://${config.ip}:${config.zmq_port} connected`)
  }
  async listen() {
    for await (const [topic, msg] of this.socket) {
      this.processMsg(topic, msg);
   }
  }
  processMsg(topic, message) {
    var type = topic.toString();
    console.log("type=", type);
		if(type === 'rawtx') {
      if(this.masternodeSupported) {
        var tx = Dashcore.Transaction(message.toString('hex'));
        //console.log(tx);
      } else {
        var tx = DaemonUtils.TxDecoder(message, this.btcjsNetwork.bitcoinjs);
        console.dir(tx, { depth: null });
      }
      // var tx = Bitcore.Transaction(message.toString('hex'));
      // for(var i in tx.outputs) {
      //   try {
      //
      //     var script =  new Bitcore.Script(tx.outputs[i].script);
      //     var scriptAddress = new Bitcore.Address(tx.outputs[i].script, this.network, "scripthash");
      //     console.log("script=%s", script.toString());
      //     console.log("address=%s", scriptAddress.toString());
      //     if(script.isPublicKeyOut()) {
      //       console.log("pubkey out = %s", script.getPublicKey());
      //       var address = new Bitcore.Address(script.getPublicKey(), this.network, "pubkeyhash");
      //       console.log("address=%s", address);
      //     }
      //     if(script.isPublicKeyIn()) {
      //       console.log("pubkey = %s", script.getPublicKey());
      //     }
      //   } catch(err) {
      //     console.log(err);
      //   }
      // }
		//	console.log("tx=%O",tx.toObject());
    } else if(type === 'rawblock') {
      global.blockchainSync.syncAddressBalance().then(result => {
    		console.log("addresss balance ", result);
    	}).catch(err => {
    		utils.logError("32ugegdfsde", err);
    	});
    }
  }
}

module.exports = BTCEventListener;
