const { Scenes } = require("telegraf")
const User = require("../models/users")

const scene = new Scenes.BaseScene("full-name")

scene.enter((ctx) => {
    ctx.reply("Xush kelibsiz\nIsm familiya / Имя Фамилия kiriting: ")
})

scene.command("start", (ctx) => {
    ctx.scene.enter("full-name")
})

scene.on("text", async (ctx) => {
    try {
        await User.findOneAndUpdate({ userId: ctx.from.id }, { fullName: ctx.message.text })

        ctx.scene.enter("start")
    } catch (error) {
        console.log(error)
    }
})

module.exports = scene
