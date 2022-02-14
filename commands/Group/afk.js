const db = require('../../database/schema/AFK');

exports.run = async (client, message, args) => {
    try {
        if (!message.isGroupMsg) return client.reply(message.from, 'Maaf, fitur ini hanya bisa digunakan di grup!', message.id);

        const user = message.sender.id.replace('@c.us', '');
        const afk = await db.findOne({ userID: user });
        const reason = args.join(' ');

        if (!afk) {
            client.sendTextWithMentions(message.from, `@${message.sender.id.replace('@c.us', '')} telah AFK! \n*Alasan:* ${reason ? reason : "AFK"}`);
            setTimeout(async () => {
                await db.create({ userID: user, data: { now: Date.now(), reason } });
            }, 7000);
        } else {
            afk.remove();
        };

    } catch (error) {
        console.log(error);
        return client.sendText(message.from, `Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    };
};



exports.conf = {
    aliases: ["away"],
    cooldown: 10
}

exports.help = {
    name: 'afk',
    description: 'menambahkan status afk pada user',
    usage: 'k!afk',
    example: 'k!afk'
}