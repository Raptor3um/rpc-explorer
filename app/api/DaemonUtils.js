const bitcoinjs = require('ravenassetjs-lib');
const Dashcore = require('@dashevo/dashcore-lib');
const payments = bitcoinjs.payments;
const isP2MS = isPaymentFactory(payments.p2ms);
const isP2PK = isPaymentFactory(payments.p2pk);
const isP2PKH = isPaymentFactory(payments.p2pkh);
const isP2WPKH = isPaymentFactory(payments.p2wpkh);
const isP2WSHScript = isPaymentFactory(payments.p2wsh);
function isPaymentFactory(payment) {
  return script => {
    try {
      payment({ output: script });
      return true;
    } catch (err) {
      return false;
    }
  };
}
module.exports = {
  classifyScript : function(script) {
    if (isP2WPKH(script)) return 'witnesspubkeyhash';
    if (isP2PKH(script)) return 'pubkeyhash';
    if (isP2MS(script)) return 'multisig';
    if (isP2PK(script)) return 'pubkey';
    return 'nonstandard';
  },
  decodeFormat : function(tx){
    var result = {
        txid: tx.getId(),
        version: tx.version,
        locktime: tx.locktime,
    };
    return result;
  },
  decodeInput : function(tx) {
    var result = [];
    tx.ins.forEach(function(input, n){
        var vin = {
            txid: input.hash.reverse().toString('hex'),
            n : input.index,
            script: bitcoinjs.script.toASM(input.script),
            sequence: input.sequence,
        }
        result.push(vin);
    })
    return result;
  },
  formatOutputs : function(out, n, network){
      var vout = {
          satoshi: out.value,
          value: (1e-8 * out.value).toFixed(8),
          n: n,
          scriptPubKey: {
              asm: bitcoinjs.script.toASM(out.script),
              hex: out.script.toString('hex'),
              type: this.classifyScript(out.script),
              addresses: [],
          },
      };
      switch(vout.scriptPubKey.type){
      case 'pubkeyhash':
      case 'scripthash':
          vout.scriptPubKey.addresses.push(bitcoinjs.address.fromOutputScript(out.script, network));
          break;
      }
      return vout;
  },
  decodeOutput : function(tx, network) {
    var result = [];
    var self = this;
    tx.outs.forEach((out, n) => {
        result.push(self.formatOutputs(out, n, network));
    });
    return result;
  },
  TxDecoder  : function(rawtx, network) {
    var result = {};
    result.tx = bitcoinjs.Transaction.fromHex(rawtx);
    //console.log("result.tx=%O",result.tx);
    result.network = network;
    result.format = this.decodeFormat(result.tx);
    result.inputs = this.decodeInput(result.tx);
    result.outputs = this.decodeOutput(result.tx, network);
    return result;
  },

  decode : function(rawtx, network) {
    var txDecoded = this.TxDecoder(rawtx, network);
    var result = {};
    Object.keys(txDecoded.format).forEach(function(key){
        result[key] = txDecoded.format[key]
    })
    result.outputs = txDecoded.outputs
    return result;
  }
}
