const Discord = require('discord.js')
const Client = new Discord.Client()
require('dotenv').config()
const functions = require('./functions')
const anime = require('./anime.js')

Client.on('ready', () => {
    console.log('bot has started')
    Client.user.setActivity('?help')
})

Client.on('guildCreate', guild => {
    const guilds = Client.guilds.find(x => x.id == guild.id)
    guilds.createChannel('Twice Fan Club')
    guilds.createChannel('anime-info')
})

Client.on('message', recievedMessage => {
    async function purge() {
        recievedMessage.delete()
    }
    if (recievedMessage.author.bot) return
    if (recievedMessage.content == '!deleteAll') {
        async function deleteAll() {
            let deleteMsg = await recievedMessage.channel.fetchMessages()
                .then(messages => recievedMessage.channel.bulkDelete(messages))
                .catch(console.error)
        }
        deleteAll()
    }
    else if (recievedMessage.channel.name == 'twice-fan-club') {
        purge()
        if (recievedMessage.content.startsWith('!')) functions.commands(recievedMessage, Client)
        if (recievedMessage.content == ('?help')) functions.help(recievedMessage)
    }
    else if (recievedMessage.channel.name == 'anime-info') {
        purge()
        anime.display(recievedMessage, Discord)
    }
})



Client.login(process.env.BOT_TOKEN)