const config = require("./config")
const logger = require("./logger")

const startBot = (bot, botConfig = {}) => {
    bot.launch(() => {
        logger.info(`Bot @${bot.botInfo.username} started!`)
    })
}

module.exports = startBot
