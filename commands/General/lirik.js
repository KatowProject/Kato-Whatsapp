const axios = require("axios");
const Kuroshiro = require("@dsquare-gbu/kuroshiro");

exports.run = async (client, message, args) => {
    try {
        let query = args.join(" ");
        if (!query) return client.reply(message.from, `Permintaan tidak boleh kosong`, message.id);
        const option = query.match(/\s?--([\w]+)/g)?.map(x => x.trim());
        if (Kuroshiro.Util.hasJapanese(query)) query = encodeURIComponent(query.replace(/\s?--([\w]+)/g, ""));

        const response = await axios.get(`https://genius-lirik.herokuapp.com/search/${query}?length=1`);
        const data = response.data.data.shift();

        let lyrics = data.lyrics;
        if (option?.includes("--romaji")) lyrics = await client.kuroshiro.convert(lyrics, { to: "romaji", mode: "spaced" });
        const artist = data.artist_names;
        const title = data.full_title;
        const thumb = data.header_image_url;

        client.sendImage(message.from, thumb, "image", `*[${artist}] ${title}*\n\n${lyrics}`);
        if (Kuroshiro.Util.hasJapanese(lyrics) && !option?.includes("--romaji"))
            client.reply(
                message.from,
                `Lirik ini mengandung kata bahasa jepang, tambahkan *--romaji* untuk menampilkan lirik dalam bahasa romaji`,
                message.id
            );

    } catch (err) {
        client.reply(message.from, `Something went wrong:\n${err.message}`, message.id);
    }
}

exports.conf = {
    aliases: ["lirik"],
    cooldown: 5
}

exports.help = {
    name: "lyrics",
    description: "lyrics",
    usage: "lyrics <query> [--romaji]",
    example: "lyrics sayonara memories"
}