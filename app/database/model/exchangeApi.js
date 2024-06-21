var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var ExchangeApiSchema = new Schema({
	name :{ type: String, index:true},
  website : {type : String, default: ""},
	market_api : {type: String, default : ""},
  market_info_field : {type : String, default: "ticker"},
  pair_separator : {type : String, default: ""},
  last_price_field : {type : String, default : "last"},
  ticker_volume_field : {type: String, default : "vol"},
  to_ticker_volume_field : {type: String, default : "volume"},
  price_change_field : {type: String, default: "price_change_percent"}
});

var ExchangeApi = mongoose.model('ExchangeApi', ExchangeApiSchema);
const EXCHANGE_API_FIELD_MAP = {
		name : "name",
    website : "website",
    market_api : "market_api",
    market_info_field : "market_info_field",
    pair_separator : "pair_separator",
    last_price_field : "last_price_field",
    ticker_volume_field : "ticker_volume_field",
    to_ticker_volume_field : "to_ticker_volume_field",
    price_change_field : "price_change_field",
}

module.exports = {ExchangeApi, EXCHANGE_API_FIELD_MAP}
