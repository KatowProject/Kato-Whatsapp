
const { create, Client } = require('@open-wa/wa-automate');
const Util = require('./handler/Util');
const { Kusonime, Samehadaku } = require('./plugin/anime');
const Manga = require('./plugin/manga');

const start = (client = new Client()) => {

    require('./handler/module.js')(client);
    require('./handler/events.js')(client);
    
    client.commands = new Map();
    client.cooldown = new Map();
    client.aliases = new Map();
    client.recent = new Set();
    client.util = new Util();
    client.package = require('./package.json');
    client.config = require('./config.json');
    client.kusonime = new Kusonime(client);
    client.samehadaku = new Samehadaku(client);
    client.manga = new Manga(client);
    client.db = require('quick.db');

}


process.on("unhandledRejection", (reason, promise) => {

    console.error("Unhandled Rejection at:", reason.stack || reason);
    console.error(reason);

});
  
process.on("uncaughtException", err => {

    console.error(new Date());
    console.error(`Caught exception: ${err}`);
    console.error(err);
    if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
      console.error("true");
    }

});

const options = {
    sessionId: 'Kato',
    headless: true,
    qrTimeout: 0,
    authTimeout: 0,
    restartOnCrash: start,
    cacheEnabled: false,
    useChrome: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
};

create(options)
    .then((client) => start(client))
    .catch((err) => new Error(err))