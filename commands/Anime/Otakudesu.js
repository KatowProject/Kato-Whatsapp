exports.run = async (client, message, args) => {
    try {
        if (!args[0]) return client.reply(message.from, `*Usage*:\nk!otakudesu <title>\n*Example*:\nk!otakudesu kanojo okarishimasu`, message.id);
        const query = args.join(' ');

        switch (true) {
            case query.includes('anime/'):
                await client.otakudesu.getDetail(message, query.replace('https://otakudesu.pro/anime/', ''));
                break;

            default:
                await client.otakudesu.getBySearch(message, query);
                break;
        }
    } catch (err) {
        client.reply(message.from, `Something went wrong:\n${err.message}`, message.id);
    }
};

exports.conf = {
    aliases: ['otk'],
    cooldown: 30
};

exports.help = {
    name: 'otakudesu',
    description: 'otakudesu',
    example: 'otakudesu',
    usage: 'otakudesu'
};
