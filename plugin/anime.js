const WA = require('@open-wa/wa-automate');
const axios = require('axios');

class Kusonime {

    constructor(client) {
        this.client = client;
    }

    getBySearch(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {

                let req = await axios.get(`http://localhost:3000/api/cari/${query}`);
                const res = req.data;

                if (res.length < 1) return message.reply(`Tidak ditemukan judul ${query}!`);
                let chunk = this.client.util.chunk(res, 5);
                let result = chunk[0].map((a, i) => `*${i + 1}. ${a.title}*\n${a.link.url}`);
                
                await client.sendText(message.from, `*Hasil Pencarian*:\n\n${result.join('\n')}\n\n*Penggunaan*:\nSalin URL yang kamu ingin download kemudian jalankan perintah *k!kusonime <URL>*\n\n*Contoh*:\nk!kusonime <URL>\nk!kusonime https://kusonime.com/seitokai-yakuindomo-movie-bd-subtitle-indonesia/`);
                fullfill();         

            } catch (err) {
                reject(err);
                client.reply(message.from, err.message, message.id);
            }
        })       
    }

    getLink(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {

                let req = await axios.get(`http://localhost:3000/api/anime/${query}`);
                const res = req.data;

                //link download
                let p = res.list_download.map((a) => `*${a[0]}*\n${a[1].map(b => `*${b.resolusi}*\n${b.link_download.map(c => `├${c.platform}\n${c.link}`).join('\n')}`).join('\n')}`)
                let caption = 
                `✅ ${res.title}\n├ Genre: ${res.genre.map((a) => `${a.name}`).join(', ')}\n├ Season: ${res.season.name}\n├ Status: ${res.status}\n├ Durasi: ${res.durasi}\n└ Score: ${res.score}\n\n⬇ Link Download\n${p.join('\n')}`
                
                await client.sendImage(message.from, res.thumbnail, res.thumbnail.split('/').pop().replace('.jpg', ''), caption);
                
                fullfill();

            } catch (err) {
                reject(err);
                client.reply(message.from, err.message, message.id);
            }
        })

    }
};

class Samehadaku {

    constructor(client) {
        this.client = client;
    }

    getBySearch(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {
                
                const req = await axios.get(`https://samehadaku-rest-api.herokuapp.com/search/${query}/1`);
                const res = req.data;
    
                if (res.length < 1) return client.reply(message.from, `Tidak ditemukan dengan judul ${query}`, message.id);
                let chunk = this.client.util.chunk(res.results, 5);
                let result = chunk[0].map((a, i) => `*${i + 1}. ${a.title}*\n${a.link}`);
    
                await client.sendText(message.from, `*Hasil Pencarian:*\n${result.join('\n')}\n\n*Penggunaan*:\nSalin URL yang tersedia, kemudian jalankan perintah *k!samehadaku <url>*\n\n*Contoh*:\nk!samehadaku ${chunk[0][0].link}`);
                fullfill();
                
            } catch (err) {

                reject(err);
                client.reply(message.from, `Something went wrong:\n ${err.message}`, message.id);

            }
        });
    }

    getAnime(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {

                const req = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/${query}`)
                const res = req.data;

                if (res.length < 1) return client.reply(message.from, `Tidak ditemukan, Hubungi Developer Secepatnya!`, message.id);
                let Eps = res.list_episode.map((a, i) => `*${i + 1}. ${a.title}*\n${a.link}`);
                let caption = `✅ ${res.title}\n├ Genre: ${res.genre.map((a) => `${a.text}`).join(', ')}\n├ Season: ${res.detail.Season}\n├ Status: ${res.detail.Status}\n├ Durasi: ${res.detail.Duration}\n└ Release: ${res.detail.Rilis}\n\n*List Episode:*\n${Eps.join('\n')}\n\n*Penggunaan:*\nSalin URL yang tersedia, kemudian ketik *k!samehadaku <URL>*\n\n*Contoh*:'\nk!samehadaku ${res.list_episode[0].link}`;
                
                let image = res.image.split('/').pop().split('.').shift();
                await client.sendImage(message.from, res.image.split('?').shift(), image, caption);
                fullfill();

            } catch (err) {
                reject(err);
                client.reply(message.from, err.message, message.id);
            }
        });
    }

    getEps(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {

                const req = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/eps/${query}`);
                const res = req.data;

                if (res.length < 1) return message.reply(`Tidak ditemukan, Segera laporankan ke Developer!`);
                let link = res.downloadEps.map((a) => `*${a.format}* ${a.data.map((aa) => `*(${aa.quality.trim()})*\nZippyShare:\n${aa.link.zippyshare}\nGoogle Drive:\n${aa.link.gdrive}\n`).join('\n')}\n`).join('\n');

                await client.sendText(message.from, `✅${res.title}\n\n${link}`);
                fullfill();

            } catch (err) {
                reject(err);
                client.reply(message.from, `Somehting went wrong: ${err.message}`, message.id);
            }
        });
    }
}

module.exports = {Kusonime, Samehadaku};