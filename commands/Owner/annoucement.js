const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {
    try {
        if (!client.config.owners.includes(message.sender.id)) return;
        // get all groups
        const messages = args.join(' ');
        if (!messages) return client.reply(message.from, `Pesan tidak boleh kosong!`, message.id);

        const groups = await client.getAllGroups();
        const messageType = message.type;
        if (messageType === 'image') {
            const imgDen = await WA.decryptMedia(message);
            const imgBase64 = `data:${message.mimetype};base64,${imgDen.toString('base64')}`;

            for (const group of groups) {
                await client.sendImage(group.id, imgBase64, 'image', messages);
            }
        } else {
            for (const group of groups) {
                await client.sendText(group.id, messages);
            }
        }
    } catch (err) {
        client.reply(message.from, `Something went wrong:\n${err.message}`, message.id);
    }
}

exports.conf = {
    cooldown: 30,
    aliases: ["broadcast"]
}

exports.help = {
    name: "annoucement",
    description: "annoucement",
    example: "annoucement",
    usage: "annoucement"
}