const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {

    try {
        if (!args[0]) return client.reply(message.from, `*Usage*:\nk!samehadaku <title>\n*Example*:\nk!samehadaku kanojo okarishimasu`, message.id);
        const query = args.join(' ');

        if (query.includes('anime/')) {
            await client.samehadaku.getAnime(client, message, query.replace('https://194.163.183.129/anime/', ''))
        } else if (query.includes('129/')) {
            await client.samehadaku.getEps(client, message, query.replace('https://194.163.183.129/', ''));
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