var Decimal = require("decimal.js");
Decimal8 = Decimal.clone({ precision:8, rounding:8 });
var MasternodeBase = require("./masternodeBase.js");

var Pyrk = new MasternodeBase("Pyrk", "PYRK", "pyrk", ["sat", "satoshi"], "masternode");
Pyrk.addProperties({
	logoUrl:"/img/logo/pyrk.svg",
	siteTitle:"Pyrk Explorer",
	siteDescriptionHtml:"<b>PYRK Explorer</b> is <a href='https://github.com/npq7721/rpc-explorer). If you run your own [Pyrk Full Node](https://github.com/pyrkcommunity/pyrk/releases), **PYRK Explorer** can easily run alongside it, communicating via RPC calls. See the project [ReadMe](https://github.com/Pyrk/PYRK-rpc-explorer) for a list of features and instructions for running.",
	nodeTitle:"Pyrk Full Node",
	nodeUrl:"https://github.com/pyrkcommunity/pyrk/releases",
	demoSiteUrl: "https://explorer.raptoreum.com",
	masternodeName: "Masternode",
	miningPoolsConfigUrls:[
		"https://raw.githubusercontent.com/blockchain/Blockchain-Known-Pools/master/pools.json"
	],
	targetBlockTimeSeconds: 60,
	currencyUnitsByName:{
		"PYRK": Pyrk.properties.currencyUnits[0],
		"mPYRK": Pyrk.properties.currencyUnits[1],
		"pits": Pyrk.properties.currencyUnits[2],
		"pap": Pyrk.properties.currencyUnits[3]
	},
	//baseCurrencyUnit: currencyUnits[3],
	//defaultCurrencyUnit:currencyUnits[0],
	//feeSatoshiPerByteBucketMaxima: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50, 75, 100, 150],
	genesisBlockHash: "973814a07c1ae4f3af90372952c9b9709901a95df1d0ea54bd1b3bd6feff5b89",
	genesisCoinbaseTransactionId: "faa5e3a6b332d17e8d9532839ff8cf89732e9a52e1a75ab3c4a3eaccf35e7251",
	genesisCoinbaseTransaction: {
		"hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0804ffff001d02fd04ffffffff0100f2052a01000000434104f5eeb2b10c944c6b9fbcfff94c35bdeecd93df977882babc7f3a2cf7f5c81d3b09a68db7f0e04f21de5d4230e75e6dbe7ad16eefe0d4325a62067dc6f369446aac00000000",
		"txid": "faa5e3a6b332d17e8d9532839ff8cf89732e9a52e1a75ab3c4a3eaccf35e7251",
		"hash": "faa5e3a6b332d17e8d9532839ff8cf89732e9a52e1a75ab3c4a3eaccf35e7251",
		"size": 204,
		"vsize": 204,
		"version": 1,
		"confirmations":775000,
		"vin": [
			{
				"coinbase": "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
				"sequence": 4294967295
			}
		],
		"vout": [
			{
				"value": 100,
				"n": 0,
				"scriptPubKey": {
					"asm": "04ecc8faa3bb4fef51fd57145c25cd6d492e69412ad7c1722fadbcabbc1497617d32d1f49557634bdc4286293c479332426effbe2b040da1b7a569ce469d213ff1 OP_CHECKSIG",
					"hex": "4104f5eeb2b10c944c6b9fbcfff94c35bdeecd93df977882babc7f3a2cf7f5c81d3b09a68db7f0e04f21de5d4230e75e6dbe7ad16eefe0d4325a62067dc6f369446aac",
					"reqSigs": 1,
					"type": "pubkey",
					"addresses": [
						"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
					]
				}
			}
		],
		"blockhash": "973814a07c1ae4f3af90372952c9b9709901a95df1d0ea54bd1b3bd6feff5b89",
		"time": 1585180800,
		"blocktime": 1585180800
	},
	genesisCoinbaseOutputAddressScripthash:"8b01df4e368ea28f8dc0423bcf7a4923e3a12d307c875e47a0cfbf90b5c39161",
	historicalData: [
		{
			type: "blockheight",
			date: "2021-02-05 02:26:17",
			blockHeight: 0,
			blockHash: "973814a07c1ae4f3af90372952c9b9709901a95df1d0ea54bd1b3bd6feff5b89",
			summary: "The Pyrk Genesis Block.",
			alertBodyHtml: "This is the first block in the Pyrk blockchain, known as the 'Genesis Block'. This block was mined by Pyrk's creator Luke. You can read more about <a href='https://en.bitcoin.it/wiki/Genesis_block'>the genesis block</a>.",
			referenceUrl: "https://en.bitcoin.it/wiki/Genesis_block"
		},
		{
			type: "tx",
			date: "2021-02-05 02:26:17",
			txid: "faa5e3a6b332d17e8d9532839ff8cf89732e9a52e1a75ab3c4a3eaccf35e7251",
			summary: "The coinbase transaction of the Genesis Block.",
			alertBodyHtml: "This transaction doesn't really exist! ",
			referenceUrl: "https://github.com/bitcoin/bitcoin/issues/3303"
		}

	],

	relatedSites : [
		{name: "Official Website", url:"https://www.pyrk.org/", imgUrl:"/img/logo/pyrk.svg"},
		{name: "Discord", url:"https://discord.gg/74WAg3bn", imgUrl:"/img/logo/discord.svg"},
		{name: "Twitter", url:"https://twitter.com/PyrkC", imgUrl:"/img/logo/twitter.svg"},
		{name: "Github", url:"https://github.com/pyrkcommunity/pyrk", imgUrl:"/img/logo/github.png"}
	],
	blockRewardFunction:function(blockHeight) {
		var eras = [ new Decimal8(5000) ];
		for (var i = 1; i < 34; i++) {
			var previous = eras[i - 1];
			eras.push(new Decimal8(previous).dividedBy(2));
		}

		var index = Math.floor(blockHeight / 2100000);

		return eras[index];
	}
});

module.exports = Pyrk.properties;
