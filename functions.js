

function commands(recievedMessage, Client) {
    let fullCommands = recievedMessage.content.substr(1)
    const response = recievedMessage.channel
    const voiceJoin = recievedMessage.member.voiceChannel
    if (fullCommands == 'play') {
        if (voiceJoin == undefined) recievedMessage.reply('Please join a voice channel first')
        else voiceJoin.join().then(connection => recievedMessage.reply('Joining now'))
    }
    else if (fullCommands == 'leave' && voiceJoin != undefined) voiceJoin.leave()
    else if (fullCommands == 'roll') response.send(Math.floor(Math.random() * 20))
    else if (fullCommands == 'flip') recievedMessage.reply(Math.floor(Math.random() * 20) <= 10 ? 'heads' : 'tails')
    else if (fullCommands == 'bestGirl') recievedMessage.reply('Jeongyeong')
    else if (fullCommands == 'DT') {
        const date = new Date()
        recievedMessage.reply(`${date.getDay()} ${month(date.getMonth())} ${date.getFullYear()} - ${formatTime(date.getHours(), date.getMinutes(), date.getSeconds())}`)
    }
    else if (fullCommands == 'ping') response.send(Client.ping + ' ms')

}

function month(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[month]
}

function formatTime(hour, minute, second) {
    return `${(hour % 13) + 1}:${minute > 9 ? minute : ("0" + minute)}:${second} ${hour >= 13 ? "PM" : "AM"}`
}

function helpCommands(recievedMessage) {
    recievedMessage.reply("\n! in front for commands ex. !play\nroll - rolls a 20 side die\nDT - displays date and time")
}

module.exports = {
    commands: commands,
    help: helpCommands
}