const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {
    try {
        switch (true) {
            //if regex https and image filetype
            case message.text.includes('https://') && message.text.includes('.png') || message.text.includes('.jpg') || message.text.includes('.jpeg') || message.text.includes('.gif'):
                client.sendStickerfromUrl(message.chatId, args.join(' '));
                break;

            case message.type === 'image':
                //send image as sticker
                const den = await WA.decryptMedia(message);
                const imgbase64 = `data:image/png;base64,${den.toString('base64')}`;
                client.sendImageAsSticker(message.chatId, imgbase64);
                break;

            default:
                client.reply(message.chatId, 'Kamu harus mengirim gambar untuk menkonversi ke sticker.', message.id);
        }
    } catch (err) {
        client.reply(message, `Something went wrong: ${err.message}`, message.id);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'sticker',
    description: 'send image as sticker',
    usage: 'k!sticker <image url>',
    example: 'k!sticker <image url>'
}