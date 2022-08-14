const { Telegraf, Markup, session } = require('telegraf')
require('dotenv').config()
const movieService = require('./services/movieService.js')
const getNamespace = require('./helpers/getNamespace.js')

const token = process.env.TELEGRAM_BOT_TOKEN

const bot = new Telegraf(token)

bot.start(async ctx => {
    console.log('START')

    const user = ctx.update.message.from
    const chat = ctx.update.message.chat

    const namespace = getNamespace(chat)
    
    ctx.reply(`Seja bem vindo a lista de filmes de ${namespace}!`)

    console.log(user)
    console.log(chat)
})


bot.command('add', async ctx => {
    console.log('ADD', ctx.update.message)

    const chat = ctx.update.message.chat
    const commandLength = ctx.update.message.entities[0].length
    const movieName = ctx.update.message.text.substring(commandLength).trim()

    const result = await movieService.add(chat, movieName)
    ctx.reply(result)
})

bot.command('list', async ctx => {
    console.log('LIST', ctx.update.message)
    
    const chat = ctx.update.message.chat;
    
    const result = await movieService.list(chat)
    ctx.reply(result)
})

bot.command('remove', async ctx => {
    console.log('REMOVE', ctx.update.message)

    const chat = ctx.update.message.chat;
    const commandLength = ctx.update.message.entities[0].length;
    const movieName = ctx.update.message.text.substring(commandLength).trim()
    
    const result = await movieService.remove(chat, movieName)
    ctx.reply(result)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))