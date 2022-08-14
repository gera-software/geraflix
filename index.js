const { Telegraf, Markup, session } = require('telegraf')
require('dotenv').config()

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(token)

bot.start(async ctx => {
    console.log('START')

    const messageFrom = ctx.update.message.from
    const messageChat = ctx.update.message.chat

    console.log(messageFrom)
    console.log(messageChat)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))