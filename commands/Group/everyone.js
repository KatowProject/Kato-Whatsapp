const WA = require('@open-wa/wa-automate');

exports.run = async (client, message, args) => {
    try {
        const groupId = message.chat.groupMetadata.id;
        const getAdmin = await client.getGroupAdmins(groupId);
        const getMembers = await client.getGroupMembers(groupId);

        if (!message.isGroupMsg) return client.reply(message.from, 'Maaf, fitur ini hanya bisa digunakan di grup!', message.id);
        if (!getAdmin.includes(message.sender.id)) return client.reply(message.from, 'Maaf, fitur ini hanya bisa digunakan oleh admin grup!', message.id);

        const tagMember = getMembers.map(member => `@${member.id.replace('@c.us', '')}`);
        client.sendTextWithMentions(groupId, `${args.join(' ')}\n\nTag: ${tagMember.join(', ')}`);
    } catch (err) {
        client.reply(message.from, `Something went wrong:\n${err.message}`, message.id);
    }
};

exports.conf = {
    aliases: ['here'],
    cooldown: 30
}

exports.help = {
    name: 'everyone',
    description: 'Mention semua member grup',
    usage: 'everyone',
    example: 'everyone'
}