var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SyncTrackerSchema = new Schema({
	type :{ type: String, unique: true, index:true},
	block : {type: Number, default : 0}
});

var SyncTracker = mongoose.model('SyncTracker', SyncTrackerSchema);
const SYNC_TRACKER_FIELD_MAP = {
		type : "type",
		block : "block"
}

module.exports = {SyncTracker, SYNC_TRACKER_FIELD_MAP}
