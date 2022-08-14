const { Telegraf, Markup, session } = require('telegraf')
require('dotenv').config()

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(token)

const namespaces = new Map();

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
    const movieName = ctx.update.message.text.substring(commandLength).trim()

    const namespace = getNamespace(chat);
    console.log('ADD', ctx.update.message)
    console.log(chat.id, namespace)
    if(movieName) {
        if(!namespaces.has(chat.id)) {
            namespaces.set(chat.id, [])
        }

        const list = namespaces.get(chat.id);
        list.push(movieName)
        ctx.reply(`"${movieName}" adicionado a lista de ${namespace}`)
    } else {
        console.error('invalid name')
        ctx.reply('Nome inválido')
    }

})

bot.command('list', async ctx => {
    const chat = ctx.update.message.chat;

    console.log('LIST', ctx.update.message)
    console.log(chat.id, getNamespace(chat))

    let list = [];
    if(namespaces.has(chat.id)) {
        list = namespaces.get(chat.id);
    }

    list.join('\n')
    ctx.reply(`Lista de ${getNamespace(chat)} (${list.length} itens): \n${list.join(',\n')}`)
})

bot.command('delete', async ctx => {
    const chat = ctx.update.message.chat;
    const commandLength = ctx.update.message.entities[0].length;
    const movieName = ctx.update.message.text.substring(commandLength).trim()

    const namespace = getNamespace(chat);
    console.log('DELETE', ctx.update.message)
    console.log(chat.id, namespace)
    if(movieName) {
        if(!namespaces.has(chat.id)) {
            namespaces.set(chat.id, [])
        }

        const list = namespaces.get(chat.id);
        const index = list.indexOf(movieName);
        if(index < 0) {
            ctx.reply(`"${movieName}" não encontrado na lista de ${namespace}`)
        } else {
            list.splice(index, 1)
            ctx.reply(`"${movieName}" removido da lista de ${namespace}`)
        }
    } else {
        console.error('invalid name')
        ctx.reply('Nome inválido')
    }

})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))