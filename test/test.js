'use strict'
var express = require('../config/express')
var app = express()
var expect = require('chai').expect
var parseLog = require('../app/core/parseLog')


describe('#models_Game', function() {
    var Game = app.models.Game
    var Kill = app.models.Kill

    it('setId() = Deve definir o id do jogo', function() {
        var _gameTest = new Game()
        var _id = 19
        _gameTest.setId(_id)
        expect(_gameTest._id).to.equal(19)
    })

    it('incrementTotalKills() = Deve adicionar mais uma morte para o jogo', function() {
        var _gameTest = new Game()
        _gameTest.incrementTotalKills()
        expect(_gameTest.total_kills).to.equal(1)
        _gameTest.incrementTotalKills()
        expect(_gameTest.total_kills).to.equal(2)
        _gameTest.incrementTotalKills()
        expect(_gameTest.total_kills).to.equal(3)
    })

    it('calculateScore() = Deve calcular o score de todos jogadores', function() {
        var _gameTest = new Game()
        var _gameKillTest = new Kill()
        var killScore = _gameKillTest.newKillScore(_gameTest, "Test Player", 2, 0, 12)
        _gameTest.calculateScore()
        expect(_gameTest.kills[0].score).to.equal(-10)
    })
})

describe('#models_Player', function() {
    var Game = app.models.Game
    var Player = app.models.Player

    it('addPlayer() = Deve adicionar um jogador em um jogo', function() {
        var _gameTest = new Game()
        var _playerTest = new Player()
        var name = "João"
        _playerTest.addPlayer(_gameTest, name)
        expect(_playerTest.name).to.equal("João")
    })

    it('playerAreInGame() = Deve verificar se um jogador está no jogo', function() {
        var _gameTest = new Game()
        var _playerTest = new Player()
        var name = "João"
        _playerTest.addPlayer(_gameTest, name)
        expect(_playerTest.playerAreInGame(_gameTest, name)).to.equal(true)
    })
})

describe('#models_Kill', function() {
    var Game = app.models.Game
    var Kill = app.models.Kill

    it('newKillScore() = Deve adicionar um novo score de jogador ao game', function() {
        var _gameTest = new Game()
        var _killTest = new Kill()
        _killTest.newKillScore(_gameTest, "João", 2, 0, 12)
        expect(_gameTest.kills[0].playerName).to.equal("João")
        expect(_gameTest.kills[0].kills).to.equal(2)
        expect(_gameTest.kills[0].deaths).to.equal(0)
        expect(_gameTest.kills[0].suicides).to.equal(12)
    })

    it('addKill() = Deve adicionar/atualizar uma morte a um jogador', function() {
        var _gameTest = new Game()
        var _killTest = new Kill()
        _killTest.newKillScore(_gameTest, "João", 2, 0, 12)
        _killTest.addKill(_gameTest, "João")
        expect(_gameTest.kills[0].kills).to.equal(3)
    })

    it('addDeath() = Deve adicionar/atualizar uma morte a um jogador', function() {
        var _gameTest = new Game()
        var _killTest = new Kill()
        _killTest.newKillScore(_gameTest, "João", 2, 0, 12)
        _killTest.addDeath(_gameTest, "João")
        expect(_gameTest.kills[0].deaths).to.equal(1)
    })

    it('addSuicide() = Deve adicionar/atualizar um suicido a um jogador', function() {
        var _gameTest = new Game()
        var _killTest = new Kill()
        _killTest.newKillScore(_gameTest, "João", 2, 0, 12)
        _killTest.addSuicide(_gameTest, "João")
        expect(_gameTest.kills[0].suicides).to.equal(13)
    })

    it('playerAreInScore() = Deve verificar se um jogador está no score do jogo', function() {
        var _gameTest = new Game()
        var _killTest = new Kill()
        _killTest.newKillScore(_gameTest, "João", 2, 0, 12)
        expect(_killTest.playerAreInScore(_gameTest, "João")).to.equal(true)
    })
})

describe('#core_parseLog', function() {
    var parseLogTest = parseLog(app)

    it('readLog() = Deve ler o arquivo (games.log) na pasta assets e chamar a função splitRow()', function() {
        expect(parseLogTest.readLog()).to.equal("Ok")
    })

    it('splitRow() = Deve converter uma string separada por (: ) em um objeto e chamar a função parseData()', function() {
        var row = "um: dois: tres"
        var rowObject = ['um', 'dois', 'tres']
        expect(parseLogTest.splitRow(row)).to.deep.equal(rowObject)
    })

    it('parseData() = Deve extrair os dados de uma determinada linha,(objeto) do log e chamar a função verifyEvent()', function() {
        var row = ""
        var rowObject = ['12:13 Kill', '3 3 7', 'Dono da Bola killed Lander by MOD_ROCKET_SPLASH']
        expect(parseLogTest.parseData(row, rowObject)).to.equal("Ok")
    })

    it('verifyEvent() = Deve verificar o evento de uma linha e fazer sua ação específica', function() {
        var row = "InitGame:"
        expect(parseLogTest.verifyEvent(row)).to.equal("Ok")
    })
})