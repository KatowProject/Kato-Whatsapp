const WA = require('@open-wa/wa-automate');
const axios = require('axios');
const yt = require('youtube-sr').default;

exports.run = async (client, message, args) => {

    let query = args.join(' ');

    if (query.startsWith('http')) {
        query = query.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1];
    } else {
        const search = await yt.search(query, { limit: 5 });
        return client.sendText(message.from, `*Hasil Pencarian*:\n${search.map((a, i) => `${i + 1}. *${a.title}*\n${a.url}`).join('\n')}\n\n*Penggunaan*:\n Salin URL yang tersedia kemudian ketik k!youtube <URL>\n\n*Contoh:*\nk!youtube <URL>\nk!youtube ${search[0].url}`)
    }
    let data = await axios.get(`https://katowo.glitch.me/api/info/${query}`); data = data.data;

    let temp = { default: [], videoOnly: [] };
    for (i = 0; i < data.video.length; i++) temp.default[i] = `*${i + 1}. ${data.video[i].qualityLabel}*\nhttps://katowo.glitch.me/api/download/${query}/default/${data.video[i].qualityLabel}`;
    for (i = 0; i < data.videoOnly.length; i++) temp.videoOnly[i] = `*${i + 1}. ${data.videoOnly[i].qualityLabel}*\nhttps://katowo.glitch.me/api/download/${query}/videoOnly/${data.videoOnly[i].qualityLabel}`;
    temp.audioOnly = `1. ${data.audioOnly.shift().audioQuality}\nhttps://katowo.glitch.me/api/download/${query}/audioOnly/default`;

    const dl = `*Video with audio*\n${temp.default.join('\n')}\n\n*Audio Only*\n${temp.audioOnly}\n\n*Video Only*\n${temp.videoOnly.join('\n')}`

    await client.sendImage(message.from, data.info.thumbnail.thumbnails.pop().url, data.info.videoId, `*YTDL | ${data.info.title}*\n\n*Durasi*: ${client.util.parseDur(data.info.lengthSeconds * 1000)}\n*ID*: ${data.info.videoId}`);
    await client.sendText(message.from, dl);
};

exports.conf = {
    cooldown: 5,
    aliases: ['ytdl', 'yt']
};

exports.help = {
    name: 'youtube',
    description: 'download video di youtube',
    usage: 'youtube <url/videoId>',
    example: 'youtube '
}