 var mongoose = require('mongoose')

 module.exports = function(app) {

     //Kill model
     var killSchema = mongoose.Schema({
         playerName: {
             type: String,
             required: true
         },
         kills: {
             type: Number,
             required: true,
             default: 0
         },
         deaths: {
             type: Number,
             required: true,
             default: 0
         },
         suicides: {
             type: Number,
             required: true,
             default: 0
         },
         score: {
             type: Number,
             required: true,
             default: 0
         }
     }, { _id: false })


     killSchema.methods.newKillScore = function(_game, playerName, kills, deaths, suicides) {
         this.playerName = playerName
         this.kills = kills
         this.deaths = deaths
         this.suicides = suicides
         _game.kills.push(this)
     }

     killSchema.methods.addKill = function(_game, playerName) {
         if (this.playerAreInScore(_game, playerName)) {
             _game.kills.forEach(function(kill) {
                 if (playerName == kill.playerName) {
                     var kills = kill.kills
                     kill.kills = kills + 1
                 }
             })
         } else
             this.newKillScore(_game, playerName, 1, 0, 0)
     }

     killSchema.methods.addDeath = function(_game, playerName) {
         if (this.playerAreInScore(_game, playerName)) {
             _game.kills.forEach(function(kill) {
                 if (playerName == kill.playerName) {
                     var deaths = kill.deaths
                     kill.deaths = deaths + 1
                 }
             })
         } else
             this.newKillScore(_game, playerName, 0, 1, 0)
     }

     killSchema.methods.addSuicide = function(_game, playerName) {
         if (this.playerAreInScore(_game, playerName)) {
             _game.kills.forEach(function(kill) {
                 if (playerName == kill.playerName) {
                     var suicides = kill.suicides
                     kill.suicides = suicides + 1
                 }
             })
         } else
             this.newKillScore(_game, playerName, 0, 0, 1)
     }

     killSchema.methods.playerAreInScore = function(_game, playerName) {
         var playerAreInScore = false
         if (playerName == "<world>")
             playerInGame = true
         _game.kills.forEach(function(kill) {
             if (playerName == kill.playerName)
                 playerAreInScore = true
         })
         return playerAreInScore
     }

     return mongoose.model('Kill', killSchema)
 }