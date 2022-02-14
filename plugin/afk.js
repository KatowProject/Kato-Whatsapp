const AFK = require('../database/schema/AFK');

module.exports = async (client, message) => {
    const mentioned = message.mentionedJidList;
    const author = await AFK.findOne({ userID: message.sender.id.replace('@c.us', '') });

    if (mentioned.length > 0) {
        const user = await AFK.findOne({ userID: mentioned[0].replace('@c.us', '') });
        if (!user) return;

        const dataUser = user.data;
        const waktu = dataUser.now;
        const alasan = dataUser.reason;

        const msLeft = Date.now() - waktu;
        const since = client.util.parseDur(msLeft);

        client.sendReplyWithMentions(message.from, `@${mentioned[0].replace('@c.us', '')} saat ini sedang AFK - **${since} ago**\n**Alasan:**\n${alasan}`, message.id);
    };

    if (author) {
        client.reply(message.from, `Kato telah mencabut status AFK mu!`, message.id);
        //delete
        author.remove();
    }
}