const axios = require('axios');
class Manga {
    constructor(client) {
        this.client = client;
        this.account = API.agent.login(configDex.username, configDex.password, true);
    }

    komikuSearch(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {

                const req = await axios.get(`https://mangamint.kaedenoki.net/api/search/${query}`);
                let res = req.data;
                if (res.length < 1) return client.reply(message.from, `Pencarian Judul ${query} tidak ditemukan!`);
                res = res.manga_list;

                const mangaList = res.map((a, i) => `*${i + 1}. ${a.title}*\n${'https://komiku.id/manga/' + a.endpoint}`);
                await client.sendText(message.from, `*Hasil Pencarian*:\n\n${mangaList.join('\n')}\n\n*Penggunaan*:\ncopas URL yang tersedia, kemudian jalankan perintah *k!komiku manga <URL>*`);

                fullfill();

            } catch (err) {
                reject(err);
                return client.sendText(message.from, `Something went wrong:\n${err.message}`);
            }

        })
    }

    komikuManga(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {

                const req = await axios.get(`https://mangamint.kaedenoki.net/api/manga/detail/${query}`);
                const res = req.data;
                if (res.length < 1) return client.reply(message.from, `Terjadi kesalahan pada API, silahkan laporkan ke Developer!`);

                let about = `*${res.type} | ${res.title}*\n\n*Author*: ${res.author}\n*Status*: ${res.status}\n*Genre*: ${res.genre_list.map(a => a.genre_name).join(', ')}\n\n*Penggunaan*:\nKlik URL untuk mendownload manga dengan format zip!`
                let chapter = `*Chapter List | ${res.title}*\n\n ${res.chapter.map((a, i) => `*${i + 1}. ${a.chapter_title}*\n${'https://mangadl-katow.herokuapp.com/download/komiku/' + a.chapter_endpoint}zip`).join('\n')}`

                let image = res.thumb.split('/').pop().split('?').shift();

                await client.sendImage(message.from, res.thumb.split('?').shift(), image, about);
                await client.sendText(message.from, chapter);

                fullfill();

            } catch (err) {
                reject(err);
                return client.sendText(message.from, `Something went wrong:\n${err.message}`);
            }
        })
    }
}

module.exports = Manga;