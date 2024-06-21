const request = require('request');
const Cache = require("./../cache.js");
const marketCache = new Cache(10);
class MarketAPI {
  constructor(config) {
    this.db = config.db;
  }

  getMarket(ticker) {
    var self = this;
    return marketCache.tryCache(`getMarket-${ticker}`, 1000 * 60 * 30, () => {
      return self.getMarketWithoutCache(ticker);
    });
  }

  getMarketWithoutCache(ticker) {
    ticker = ticker.toLowerCase();
    return new Promise((resolve, reject) => {
      self.db.getExchanges().then(exchanges => {
        var marketPromises = [];
        for(var i in exchanges) {
          marketPromises.push(self.getMarketFromExchange(exchanges[i], ticker));
        }
        Promise.all(marketPromises).then(exchangesMarkets => {
          var markets = exchangesMarkets[0];
          for(var i = 1; i < exchangesMarkets.length; i++) {
            var exchangeMarkets = exchangesMarkets[i];
            for(var j in exchangeMarkets) {
              markets.push(exchangeMarkets[j]);
            }
          }
          resolve(markets);
        }).catch(reject);
      });
    });
  }

  getMarketFromExchange(exchange, ticker) {
    return new Promise((resolve, reject) => {
      request({url : exchange.market_api, json : true}, (error, response, body) => {
        if(error) {
          reject(error);
        } else {
          var pairs = [];
          for(var pair in body) {
            if(pair.startsWith(ticker)) {
              var toTicker = pair.substring(ticker.length + exchange.pair_separator.length, pair.length);
              var pairString = `${ticker.toUpperCase()}-${toTicker.toUpperCase()}`;
              var market = exchange.market_info_field ? body[pair][exchange.market_info_field] : body[pair];
              var pairInfo = {
                Exchange : exchange.name,
                Pair : {
                  id : pairString,
                  website : `${exchange.website}${pair}`
                },
                Price : market[exchange.last_price_field],
                Change : market[exchange.price_change_field],
                Volume : `${market[exchange.to_ticker_volume_field]}${toTicker.toUpperCase()} - ${market[exchange.ticker_volume_field]}${ticker.toUpperCase()}`
              }
              pairs.push(pairInfo);
            }
          }
          resolve(pairs);
        }
      });
    });
  }

}
module.exports = MarketAPI;
