

exports.run = async (client, message, args) => {
    const roll = parseInt(args[0]);
    if (!roll) return client.reply(message.from, 'Kamu harus memasukkan jumlah roll!', message.id);
    if (roll > 10) return client.reply(message.from, 'Jumlah roll tidak boleh lebih dari 10!', message.id);

    const items = gachaLogic(roll);
    const caption = `*Bog - Gacha*\n\n${items.join('\n')}\n\nRoll: ${roll}\n\nGacha Rate:\nR = 94.3 | SR = 5.1 | SSR = 0.6`;
    client.reply(message.from, caption, message.id);

    function gachaLogic(roll) {
        const ssr_rate = 0.6;
        const sr_rate = 5.1;
        const r_rate = 94.3;

        let weight = ssr_rate + sr_rate + r_rate;
        let random = () => Math.random() * weight;

        const items = [];
        for (i = 1; i <= roll; i++) {
            const r = random().toFixed(2);
            if (r < ssr_rate) {
                items.push(`*SSR* di roll ke-${i} | *${r}*%`);
            } else if (r < ssr_rate + sr_rate) {
                items.push(`*SR* di roll ke-${i} | *${r}*%`);
            } else if (r < ssr_rate + sr_rate + r_rate) {
                items.push(`*R* di roll ke-${i} | *${r}*%`);
            } else {
                items.push(`*SSR* di roll ke-${i} | *${r}*%`);
            }
        }

        return items;
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'bog',
    description: 'Gacha',
    usage: 'bog',
    example: 'bog'
}