const axios = require('axios');
const cheerio = require('cheerio');

exports.run = async (client, message, args) => {
    try {
        let query = args.join(' ')
        if (!query.includes('mbasic.facebook.com')) query = query.replace('facebook.com', 'mbasic.facebook.com');
        const response = await axios.get(query, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
            }
        });
        const data = response.data;
        const $ = cheerio.load(data);
        const video = $('.ci a').attr('href');

        const url = new URL(`https://mbasic.facebook.com${video}`);
        const getparam = url.searchParams.get('src');

        client.sendFileFromUrl(message.from, getparam, `${Date.now()}.mp4`);
    } catch (err) {
        client.reply(message.from, `Something went wrong: ${err.message}`, message.id);
    }

};

exports.conf = {
    aliases: [],
    cooldown: 5,
}

exports.help = {
    name: 'facebook',
    description: 'Get Facebook video link',
    usage: 'facebook',
    example: 'facebook'
}