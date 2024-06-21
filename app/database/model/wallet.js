var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var WalletSchema = new Schema({
	address :{ type: String, index:true},
	balance : {type: Number, default : 0},
  label : {type : String, default : ""}
});

var Wallet = mongoose.model('Wallet', WalletSchema);
const WALLET_FIELD_MAP = {
		address : "address",
		balance : "balance",
    label : "label"
}

module.exports = {Wallet, WALLET_FIELD_MAP}
