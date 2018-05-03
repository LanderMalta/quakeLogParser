module.exports = function(app) {
    var homeController = app.controllers.home;
    app.get('/', homeController.index);
    app.get('/index', homeController.index);
}