const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {

    try {

        if (!args[0]) return client.reply(message.from, `masukkan judulnya!`, message.id);
        const query = args.join(' ');

        if (query.includes('anime/')) {
            await client.samehadaku.getAnime(client, message, query.replace('https://samehadaku.vip/anime/', ''))
        } else if (query.includes('vip/')) {
            await client.samehadaku.getEps(client, message, query.replace('https://samehadaku.vip/', ''));    
        } else {
            await client.samehadaku.getBySearch(client, message, query);
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