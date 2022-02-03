const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {
    try {
        client.reply(message.chatId, 'Kato memberi waktu selama 1 menit untuk mengirim sticker.', message.id);
        const collector = client.createMessageCollector(message, m => m.type === 'sticker' && m.from === message.from, { time: 60_000, max: 1 });
        collector.on('collect', async m => {
            const den = await WA.decryptMedia(m);
            const imgbase64 = `data:${message.mimetype};base64,${den.toString('base64')}`;
            await client.sendFile(m.from, imgbase64, 'sticker.png', 'sticker', m.id);

            collector.stop();
        });
    } catch (err) {
        client.reply(message.from, `Something went wrong: ${err.message}`, message.id);
    }
};

exports.conf = {
    aliases: ["toimage"],
    cooldown: 5
}

exports.help = {
    name: 'sticker2image',
    description: 'send sticker as image',
    usage: 'k!sticker2image',
    example: 'k!sticker2image'
}