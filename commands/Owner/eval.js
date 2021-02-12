const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {

    try {

        if (!client.config.owners.includes(message.sender.id)) return;

        let codeIn = args.join(' ');    
        let code = eval(codeIn);
    
        if(!codeIn) return;
        if (codeIn.includes('process.env.TOKEN')) {
            code = 'xontol';
        } else {
            code = eval(code);
        }
        
        if (typeof code !== 'string') code = require('util').inspect(code, {depth: 0});
        
        await client.sendText(message.from, code);

    } catch (err) {
        return await client.reply(message.from ,`Something went wrong:\n ${err}`, message.id);
    }

};

exports.conf = {
    aliases: [],
    cooldown: 1
};

exports.help = {
    name: 'eval',
    description: 'eval',
    example: 'eval',
    usage: 'eval'
};