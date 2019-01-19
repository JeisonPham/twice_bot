const malScraper = require('mal-scraper')
function display(recievedMessage, user) {
    const command = recievedMessage.content
    if (command.length >= 250) return
    else if (/myanimelist.net/.test(command)) {
        malScraper.getInfoFromURL(command)
            .then((data) => recievedMessage.channel.send(animeEmbed(data, user, command)))
            .catch(err => console.log(err))
    }
    else {
        malScraper.getResultsFromSearch(command)
            .then(search => {
                const results = search.slice(0, search.length / 2).map((x, i) => {
                    return `${i + 1}.${x.name}`
                }).join('\n')
                recievedMessage.channel.send(results + '\nTop result\n')
                let newMessage = recievedMessage
                newMessage.content = search[0].url
                display(newMessage, user)
            })
            .catch(err => console.log(err))
    }
}

function animeEmbed(anime, user, command) {
    const kissAnime = `https://kissanime.ru/Anime/${anime.title.replace(":", '').split(' ').join('-')}`
    let title = ""
    let trailer = anime.trailer ? `https://youtube.com/watch?v=${anime.trailer.match(/(?<=embed\/)(\d|\w)+/g)}` : undefined
    if (anime.title == anime.englishTitle || anime.englishTitle == '') {
        title = `Title: ${anime.title}`
    }
    else {
        title = `English Title: ${anime.englishTitle}\n                         ${anime.title}`
    }
    title += `\nJapanese Title: ${anime.japaneseTitle}`
    if (anime.trailer) {

    }
    const embed = {
        embed: {
            author: {
                name: user.username,
                icon_url: user.avatarURL
            },
            title: title,
            url: command,
            description: "```" + anime.synopsis + "```",
            thumbnail: { url: anime.picture },
            fields: [
                {
                    name: "Trailer",
                    value: `[link](${trailer})`
                },
                {
                    name: "KissAnime",
                    value: `[link](${kissAnime})`
                },
                {
                    name: "Status",
                    value: anime.status
                },
                {
                    name: "Score",
                    value: anime.score
                },
                {
                    name: "Episodes",
                    value: anime.episodes
                }
            ]
        }
    }
    return embed

}

module.exports = {
    display: display
}