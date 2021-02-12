let db = require('quick.db')

exports.run = async (client, message, args) => {
    try {
        const status = new db.table('AFKs');
        let user = message.sender.id.split('@').shift();
        let afk = await status.fetch(user);

        //ignore AFK
        let reason = args.join(' ');

        if (!afk) {
            client.sendTextWithMentions(message.from, `@${message.sender.id.split('@').shift()} telah AFK! \n*Alasan:* ${reason ? reason : "AFK"}`)
            setTimeout(() => {
                status.set(user, { alasan: reason || 'AFK' });
                status.add(`${user}.time`, Date.now());
            }, 7000);

        } else {
            status.delete(user);
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