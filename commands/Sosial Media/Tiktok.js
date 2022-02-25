const axios = require('axios');

exports.run = async (client, message, args) => {
    try {
        let query = args.join(' ');
        if (!query) return client.reply(message.from, 'Link invalid!', message.id);

        // get response url =
        if (!query.includes('tiktok.com')) return client.reply(message.from, 'Link invalid!', message.id);

        const response = await axios.get(`https://server1.majhcc.xyz/api/tk?url=${url}`);
        const data = response.data;

        await client.sendText(message.from, "Kato sedang memproses, tunggu sebentar ya...", message.id);
        await client.sendFileFromUrl(message.from, data.link, `${Date.now()}.mp4`, `Uncompressed Video ${data.link}`);
    } catch (err) {
        client.reply(message, `Something went wrong!\n${err}`, message.id);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
}

exports.help = {
    name: 'tiktok',
    description: 'Get TikTok video link',
    usage: 'tiktok <link>',
    example: 'tiktok https://www.tiktok.com/@tiktok/video/6844446909878782464'
}
