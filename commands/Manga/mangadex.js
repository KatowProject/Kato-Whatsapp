const WA = require('@open-wa/wa-automate');
const { lang } = require('./lang.json');

exports.run = async (client, message, args) => {

    if (!args[0]) return message.reply(`Case Perintah:\n*search*\n*id*\n\n*Contoh*:\n\`\`\`k!mangadex search <lang> <judul>\`\`\``);
    
    switch (args[0]) {

        case 'search': 
            args.shift();


            if (!lang.includes(args[0])) return client.reply(message.from, `Masukin bahasanya dulu!\n\n*List Bahasa*:\n${lang.join(' | ')}\n\n*Penggunaan*: \`\`\`k!mangadex search <lang> <judul>\`\`\`*Contoh*: \`\`\`k!mangadex search ID Kanojo okarishimasu\`\`\``, message.id);
            if (!args[1]) return client.reply(message.from, `Masukin Judulnya!`, message.id);

            await client.manga.mangadexSearch(client, message, args);

        break;

        case 'id':
            args.shift();

            if (!lang.includes(args[0])) return client.reply(message.from, `Masukin bahasanya dulu!\n\n*List Bahasa*:\n${lang.join(' | ')}\n\n*Penggunaan*: \`\`\`k!mangadex search <lang> <judul>\`\`\`*Contoh*: \`\`\`k!mangadex id GB Kanojo okarishimasu\`\`\``, message.id);
            if (!args[1]) return client.reply(message.from, `Masukin ID-nya dulu`, message.id);   
            await client.manga.mangadexID(client, message, args);

        break;

        default:
            client.reply(message.from, 'case yang kamu minta, tidak tersedia di sini silahkan cek case perintah dengan menjalankan *k!mangadex*', message.id);
        break;
            
    };





};

exports.conf = {
    aliases: ['manga', 'mangade'],
    cooldown: 5
};

exports.help = {
    name: 'mangadex',
    description: 'mangadex downloader',
    usage: 'mangadex',
    example: 'mangadex'
}