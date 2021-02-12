const WA = require('@open-wa/wa-automate');

exports.run = (client, message, args) => {

    try {

        if(!args[0]) {

            let module = Array.from(client.helps);
            let list = module.map(a => {
                return `*${a[1].name}*\n${a[1].cmds.map(x => `${x}`).join(' | ')}`
            });
            client.sendText(message.from, `List Perintah:\n\n${list.join('\n')}\n\n*Penggunaan*:\nk!<perintah>\n\n*Contoh*:\nk!ping\n\n*[] opsional, <> diwajibkan. • Jangan tambahkan simbol ini ketika mengetik sebuah perintah.*`);

        } else {

            let cmd = args[0];
            if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
                let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
                let name = command.help.name;
                let desc = command.help.description;
                let cooldown = command.conf.cooldown;
                let aliases = command.conf.aliases.join(', ') ? command.conf.aliases.join(', ') : 'No aliases provided.';
                let usage = 'k!' + command.help.usage !== undefined ? command.help.usage : "No usage provided.";
                let example = 'k!' + command.help.example !== undefined ? command.help.example : "No example provided."

                return client.sendText(message.from, `*Perintah* \`\`\`${name}\`\`\`\n\n*Deskripsi*: ${desc}\n\n*Penggunaan*: ${usage}\n\n*Aliases*: ${aliases}\n\n*Cooldown*: ${cooldown}\n\n*Contoh*: ${example}`);
            }

            if (!client.commands.has(cmd) || !client.commands.get(client.aliases.get(cmd))) {
                client.reply(message.from, `Tidak ditemukan perintah ${args[0]}!`, message.id);
            }
        }
    } catch (err) {
        client.reply(`Something went wrong:\n${err.message}`, message.id);
    }

};

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'help',
    description: 'list perintah',
    usage: 'help / k!help [nama perintah]',
    example: 'help / k!help help'
}

