const getNamespace = require('../helpers/getNamespace.js')
const movieRepository = require('../repositories/movieRepository.js')

const add = async (chat, title) => {
    if(title) {
        if(await movieRepository.findOne({ namespace: chat.id, title })) {
            return `"${title}" já está na lista de ${getNamespace(chat)}`
        }

        await movieRepository.insertOne({ namespace: chat.id, title })

        return `"${title}" adicionado a lista de ${getNamespace(chat)}`
    }

    return 'Nome inválido'
}

const list = async (chat) => {
    const results = await movieRepository.find({ namespace: chat.id})

    return `Lista de ${getNamespace(chat)} (${results.length} itens): \n${results.map(item => item.title).join(',\n')}`
}

const remove = async (chat, title) => {
    const namespace = getNamespace(chat);
    if(title) {
        const result = await movieRepository.deleteOne({ namespace: chat.id, title })

        if(result >= 1) {
            return `"${title}" removido da lista de ${namespace}`
        } else {
            return `"${title}" não encontrado na lista de ${namespace}`
        }
    }
    
    return 'Nome inválido'
}

module.exports = {
    add,
    list,
    remove,
}