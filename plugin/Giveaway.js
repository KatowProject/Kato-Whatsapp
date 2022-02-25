const db = require('../database/schema/Giveaway');

module.exports = class Giveaway {
    constructor(client) {
        this.client = client;
    }

    create(message) {
        return new Promise(async (resolve, reject) => {
            try {
                const getGroupList = await this.client.getAllGroups();

                const arr = [];
                for (const group of getGroupList) arr.push(getGroupAdmins(group.id));
                const availableGroup = arr.filter((a, i) => a[i].includes(message.sender.id));
                if (availableGroup.length < 1) return this.client.reply(message.from, `Maaf, fitur ini hanya bisa digunakan oleh admin grup!`, message.id);

                this.client.sendTextWithMentions(message.from, `Masukkan judul giveaway, kato memberi waktu 30 detik untuk mengisi judul.`, message.id);
                const awaitTitle = this.client.awaitMessages(m => m.sender.id === message.sender.id, { max: 1, time: 30_000, errors: ['time'] });
                const title = await awaitTitle?.first().content;
                if (!title) return this.client.reply(message.from, `Kamu tidak memasukkan judul giveaway atau memberikan nilai yang invalid, permintaan dibatalkan!`);

                this.client.sendText(message.from, `Giveaway berjudul *${title}*, sekarang masukkan durasi giveaway.\n\nFormat:\ns = seconds\nm = minutes\nh = hours\nd = day\n\nContoh:\njika ingin memberikan durasi selama 1 jam, ketik **1h**`, message.id);
                const awaitTime = this.client.awaitMessages(m => m.sender.id === message.sender.id, { max: 1, time: 30000, errors: ['time'] });
                const time = await awaitTime?.first().content;
                if (!time) return this.client.reply(message.from, `Kamu tidak memasukkan durasi giveaway atau memberikan nilai yang invalid, permintaan dibatalkan!`);

                this.client.sendText(message.from, `Giveaway berjudul *${title}* dan berlaku selama *${this.client.util.parseDur(time)}*, sekarang masukkan jumlah pemenang.`);
                const awaitWinner = this.client.awaitMessages(m => m.sender.id === message.sender.id, { max: 1, time: 30000, errors: ['time'] });
                const winner = await awaitWinner?.first().content;
                if (!winner) return this.client.reply(message.from, `Kamu tidak memasukkan jumlah pemenang atau memberikan nilai yang invalid, permintaan dibatalkan!`, message.id);

                this.client.sendButtons(message.from, `Dibuat oleh:\n${message.sender.formattedName}`, [

                ])
            } catch (err) {
                reject(err);
            }
        });
    }
}