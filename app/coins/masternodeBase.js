var Decimal = require("decimal.js");
Decimal8 = Decimal.clone({ precision:8, rounding:8 });
var CoinBase = require("./base.js");
class AssetBase extends CoinBase {
  constructor(name, ticker, priceid, satUnits = ["sat", "satoshi"], masternodeCommand = "masternode") {
    super(name, ticker, priceid, satUnits);
    var self = this;
    this.addProperties({
      masternodeSupported : true,
      isFixedCollateral : true,
      masternodeName: "Masternode",
      masternodeCommand: masternodeCommand,
    	api : function() {
    		var baseApi = self.coinApi();
    		baseApi.api_map = baseApi.api_map.concat(self.masternodeApi());
    		return baseApi;
    	}
    });
    this.addTableHeaders({
    	masternode_table_headers : [
    		{
    			name : "IP"
    		},
        {
    			name : "Status"
    		},
        {
    			name : "Reachable"
    		},
    		{
    			name : "Collateral Address"
    		},
    		{
    			name : "Protx Hash"
    		},
    		{
    			name : "Voting Address"
    		},
    		{
    			name : "Owner Address"
    		},
    		{
    			name : "Payee Address"
    		},
    		{
    			name : "Last Paid Block"
    		},
    		{
    			name : "Last Paid Time"
    		}
    	]
    });
  }

  masternodeApi() {
    return [
      {
        name : this.properties.masternodeCommand,
        uri : this.properties.masternodeCommand,
        api_source : "core",
        method : this.properties.masternodeCommand,
        description : "Execute " + this.properties.masternodeCommand + " action base on given command",
        params : [{
          name : "command",
          type : "string",
          description : `command for ${this.properties.masternodeCommand}. Possible Commands: "count", "list", "current", "winner", and "winners"`
        }],
        "return" : `current network ${this.properties.masternodeCommand} information base on request params`
      }, {
        name : "getNodeList",
        uri : "getnodelist",
        api_source : "getNodeList",
        description : "Get " + this.properties.masternodeCommand + " list",
        "return" : "Json representation of node list that can be display in a html table"
      }, {
        name : "getmasternodecount",
        uri : "getmasternodecount",
        api_source : "getMasternodeCount",
        description : "Get " + this.properties.masternodeCommand + " count",
        "return" : "enabledCount/total"
      }, {
        name : "getmasternodereachablecount",
        uri : "getmasternodereachablecount",
        api_source : "core",
        method : "getMasternodeReachableCount",
        description : "Get " + this.properties.masternodeCommand + " count",
        "return" : "enabledCount/total"
      }, {
        name : "gettotallockedcoins",
        uri : "gettotallockedcoins",
        api_source: "core",
        method : "totalCoinLockedByMN",
        description : "Get total coins that are locked by " + this.properties.masternodeCommand + ".",
        "return" : "Total coin lock value and total lock % in following format. totalLockedValue/% "
      },{
        name : "protx",
        uri : "protx",
        api_source : "core",
        method : "protx",
        description : "protx commands to get information on protx(s)",
        params : [{
          name : "command",
          type : "string",
          description : "Command for ProTxs. Possible Commands: list, info, diff"
        }, {
          name : "protxhash",
          type : "string",
          description : "Required paramenter to use with info command. for example /api/protx?command=info&protxhash=aaaaaaa"
        }, {
          name : "baseblock",
          type : "string",
          description : "Required paramenter to use with diff command. for example /api/protx?command=diff&baseblock=1000&block=2000"
        }, {
          name : "block",
          type : "string",
          description : "Required paramenter to use with diff command. for example /api/protx?command=diff&baseblock=1000&block=2000"
        }],
        "return" : "Protx information base on given command parameter. Possible Commands: list, info, diff"
      }, {
        name : "quorum",
        uri : "quorum",
        api_source : "core",
        method : "quorum",
        description : "quorum commands to get information on quorum(s)",
        params : [{
          name : "command",
          type : "string",
          description : "Command for quorum. Possible Commands: list, info, memberof, isconflicting"
        }, {
          name : "llmqtype",
          type : "number",
          description : "Required paramenter to use with info and isconflicting command. Value usually, 1,2 or 3. For example /api/quorum?command=info&llmqtype=1&quorumhash=aaaaaa"
        }, {
          name : "quorumhash",
          type : "string",
          description : "Required paramenter to use with info command. For example /api/quorum?command=info&llmqtype=1&quorumhash=aaaaaa"
        }, {
          name : "skshare",
          type : "boolean",
          description : "Optional paramenter to use with info command. for example /api/quorum?command=info&llmqtype=1&quorumhash=aaaaa&dkshare=true"
        }, {
          name : "protxhash",
          type : "boolean",
          description : "Required paramenter to use with memberof command. for example /api/quorum?command=memberof&protxhash=aaaaa"
        }, {
          name : "count",
          type : "boolean",
          description : "Optional paramenter to use with memberof command. Number of quorums to scan for. If not specified, the active quorum count for each specific quorum type is used. For example /api/quorum?command=memberof&protxhash=aaaaa&count=10"
        }, {
          name : "id",
          type : "boolean",
          description : "Request id. Required paramenter to use with isconflicting command. for example /api/quorum?command=isconflicting&llmqtype=1&id=abc&msghash=adaaaa"
        }, {
          name : "msghash",
          type : "boolean",
          description : "Message Hash. Required paramenter to use with isconflicting command. for example /api/quorum?command=isconflicting&llmqtype=1&id=abc&msghash=adaaaa"
        }],
        "return" : "Quorum information base on given command parameter. Possible Commands: list, info, memberof, isconflicting"
      }
    ]
  }
}

module.exports = AssetBase;
