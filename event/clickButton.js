module.exports = (client, message) => {
    if (message.selectedButtonId !== "giveaway-kato") return;
    console.log(message.from, message.id);
    client.sendTextWithMentions(message.from, `@${message.sender.id.replace('@c.us', '')}, Berhasil mengikuti giveaway!`);
};