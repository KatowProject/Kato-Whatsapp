const axios = require('axios');

exports.run = async (client, message, args) => {
    try {
        let query = args.join(' ');
        if (!query) return client.reply(message.from, 'Link invalid!', message.id);

        // get response url =
        if (!query.includes('tiktok.com')) return client.reply(message.from, 'Link invalid!', message.id);

        const response = await axios.get(`https://tiktok-info.p.rapidapi.com/dl/?link=${encodeURIComponent(query)}`, {
            headers: {
                'x-rapidapi-host': 'tiktok-info.p.rapidapi.com',
                'x-rapidapi-key': '7a615ab862mshed830d5c52eeb93p139508jsnd38f34660ac9'
            }
        });

        const data = response.data;

        await client.sendText(message.from, "Kato sedang memproses, tunggu sebentar ya...", message.id);
        await client.sendFileFromUrl(message.from, data.videoLinks.download, `${Date.now()}.mp4`, `Uncompressed Video ${data.videoLinks.download}`);
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
