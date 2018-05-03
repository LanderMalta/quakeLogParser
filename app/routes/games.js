module.exports = function(app) {
    var gamesController = app.controllers.games;
    app.get('/games', gamesController.getList);
    app.get('/games/:id', gamesController.getOne);
}