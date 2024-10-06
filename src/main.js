require("dotenv").config()
const mongoose = require("mongoose")

const bot = require("./core/bot")
const session = require("./core/session")
const stage = require("./scenes")
const startBot = require("./utils/startBot")
const User = require("./models/users")

bot.use(session)
bot.use(stage.middleware())

bot.start(async (ctx) => {
    try {
        const userId = ctx.from.id

        let user = await User.findOne({ userId })

        if (!user) {
            user = await User.create({ userId, tgInfo: ctx.from })
        }

        if (!user.fullName) {
            return ctx.scene.enter("full-name")
        }

        ctx.scene.enter("start")
    } catch (error) {
        console.log(error)
    }
})

bot.on("my_chat_member", async (ctx) => {
    try {
        const chatId = ctx.chat.id
        const userId = ctx.myChatMember.from.id
        const chat = await ctx.telegram.getChat(chatId)
        const newStatus = ctx.myChatMember.new_chat_member.status
        const oldStatus = ctx.myChatMember.old_chat_member.status

        if (oldStatus === "left" && (newStatus === "member" || newStatus === "administrator")) {
            const user = await User.findOne({ userId })
            
            if (user) {
                user.channels.push({ name: chat.title, id: chatId })
                await user.save()

                await bot.telegram.sendMessage(userId, `Kanalingiz qo'shildi! ${chat.title}`)
            }
        }
    } catch (error) {
        console.log(error)
    }
})

bot.on("chat_join_request", async (ctx) => {
    try {
        const chatId = ctx.chat.id
        const userId = ctx.chatJoinRequest.from.id

        const user = await User.findOne({ userId })

        if (!user) {
            await User.create({ userId, tgInfo: ctx.chatJoinRequest.from })
        }

        await ctx.telegram.approveChatJoinRequest(chatId, userId)
    } catch (error) {
        console.log(error)
    }
})

async function start() {
    try {
        mongoose
            .connect(process.env.MONGO_URI)
            .then(() => console.log("Connected to MongoDB"))
            .catch((error) => console.log(error))

        startBot(bot)
    } catch (error) {
        console.log(error)
    }
}

module.exports = start
