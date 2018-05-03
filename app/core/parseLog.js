var fs = require('fs')

module.exports = function(app) {
    var core = {}

    var Game = app.models.Game
    var Player = app.models.Player
    var Kill = app.models.Kill

    var _game = new Game()
    var _gamesCount = 0
    var time, killer, killed, isSuicide, death_reason

    core.readLog = function() {
        try {
            Game.remove({}, function(err) {})
            var logFile = fs.createReadStream('./app/assets/games.log')
            var remaining = ''

            logFile.on('data', function(data) {
                remaining += data
                var index = remaining.indexOf('\n')
                var last = 0
                while (index > -1) {
                    var row = remaining.substring(last, index)
                    last = index + 1
                    app.core.parseLog.splitRow(row)
                    index = remaining.indexOf('\n', last)
                }
                remaining = remaining.substring(last)
            })

            logFile.on('end', function() {
                if (remaining.length > 0) {
                    app.core.parseLog.splitRow(remaining)
                }
            })

            return "Ok"
        } catch (err) {
            return
        }
    }

    core.splitRow = function(row) {
        try {
            var rowObject = row.split(": ")
            app.core.parseLog.parseData(row, rowObject)
            return rowObject
        } catch (err) {
            return
        }
    }

    core.parseData = function(row, rowObject) {
        try {
            try {
                time = rowObject[0].substring(rowObject[0].indexOf(":") - 2, rowObject[0].indexOf(":") + 3).trim()
                killer = rowObject[2].substring(0, rowObject[2].indexOf(" killed ")).trim()
                killed = rowObject[2].substring(rowObject[2].indexOf(" killed ") + 8, rowObject[2].indexOf(" by MOD")).trim()
                death_reason = rowObject[2].substring(rowObject[2].indexOf(" by ") + 4, rowObject[2].length).trim()
                isSuicide = (rowObject[1].indexOf("1022") > -1) ? true : false
                isSuicide = (killer == killed) ? true : isSuicide
            } catch (err) {}
            app.core.parseLog.verifyEvent(row)
            return "Ok"
        } catch (err) {
            return
        }
    }

    core.verifyEvent = function(row) {
        try {
            if (row.indexOf("InitGame:") > -1) {
                _game = new Game()

                return "Ok"
            }

            if (row.indexOf("Kill:") > -1) {
                //increment game total_kills
                _game.incrementTotalKills()

                //add killer player
                _player = new Player()
                _player.addPlayer(_game, killer)

                //add killed player
                _player = new Player()
                _player.addPlayer(_game, killed)

                //verify kill details
                if (isSuicide) {
                    _kill = new Kill()
                    _kill.addSuicide(_game, killed)
                } else {
                    _kill = new Kill()
                    _kill.addKill(_game, killer)
                    _kill = new Kill()
                    _kill.addDeath(_game, killed)
                }

                return "Ok"
            }

            if (row.indexOf("ShutdownGame:") > -1) {
                _gamesCount++
                _game.setId(_gamesCount)
                _game.calculateScore()
                Game.create(_game)

                return "Ok"
            }

            return
        } catch (err) {
            return
        }
    }

    return core
}