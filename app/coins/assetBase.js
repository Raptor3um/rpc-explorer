var Decimal = require("decimal.js");
Decimal8 = Decimal.clone({ precision:8, rounding:8 });
var CoinBase = require("./base.js");
class AssetBase extends CoinBase {
  constructor(name, ticker, priceid, satUnits = ["sat", "satoshi"]) {
    super(name, ticker, priceid, satUnits);
    var self = this;
    this.addProperties({
      assetSupported : true,
    	api : function() {
    		var baseApi = self.coinApi();
    		baseApi.api_map = baseApi.api_map.concat(self.assetApi());
    		return baseApi;
    	}
    });
    this.addTableHeaders({
    	asset_table_headers : [
    		{
    			name : "Name"
    		},
    		{
    			name : "Amount"
    		},
    		{
    			name : "Units"
    		},
    		{
    			name : "Reissuable"
    		},
    		{
    			name : "IPFS Hash"
    		}
    	],
    	asset_address_table_headers : [
    		{
    			name : "Address"
    		},
    		{
    			name : "Balance"
    		}
    	]
    });
  }

  assetApi() {
    return [
      {
        name : "gettotalassetcount",
        uri : "gettotalassetcount",
        api_source : "core",
        method : "getTotalAssetCount",
        description : "Get total assets count",
        "return" : "count of all assets created as number"
      },
      {
        name : "gettotalassetaddresses",
        uri : "gettotalassetaddresses",
        api_source : "core",
        method : "getTotalAssetAddresses",
        description : "Get total addresses count for an specific asset",
        params : [{
          name : "assetname",
          type : "string",
          description : "name of asset"
        }],
        "return" : "count of all addresses that belong to a specified asset name"
      },
      {
        name : "gettotaladdressassets",
        uri : "gettotaladdressassets",
        api_source : "core",
        method : "getTotalAddressAssetBalances",
        description : "Get total assests count for an specific address",
        params : [{
          name : "address",
          type : "string",
          description : "wallet public address"
        }],
        "return" : "count of all assets that belong to a specified address"
      },
      {
        name : "getassetaddresses",
        uri : "getassetaddresses",
        api_source : "getAssetAddresses",
        description : "Get addresses and their balances that belong to an asset",
        params : [
          {
            name : "assetname",
            type: "string",
            description : "asset name to be searched"
          },
          {
            name : "start",
            type : "number",
            description : "Begin row for query result"
          },
          {
            name : "length",
            type : "number",
            description : "max result for the query"
          }],
        "return" : "a map between addresses and its balance"
      },
      {
        name : "queryassets",
        uri : "queryassets",
        api_source : "queryAssets",
        description : "query for assets",
        params : [{
          name : "start",
          type : "number",
          description : "Begin row for query result"
        },
          {
            name : "length",
            type : "number",
            description : "max result for the query"
          },
          {
            name : "search.value",
            type: "object",
            description : "asset name to be searched."
          }],
        "return" : "assets with its information"
      }
    ]
  }
}

module.exports = AssetBase;
