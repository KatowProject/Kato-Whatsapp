const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {

    try {

        if (!args[0]) return client.reply(message.from, `masukkan judulnya!`, message.id);

        const query = args.join(' ');
        if (query.startsWith('http')) {
            await client.kusonime.getLink(client, message, query.replace('https://kusonime.com/', ''));
        } else {
            await client.kusonime.getBySearch(client, message, query);
        }

    } catch (err) {
        console.log(err);
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