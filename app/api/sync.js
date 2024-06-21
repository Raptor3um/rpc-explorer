const coreApi = require("./coreApi.js");
const rpcApi = require("./rpcApi.js");
const MongoDB = require("../database/mongodb.js");
const Async = require('async');

class BlockchainSync {
  constructor(config) {
    this.db = new MongoDB(config);
    this.syncing = false;
  }

  resyncExistingAddresses() {
    var self = this;
    return new Promise((resolve, reject) => {
      Async.waterfall([
  				(cb) => {
            console.log("gettting richlist");
  					self.db.getAllRichList().then(wallets => {
              cb(null, wallets);
            }).catch(e => {
              self.syncing = false;
              cb(e, null);
            });
  				},
          (wallets, cb) => {
            var syncPromise = new Promise(async (resolve, reject) => {
              self.syncing = true;
              var addresses = [];
              var walletsSubset = [];
              try {
                for(var index in wallets) {
                  addresses.push(wallets[index].address);
                  walletsSubset.push(wallets[index]);
                  if(addresses.length == 1000) {
                    console.log(addresses)
                    var balances = await coreApi.getAddresessBalance(addresses);
                    for(var i in balances) {
                      walletsSubset[i].balance = balances[i].balance;
                    }
                    console.log(`update ${Number(index) + 1}/${wallets.length}`);
                    await self.db.saveWallets(walletsSubset);
                    var addresses = [];
                    var walletsSubset = [];
                  }
                }
                if(addresses.length > 0) {
                  balances = await coreApi.getAddresessBalance(addresses);
                  for(var index in balances) {
                    walletsSubset[index].balance = balances[index].balance;
                  }
                  console.log(`update ${index}/${wallets.length}`);
                  await self.db.saveWallets(wallets);
                }
                self.syncing = false;
                resolve("addresses synced");
              } catch(e) {
                reject(e);
              }
            });
            syncPromise.then(result =>{
              cb(null, result);
            }).catch(e => {
              cb(e, null);
            });
          }
        ], (error, result) => {
          if(error) {
            self.syncing = false;
            reject({error});
          } else {
            resolve(result);
          }
        });
    });
  }

  syncAddressBalance() {
    var self = this;
    return new Promise((resolve, reject) => {
      if(this.syncing) {
        return resolve("Address Syncing")
      }
      Async.waterfall([
  				(cb) => {
  					rpcApi.getBlockCount().then(currentHeight => {
              cb(null, currentHeight);
            });
  				},
          (currentHeight, cb) => {
            // if(currentHeight % 7200 === 0) {
            //   self.resyncExistingAddresses().then(result => {
            //     cb(null, result);
            //   }).catch(err => {
            //     self.syncing = false;
            //     cb(err, null);
            //   });
            // } else {
            self.db.getAddressBalanceLastSyncBlock().then(lastSyncBlock => {
                if(currentHeight <= lastSyncBlock) {
                  cb("Address Balance Synced", null);
                } else {
                  cb(null, {
                    currentHeight : currentHeight,
                    lastSyncBlock : lastSyncBlock
                  });
                }
              });
            // }
          },
          (toSync, cb) => {
            if(!toSync.lastSyncBlock && toSync.lastSyncBlock != 0) {
              return cb (null, toSync);
            }
            var syncPromise = new Promise(async (resolve, reject) => {
              try {
                self.syncing = true;
                for(var i = toSync.lastSyncBlock; i < toSync.currentHeight;) {
                  var endHeight = i + 500;
                  if(endHeight > toSync.currentHeight) {
                    toSync.currentHeight = await rpcApi.getBlockCount();
                    endHeight = toSync.currentHeight;
                  }
                  var wallets = await coreApi.getOutputAddressBalance(i, endHeight);
                  await self.db.saveWallets(wallets, {type : 'block', block : endHeight});
                  i = endHeight;
                }
                self.syncing = false;
                resolve("synced");
              } catch(err) {
                self.syncing = false;
                reject(err);
              }
            });
            syncPromise.then(result => {
              cb(null, result);
            }).catch(err => {
              self.syncing = false;
              cb(err, null)
            });
          }
        ], (error, result) => {
  				if(error) {
            self.syncing = false;
  					reject({error});
  				} else {
  					resolve(result);
  				}
			});
    });
  }
}

module.exports = BlockchainSync;
