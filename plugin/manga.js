const axios = require('axios');
class Komikindo {
    constructor(client) {
        this.client = client;
    }

    getBySearch(message, query) {
        return new Promise(async (fullfill, reject) => {
            try {
                const response = await axios.get(`https://komikato.katowproject.ink/api/komikindo/cari/${query}/page/1/`);
                const data = response.data.data;
                if (data.manga.length < 1) return client.reply(message.from, `Tidak ditemukan dengan judul ${query}`, message.id);

                const result = data.manga.map(a => `*${a.title}*\n${a.link.url}`).join('\n');
                await this.client.sendText(message.from, `*Hasil Pencarian:*\n${result.join('\n')}\n\n*Penggunaan*:\nSalin URL yang tersedia, kemudian jalankan perintah *k!komikindo <url>*\n\n*Contoh*:\nk!samehadaku ${data.manga[0].link.url}`);

                fullfill(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    getDetail(message, query) {
        return new Promise(async (fullfill, reject) => {
            try {
                const response = await axios.get(`https://komikato.katowproject.ink/api/komikindo/${query}`);
                const data = response.data.data;

                const chap = data.chapters.map((a, i) => `*${i + 1}. ${a.title}*`).join('\n');
                let description = `✅ ${data.title}\n├ Genre: ${res.genre.map((a) => `${a.name}`).join(', ')}\n├ Alter: ${data.alter.join(', ')}\n├ Status: ${data.status}\n├ Pengarang: ${data.pengarang}\n└ Tema: ${data.tema[0].name}\n\n*List Episode:*\n${chap.join('\n')}\n\n*Penggunaan:*\nSalin URL yang tersedia, kemudian ketik *k!samehadaku <URL>*\n\n*Contoh*:'\nk!samehadaku ${res.list_episode[0].link}`;
                await this.client.sendImage(message.from, data.thumb, 'otakudesu', description);
                await this.client.reply(message.from, `*Penggunaan:*\npilih Chapter menggunakan angka yang tersedia di atas.\n\nKato memberi waktu selama 1 menit untuk memilih!`, message.id);

                const collector = this.client.createMessageCollector(message.from, m => m.sender.id === message.sender.id, { time: 60_000, max: 1 });
                collector.on('collect', async m => {
                    if (m.body.toLowerCase() === 'cancel') {
                        collector.stop();
                        this.client.reply(message.from, `Dihentikan!`, message.id);
                    }

                    const toInt = parseInt(m.body);
                    if (!toInt) return this.client.reply(message.from, `Gunakan angka untuk melanjutkan!`, message.id);

                    const caption = `*Baca Manga*\nhttps://komikato.katowproject.ink/komikindo/chapter/${data.chapters[toInt - 1].endpoint}\n\n*Download Manga*\nhttps://komikato.katowproject.ink/komikindo/download/${data.chapters[toInt - 1].endpoint}`;
                    await this.client.sendText(message.from, caption);
                    collector.stop();
                });

                fullfill(data);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = { Komikindo };