var mongoose = require('mongoose')

module.exports = function() {

    //Game model
    var gameSchema = mongoose.Schema({
        _id: {
            type: Number
        },
        total_kills: {
            type: Number
        },
        players: {
            type: Array,
            required: true,
            defalut: ""
        },
        kills: {
            type: Array,
            required: true
        },
    }, { _id: false, versionKey: false })

    //Game methods
    gameSchema.methods.setId = function(_id) {
        this._id = _id
    }

    gameSchema.methods.incrementTotalKills = function() {
        var total_kills = this.total_kills
        if (total_kills === undefined)
            total_kills = 0
        this.total_kills = total_kills + 1
    }

    gameSchema.methods.calculateScore = function() {
        this.kills.forEach(function(kill) {
            var kills = kill.kills
            var suicides = kill.suicides
            kill.score = kills - suicides
        })
    }

    return mongoose.model('Game', gameSchema)
}