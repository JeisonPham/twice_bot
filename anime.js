const malScraper = require('mal-scraper')
function display(recievedMessage, user) {
    const command = recievedMessage.content
    if (command.length >= 250) return
    else if (/^(!season)/gi.test(command)) seasonInfo(recievedMessage)
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

function seasonInfo(command) {
    const seasonInfo = command.content.replace("!season ", "").toLowerCase()
    const season = seasonInfo.match(/(winter|spring|summer|fall)/gi)[0]
    const year = seasonInfo.match(/\d{4}/g) ? parseInt(seasonInfo.match(/\d{4}/g)[0]) : new Date().getFullYear()
    const color = [1048142, 11718884, 15859712, 16737178, 16439902]

    let filter = seasonInfo.replace(season, "").replace(year, "").replace(' ', '') + ""
    let searchResult = filter.match(/\d{1,}/gi)
    searchResult = searchResult == null ? 5 : parseInt(searchResult[0])
    malScraper.getSeason(year, season)
        .then(data => {
            let keys = []
            command.reply("Here are the results")
            for (let k in data) {
                keys.push(k)
            }
            for (let key in keys) {
                let embed = {}
                let sorted = false
                if (/(tv|ovas|movies|special|onas)/gi.test(filter) && filter.indexOf(keys[key].toLowerCase()) == -1) {
                    continue
                }
                if (filter.indexOf("score") != -1 && !sorted) {
                    data[keys[key]].sort((a, b) => b.score - a.score)
                    sorted = true
                }

                const showInfo = data[keys[key]].slice(0, searchResult)
                embed = {
                    embed: {
                        color: color[key],
                        title: showInfo.length > 0 ? `First ${showInfo.length} ${keys[key]} Result(s)` : `There are no ${keys[keys]} shows for this season`,
                        fields: showInfo.map((x, i) => {
                            return {
                                name: `${i + 1}. ${x.title}`,
                                value: `[${x.synopsis.substring(0, 100)}...](${x.link})`
                            }
                        })
                    }
                }
                command.channel.send(embed)

            }


        })
        .catch(err => console.log(err))

}

module.exports = {
    display: display
}