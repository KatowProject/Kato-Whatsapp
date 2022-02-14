exports.run = async (client, message, args) => {
  try {
    await client.sendText(message.chatId, 'pong!\nLatensi: *' + client.util.ping(message.timestamp, Date.now()) + 'ms*');
  } catch (error) {
    return client.reply(message.from, `Something went wrong: ${error.message}`, message.id);
    // Restart the bot as usual. 
  }
}

exports.conf = {
  aliases: [],
  cooldown: 10
}

exports.help = {
  name: 'ping',
  description: 'Menampilkan pengetesan jaringan bot Kato.',
  usage: 'ping',
  example: 'ping'
}