module.exports = (chat) => {
    if(chat.type === 'private') {
        return `@${chat.username}`
    } else if(chat.type === 'group' || chat.type === 'supergroup') {
        return chat.title
    }

    return undefined
}