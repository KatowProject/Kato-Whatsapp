const WA = require('@open-wa/wa-automate');
const axios = require('axios');

class Kusonime {
    constructor(client) {
        this.client = client;
    }

    getBySearch(client, message, query) {
        return new Promise(async (fullfill, reject) => {
            try {
                let req = await axios.get(`http://posantai.bugs.today/kusonime/api/cari/${query}`);
                const res = req.data;

                if (res.length < 1) return client.reply(message.from, `Tidak ditemukan judul ${query}!`, message.id);
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

                let req = await axios.get(`http://posantai.bugs.today/kusonime/api/anime/${query}`);
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
                const req = await axios.get(`https://samehadaku-rest-api.herokuapp.com/anime/${query}`);
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

class Otakudesu {
    constructor(client) {
        this.client = client;
    }

    getBySearch(message, query) {
        return new Promise(async (fullfill, reject) => {
            try {
                const response = await axios.get(`http://komikato.bugs.today/api/otakudesu/search/${query}`);
                const data = response.data.data;

                if (data.length < 1) reject(`Tidak ditemukan dengan judul ${query}`);
                const animes = this.client.util.chunk(data, 5);

                const txt = `*Hasil Pencarian*:\n${animes[0].map((a, i) => `*${i + 1}. ${a.name}*\n${a.url}`).join('\n')}\n\n*Penggunaan*:\nSalin URL yang tersedia, kemudian jalankan perintah *k!otakudesu <url>*\n\n*Contoh*:\nk!otakudesu ${animes[0][0].url}`;
                this.client.sendText(message.from, txt);

                fullfill(txt);
            } catch (err) {
                reject(err);
            }
        });
    }

    getDetail(message, query) {
        return new Promise(async (fullfill, reject) => {
            try {
                const response = await axios.get(`http://komikato.bugs.today/api/otakudesu/anime/detail/${query}`);
                const data = response.data.data;

                const eps = data.eps.find(a => a.type === 'List').data;
                let dl = eps.map((a, i) => `*${i + 1}. ${a.title}*`);
                let description =
                    `✅ ${data.main_title}\n├ Genre: ${data.genre}\n├ Season: ${data.episodes}\n├ Status: ${data.status}\n├ Durasi: ${data.duration}\n└ Score: ${data.skor}\n\n⬇ Link Episode\n${dl.join('\n')}`
                await this.client.sendImage(message.from, data.thumb, 'otakudesu', description);
                await this.client.reply(message.from, `*Penggunaan:*\npilih Episode menggunakan angka yang tersedia di atas.\n\nKato memberi waktu selama 1 menit untuk memilih!`, message.id);

                const collector = this.client.createMessageCollector(message.from, m => m.sender.id === message.sender.id, { time: 60_000, max: 1 });
                collector.on('collect', m => {
                    if (m.body.toLowerCase() === 'cancel') {
                        collector.stop();
                        this.client.reply(message.from, `Dihentikan!`, message.id);
                    }

                    const toInt = parseInt(m.body);
                    if (!toInt) return this.client.reply(message.from, `Gunakan angka untuk melanjutkan!`, message.id);

                    this.getLink(message, eps[toInt - 1].endpoint);
                    collector.stop();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    getLink(message, query) {
        return new Promise(async (fullfill, reject) => {
            try {
                const response = await axios.get(`http://komikato.bugs.today/api/otakudesu/anime/eps${query}`);
                const data = response.data.data;

                let link = data.download_link.map((a, i) => {
                    const f = a.name;
                    const link = a.data.map((b, j) => `*${b.title}*\n${b.url}`).join('\n');

                    return `*${f}*\n${link}`;
                }).join('\n\n');

                await this.client.sendText(message.from, `✅${data.title}\n\n${link}`);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = { Kusonime, Samehadaku, Otakudesu };