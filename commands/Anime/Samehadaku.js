const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {

    try {

        if (!args[0]) return client.reply(message.from, `Case Perintah:\n\n*search*\n*anime*\n*eps*\n\n*Contoh*:\n\`\`\`${client.config.prefix[0]}samehadaku anime <url>\`\`\``, message.id);

        switch (args[0].toLowerCase()) {
            case 'anime':
                if(!args[1]) return client.reply(message.reply, `Masukin Linknya dulu!`, message.id);
                let link = args[1].includes('https') ? args[1].replace('https://samehadaku.vip/anime/', '') : args[1];
                await client.samehadaku.getAnime(client, message, link);
            break;

            case 'search':
                if(!args[1]) return client.reply(message.from, `Masukin judul yang pengen dicari!`, message.id);
                args.shift();

                await client.samehadaku.getBySearch(client, message, args.join(' '));
            break;

            case 'eps':
                if(!args[1]) return client.reply(message.from, `Masukin URL epsnya!`, message.id);
                let eps = args[1].includes('https') ? args[1].replace('https://samehadaku.vip/', '') : args[1];

                await client.samehadaku.getEps(client, message, eps);
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
    aliases: ['same', 'samehada'],
    cooldown: 30
};

exports.help = {
    name: 'samehadaku',
    description: 'samehadaku',
    example: 'samehadaku <search/anime/eps> <judul/urlEndpoint/urlEndpoint>',
    usage: 'kusonime search kanojo'
};