const db = require('quick.db');

module.exports = async (client, message) => {
    if (!message.isGroupMsg) return;
    let user = message.sender.id.split('@').shift();
    let afk = new db.table('AFKs'),
        authorstatus = await afk.fetch(user),
        mentioned = message.mentionedJidList;

    if (mentioned.length > 0) {
        mentioned = mentioned[0].replace('@c.us', '')
        let status = await afk.get(`${mentioned}.alasan`),
            waktu = await afk.get(`${mentioned}.time`);

        let msTos = Date.now() - waktu;
        let since = client.util.parseDur(msTos);

        if (status) {
            client.sendReplyWithMentions(message.from, `Saat ini @${mentioned} sedang AFK\nAlasan: ${status} - *${since} ago*`, message.id);
        }
    }

    if (authorstatus) {
        client.reply(message.from, `Kato telah mencabut status AFK mu!`, message.id);
        await afk.delete(user);
    }
}