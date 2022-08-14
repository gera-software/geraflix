const getNamespace = require('../helpers/getNamespace.js')

const namespaces = new Map();

// TODO verificar se o filme já existe
const add = async (chat, movie) => {
    if(movie) {
        if(!namespaces.has(chat.id)) {
            namespaces.set(chat.id, [])
        }

        const list = namespaces.get(chat.id);
        list.push(movie)
        return `"${movie}" adicionado a lista de ${getNamespace(chat)}`
    }

    return 'Nome inválido'
}

const list = async (chat) => {
    let list = [];
    if(namespaces.has(chat.id)) {
        list = namespaces.get(chat.id)
    }

    list.join('\n')
    return `Lista de ${getNamespace(chat)} (${list.length} itens): \n${list.join(',\n')}`
}

const remove = async (chat, movie) => {
    const namespace = getNamespace(chat);
    if(movie) {
        if(!namespaces.has(chat.id)) {
            namespaces.set(chat.id, [])
        }

        const list = namespaces.get(chat.id);
        const index = list.indexOf(movie);
        if(index < 0) {
            return `"${movie}" não encontrado na lista de ${namespace}`
        } else {
            list.splice(index, 1)
            return `"${movie}" removido da lista de ${namespace}`
        }
    }
    
    return 'Nome inválido'
}

module.exports = {
    add,
    list,
    remove,
}