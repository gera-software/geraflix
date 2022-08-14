const { Telegraf, Markup, session } = require('telegraf')
require('dotenv').config()

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(token)

const getNamespace = (chat) => {
    if(chat.type === 'private') {
        return `@${chat.username}`
    } else if(chat.type === 'group' || chat.type === 'supergroup') {
        return chat.title
    }

    return undefined
}

bot.start(async ctx => {
    console.log('START')

    const user = ctx.update.message.from
    const chat = ctx.update.message.chat

    const namespace = getNamespace(chat)
    
    ctx.reply(`Seja bem vindo a lista de filmes de ${namespace}!`)

    console.log(user)
    console.log(chat)
})

// TODO verificar se o filme já existe
bot.command('add', async ctx => {
    const chat = ctx.update.message.chat;
    const commandLength = ctx.update.message.entities[0].length;
    const nomeFilme = ctx.update.message.text.substring(commandLength).trim()

    console.log('ADD', ctx.update.message)
    if(nomeFilme) {
        console.log(nomeFilme)
        ctx.reply(`"${nomeFilme}" added to ${getNamespace(chat)}'s list`)
    } else {
        console.error('invalid name')
        ctx.reply('Nome inválido')
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))