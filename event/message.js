const { Collection } = require('@discordjs/collection');
const cooldowns = new Collection();

module.exports = async (client, message) => {
    let prefix;
    if (!message.text) return;
    if (message.text.toLowerCase().startsWith(client.config.prefix[0])) {
        prefix = client.config.prefix[0];
    } else if (message.text.toLowerCase().startsWith(client.config.prefix[1])) {
        prefix = client.config.prefix[1];
    }

    require('../plugin/afk')(client, message);
    if (!message.text.toLowerCase().startsWith(prefix)) return;

    let args = message.text.slice(prefix.length).trim().split(/ +/g);
    let msg = message.text.toLowerCase();
    let cmd = args.shift().toLowerCase();
    let sender = message.from;

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
        message.flags.push(args.shift().slice(1));
    }

    // let closeGate = db.get('close');
    // if (closeGate) {
    //     if (!client.config.owners.includes(message.sender.id)) return client.sendText(message.from, `Mohon Maaf, saat ini Bot sedang dalam keadaan Maintenance!`);
    // }
    let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!commandFile) return;

    if (!cooldowns.has(commandFile.help.name)) {
        cooldowns.set(commandFile.help.name, new Map());
    };

    const member = message.from;
    const now = Date.now();
    const timestamps = cooldowns.get(commandFile.help.name);
    const cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;

    if (!timestamps.has(member)) {
        if (!client.config.owners.includes(message.sender.id)) {
            timestamps.set(member, now);
        }
    } else {
        const expirationTime = timestamps.get(member) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return client.reply(message.from, `Kamu bisa menggunakan perintah ini setelah ${timeLeft} detik!`, message.id);
            // Bisa diubah teks nya, kalo misalnya user nya lagi cooldown.
        }

        timestamps.set(member, now);
        setTimeout(() => timestamps.delete(member), cooldownAmount);
    }

    try {
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        command.run(client, message, args);
    } catch (e) {
        console.log(e.message);
    } finally {
        console.log(`ID: ${sender} ran ${cmd}`);
    }


}