const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {

    if (!args[0]) return client.reply(message.from, `Case Perintah*:\n\n*search*\n*manga*\n\n*Contoh*:\n\`\`\`k!komiku search kanojo\`\`\``, message.id);
    switch(args[0]) {
        
        case 'search':
            args.shift();

            if (!args[0]) return client.reply(message.from, `Masukin judulnya dulu!`, message.id);
            await client.manga.komikuSearch(client, message, args.join('%20'));
        
        break;

        case 'manga':
            args.shift();

            if (!args[0]) return client.reply(message.from, `Masukin *URL*-nya dulu!`);
            const argsURL = args[0].includes('https') ? args[0].replace('https://komiku.id/manga/', '') : args[0];

            await client.manga.komikuManga(client, message, argsURL);

        break;

        default:
            client.reply(message.from, `Case yang kamu tulis tidak tersedia di perintah ini, silahkan ketik *k!komiku* untuk lebih jelasnya!`);
        break;

    }

}

exports.conf = {
    aliases: ['komi', 'komik'],
    cooldown: 10
}

exports.help = {
    name: 'komiku',
    description: 'komiku mangaDL',
    usage: 'komiku <search/manga> <judul/URL>',
    example: 'komiku search kanojo'
}