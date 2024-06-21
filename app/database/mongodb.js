const mongoose = require('mongoose');
var debug = require('debug');
var debugLog = debug("mongo_exp");
const {Wallet, WALLET_FIELD_MAP} = require("./model/wallet.js");
const {SyncTracker, SYNC_TRACKER_FIELD_MAP} = require("./model/SyncTracker.js");
const {ExchangeApi, EXCHANGE_API_FIELD_MAP} = require("./model/exchangeApi.js");


class MongoDB {
	constructor(dbConfig) {
    this.connectionString = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.address}:${dbConfig.port}/${dbConfig.database}`;
		var self = this;
		mongoose.connect(this.connectionString,function(err) {
		      if (err) {
		    	  console.log('Unable to connect to database: %s', self.connectionString);
		    	  console.log('Aborting');
		          process.exit(1);
		        }
		});
		this.db = mongoose.connection;
  }

	getAllRichList() {
		return this.genericQuery(Wallet, {}, ['address', 'label', 'balance']);
	}

	getExchanges() {
		return this.genericQuery(ExchangeApi, {});
	}

	saveExchange(exchange) {
		return self.genericSaveUpdate(ExchangeApi, exchange, {name : exchange.name}, EXCHANGE_API_FIELD_MAP);
	}

	saveWallets(wallets, lastSyncTracker) {
		var self = this;
		return new Promise(async (resolve, reject) => {
			console.log("saving %s wallets", wallets.length);
			for(var index in wallets) {
				try {
					//console.log("saving %s", wallets[index].address);
					await self.genericSaveUpdate(Wallet, wallets[index], {address : wallets[index].address}, WALLET_FIELD_MAP);
				} catch(err) {
					console.log(err);
				}
			}
			if(lastSyncTracker) {
				console.log("updating lastSync %O", lastSyncTracker);
				await self.saveLastSync(lastSyncTracker);
			}
			resolve(true);
		});
	}

	saveLastSync(lastSyncTracker) {
		return this.genericSaveUpdate(SyncTracker, lastSyncTracker, {type : lastSyncTracker.type}, SYNC_TRACKER_FIELD_MAP);
	}

	getAddressBalanceLastSyncBlock() {
		var self = this;
		return new Promise( (resolve, reject) => {
				self.genericQuery(SyncTracker, {type : "block"}).then(syncTracker => {
					resolve(syncTracker.length > 0 ? syncTracker[0].block : 0);
				}).catch(reject);
		});

	}
	countRichList() {
		return this.count(Wallet, {});
	}

	queryRichList(start, limit) {
		return this.genericQuery(Wallet, {},
			['address', 'label', 'balance'],
			{
				skip : start,
				limit : limit,
				sort : {
					balance: -1
				}
			});
	}

  genericQuery(modelClass, query, selectFields = null, options = {}) {
		var self = this;
		return new Promise(function(resolve, reject) {
			modelClass.find(query, selectFields, options, function(err, records) {
				if(err) {
					debugLog(" query error for %O: %O",query, err);
					resolve([]);
				} else {
					resolve(records);
				}
			});
		});
	}

  genericSaveUpdate(modelClass, record, uniqueQuery, modelFieldMap) {
		var self = this;
		return new Promise(function(resolve, reject) {
			var toBeUpdateRecord = {};
			var fields = Object.keys(modelFieldMap);
			for(var index in fields) {
				var recordField = fields[index];
				if(recordField === 'uniqueId') continue;
				var modelField = modelFieldMap[recordField];
				var recordValue = record[recordField];
				if(recordValue !== undefined) {
					toBeUpdateRecord[modelField] = recordValue;
				}
			}
			if(!uniqueQuery) {
				self.save(new modelClass(toBeUpdateRecord), function(result) {
					resolve(result);
				});
			} else {
				self.query(modelClass, uniqueQuery, function (result){
					if(result && result.length > 0 ) {
						self.updateOne(modelClass, uniqueQuery, toBeUpdateRecord, function(result) {
							if(result) {
								resolve(result);
							} else {
								reject(`${record} can't be found. create ${modelClass.collection.name} first`);
							}
						});
					} else {
						self.save(new modelClass(toBeUpdateRecord), function(result) {
							resolve(result);
						});
					}
				});
			}
		});
	}
  save(model, callback) {
		var self = this;
		model.save(function(err, record) {
			if(err) {
				console.log( err);
			} else {
				//console.info(`${record}`);
				debugLog(`${model.collection.name} is inserted`);
				callback(record);
			}
		});
	}
  updateOne(model, query, setFields, cb, returnedRecord = false) {
		var self = this;
		model.updateOne(query, {$set : setFields}, function(err, record) {
			if(err) {
				console.log( err);
			} else {
				if(record) {
					if(record.nModified) {
						debugLog( `%O ${model.collection.name} is updated`, record);
					} else {
						debugLog( `%O ${model.collection.name} no change`, record);
					}
					if(returnedRecord) {
						self.query(model, query, function(records) {
							if(records && records.length > 0) {
								cb(records[0])
							} else {
								cb(null);
							}
						});
					} else {
						cb(record);
					}
				} else {
					cb(null);
				}

			}
		});
	}

	updateMany(model, query, setFields, cb, returnedRecord = false) {
		var self = this;
		model.updateMany(query, {$set : setFields}, function(err, record) {
			if(err) {
				console.log( err);
			} else {
				if(record) {
					if(record.nModified) {
						debugLog(`%O ${model.collection.name} is updated`, record.nModified);
					} else {
						debugLog(`%O ${model.collection.name} no change`, record.n);
					}
					if(returnedRecord) {
						self.query(model, query, function(records) {
							if(records && records.length > 0) {
								cb(records)
							} else {
								cb(null);
							}
						});
					} else {
						cb(record);
					}
				} else {
					cb(null);
				}

			}
		});
	}

	update(model, newRecord, callback) {
		var self = this;
		model.updateOne(newRecord, function(err, record) {
			if(err) {
				debugLog(err);
			} else {
				 debugLog(`%O ${model.collection.name} is updated`, record);
				callback(record);
			}
		});
	}

	insertMany(model, records, callback) {
		var self = this;
		model.insertMany(records, function(err, records) {
			if(err) {
				console.log( err);
			} else {
				//console.info(`${record}`);
				debugLog( `${records.length} ${model.collection.name} is inserted`);
				callback(records);
			}
		});
	}
  query(model, query, callback, options = {}) {
		var self = this;
		model.find(query, options, function(err, records) {
			if(err) {
				debugLog("query with error %O: %O", query, err);
			} else {
				callback(records);
			}
		});
	}

	count(model, query) {
		var self = this;
		return new Promise((resolve, reject) => {
			model.estimatedDocumentCount(query, function(err, count) {
				if(err) {
					debugLog("query with error %O: %O", query, err);
					reject(err);
				} else {
					resolve(count);
				}
			});
		});
	}
}

module.exports = MongoDB;
