exports.run = async (client, message, args) => {
    try {
        if (!args[0]) return client.reply(message.from, `*Usage*:\nk!otakudesu <title>\n*Example*:\nk!otakudesu kanojo okarishimasu`, message.id);
        const query = args.join(' ');

        switch (true) {
            case query.includes('komik/'):
                await client.komikindo.getDetail(message, query.replace('https://komikindo.id/komik/', ''));
                break;

            default:
                await client.komikindo.getBySearch(message, query);
                break;
        }
    } catch (err) {
        client.reply(message.from, `Something went wrong:\n${err.message}`, message.id);
    }
};

exports.conf = {
    aliases: ['komind'],
    cooldown: 30
};

exports.help = {
    name: 'komikind',
    description: 'komikindo',
    example: 'komikindo',
    usage: 'komikindo'
};
