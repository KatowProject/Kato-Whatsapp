const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {

    try {

        if(!args[0]) return client.reply(message.from, `Case Perintah:\n\n*search*\n*anime*\n\n*Contoh*:\n\`\`\`${client.config.prefix[0]}kusonime anime <url>\`\`\``, message.id);
        switch (args[0]) {
            case 'anime':
                if(!args[1]) return client.reply(message.from, `Masukin Linknya dulu!`, message.id);
                let link = args[1].includes('https') ? args[1].replace('https://kusonime.com/', '') : args[1];
                await client.kusonime.getLink(client, message, link);
            break;

            case 'search':
                if(!args[1]) return client.reply(message.from, `Masukin judul yang pengen dicari!`, message.id);
                args.shift();

                await client.kusonime.getBySearch(client, message, args.join(' '));
            break;

            default:
                client.reply(message.from, `Tidak ada Perintah Case *${args[0]}*`, message.id);
            break;
        }

    } catch (err) {
        return client.reply(message.from, `Something went wrong:\n ${err.message}`, message.id);
    }

};

exports.conf = {
    aliases: ['kuso', 'kusoni'],
    cooldown: 30
};

exports.help = {
    name: 'kusonime',
    description: 'kusonime',
    example: 'kusonime <search/anime> <judul/urlEndpoint>',
    usage: 'kusonime search kanojo'
};