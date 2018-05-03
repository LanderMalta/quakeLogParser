var mongoose = require('mongoose')

module.exports = function() {

    //Player model
    var playerSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        }
    }, { _id: false })

    //Player methods
    playerSchema.methods.addPlayer = function(_game, name) {
        if (this.playerAreInGame(_game, name) == false) {
            this.name = name
            _game.players.push(this)
        }
    }

    playerSchema.methods.playerAreInGame = function(_game, playerName) {
        var playerInGame = false
        if (playerName == "<world>")
            playerInGame = true
        _game.players.forEach(function(player) {
            if (playerName == player.name)
                playerInGame = true
        })
        return playerInGame
    }

    return mongoose.model('Player', playerSchema)
}