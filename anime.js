const malScraper = require('mal-scraper')
function display(recievedMessage, Discord) {
    const command = recievedMessage.content
    if (/myanimelist.net/.test(command)) {
        malScraper.getInfoFromURL(command)
            .then((data) => recievedMessage.channel.send(animeEmbed(data, Discord)))
            .catch(err => recievedMessage.reply('Url not found try again'))
    }
    else {
        malScraper.getResultsFromSearch(recievedMessage.content)
            .then(search => {
                const results = search.slice(0, search.length / 2).map((x, i) => {
                    return `${i + 1}.${x.name}`
                }).join('\n')
                recievedMessage.channel.send(results + '\nTop result\n')
                let newMessage = recievedMessage
                newMessage.content = search[0].url
                display(newMessage, Discord)
            })
            .catch(() => recievedMessage.reply('no results found please try again'))
    }
}

function animeEmbed(anime, Discord) {
    let url = `https://myanimelist.net/${anime.id}/${anime.title.split(' ').join('_')}`
    let embed = new Discord.RichEmbed()
        .setTitle(`English Title: ${anime.englishTitle}\n                         ${anime.title}\nJapanese Title: ${anime.japaneseTitle}\n\n${url}`)
        .setDescription(`${anime.synopsis}\n\n[Trailer](${anime.trailer})`)
        .setThumbnail(anime.picture)
        .addBlankField(true)
        .addField('Status', anime.status)
        .addField('Score', anime.score);
    return embed

}

module.exports = {
    display: display
}