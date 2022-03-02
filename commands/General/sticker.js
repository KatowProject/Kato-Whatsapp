const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {
    try {
        const argstmplt = args.join(' ').includes('--removebg') ? "HQ" : false;
        switch (true) {
            //if regex https and image filetype
            case message.text.includes('https://') && message.text.includes('.png') || message.text.includes('.jpg') || message.text.includes('.jpeg') || message.text.includes('.gif'):
                client.sendStickerfromUrl(message.chatId, args.join(' '), {}, { author: `KatowProject`, discord: "458342161474387999", pack: `Kato-Sticker`, keepScale: true, removebg: argstmplt });
                break;

            case message.type === 'image':
                //send image as sticker
                const den = await WA.decryptMedia(message);
                const imgbase64 = `data:${message.mimetype};base64,${den.toString('base64')}`;
                client.sendImageAsSticker(message.chatId, imgbase64, { author: `KatowProject`, discord: "458342161474387999", pack: `Kato-Sticker`, keepScale: true, removebg: argstmplt });
                break;

            case message.type === 'video':
                //send video as sticker
                const den2 = await WA.decryptMedia(message);
                const vidbase64 = `data:${message.mimetype};base64,${den2.toString('base64')}`;
                client.sendImageAsSticker(message.chatId, vidbase64, { author: `KatowProject`, discord: "458342161474387999", pack: `Kato-Sticker`, keepScale: true, removebg: argstmplt });
                break;

            default:
                client.reply(message.chatId, 'Kamu harus mengirim gambar untuk menkonversi ke sticker.', message.id);
                break;
        }
    } catch (err) {
        client.reply(message.from, `Something went wrong: ${err.message}`, message.id);
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