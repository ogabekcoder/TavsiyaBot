const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require('./start'),
    require('./fullName'),
]);

module.exports = stage;