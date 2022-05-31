const db = require('../database/schema/Giveaway');
const crypto = require('crypto');
const ms = require('ms');
module.exports = class Giveaway {
    constructor(client) {
        this.client = client;
    }

    create(message) {
        return new Promise(async (resolve, reject) => {
            try {

                const getAdminGroup = await  this.client.getGroupAdmins(message.from);
                if (getAdminGroup.includes('ERROR')) return this.client.reply(message.from, 'Kamu tidak sedang dalam grup!', message.id);
                if (!getAdminGroup.includes(message.sender.id)) return this.client.reply(message.from, `Maaf, fitur ini hanya bisa digunakan oleh admin grup!`, message.id);

                this.client.sendTextWithMentions(message.from, `Masukkan judul giveaway, kato memberi waktu 30 detik untuk mengisi judul.`, message.id);
                const awaitTitle = await this.client.awaitMessages(message.from, m => m.sender.id === message.sender.id, {max: 1, time: 30_000, errors: ['time']})
                const title = awaitTitle?.first().content;
                if (!title) return this.client.reply(message.from, `Kamu tidak memasukkan judul giveaway atau memberikan nilai yang invalid, permintaan dibatalkan!`);

                this.client.sendText(message.from, `Giveaway berjudul *${title}*, sekarang masukkan durasi giveaway.\n\nFormat:\ns = seconds\nm = minutes\nh = hours\nd = day\n\nContoh:\njika ingin memberikan durasi selama 1 jam, ketik **1h**`, message.id);
                const awaitTime = await this.client.awaitMessages(message.from, m => m.sender.id === message.sender.id, {max: 1, time: 30_000, errors: ['time']})
                const time = awaitTime?.first().content;
                const dur = ms(time);
                if (!time) return this.client.reply(message.from, `Kamu tidak memasukkan durasi giveaway atau memberikan nilai yang invalid, permintaan dibatalkan!`);

                this.client.sendText(message.from, `Giveaway berjudul *${title}* dan berlaku selama *${this.client.util.parseDur(dur)}*, sekarang masukkan jumlah pemenang.`);
                const awaitWinner = await this.client.awaitMessages(message.from, m => m.sender.id === message.sender.id, {max: 1, time: 30_000, errors: ['time']})
                const winner = awaitWinner?.first().content;
                if (!winner) return this.client.reply(message.from, `Kamu tidak memasukkan jumlah pemenang atau memberikan nilai yang invalid, permintaan dibatalkan!`, message.id);

                const id = crypto.randomBytes(16).toString('hex');
                const msg = `\t🎉 Giveaway 🎉*\n*${title}*\n\nID: ${id}\nDibuat oleh: @${message.sender.id.replace('@c.us', '')}\nDurasi: ${this.client.util.parseDur(dur)}\nPemenang: ${winner} pemenang\n\nApakah kamu sudah yakin? (y/n)`;
                this.client.sendTextWithMentions(message.from, msg);
                
                const awaitConfirm = await this.client.awaitMessages(message.from, m => m.sender.id === message.sender.id, {max: 1, time: 30_000, errors: ['time']})
                const confirm = awaitConfirm?.first().content;
                if (!confirm) return this.client.reply(message.from, `Kamu tidak memasukkan jawaban atau memberikan nilai yang invalid, permintaan dibatalkan!`, message.id);

                if (confirm.toLowerCase() === 'y') {
                    const getAllMembers = await this.client.getGroupMembersId(message.from);
                    const giveaway = new db({
                        id,
                        title,
                        duration: dur,
                        winner,
                        created: Date.now(),
                        ended: false,
                        winner_id: null
                    });
                    await giveaway.save();

                    for (const member of getAllMembers) {
                        this.client.sendButtons(member, msg, [{ id: 'giveaway_' + id, text: '🎉' }]);
                    }
                }


            } catch (err) {
                reject(err);
            }
        });
    }
}