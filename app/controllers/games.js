module.exports = function(app) {
    var controller = {}
    var Game = app.models.Game;

    //get list of games
    controller.getList = function(req, res) {
        Game.find().sort({ _id: 1 }).exec().then(
            function(gamesList) {
                res.json(gamesList);
            },
            function(err) {
                console.error(err);
                res.status(500).json(err);
            }
        );
    }

    //get single game 
    controller.getOne = function(req, res) {
        var id = req.params.id;
        Game.findById(id).then(
            function(game) {
                res.json(game);
            },
            function(err) {
                console.error(err);
                res.status(404).send('Game não encontrado');
            }
        );
    }

    return controller
}