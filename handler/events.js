module.exports = client => {
    client.onMessage(message => {
        client.getAmountOfLoadedMessages().then((msg) => (msg >= 3000) && client.cutMsgCache());

        require('../event/message')(client, message);
    });

    client.onStateChanged((state) => {
        console.log('[Client State]', state);
        if (state === 'CONFLICT' || state === 'DISCONNECTED') client.forceRefocus();
    });

    client.onButton(message => {
        require('../event/clickButton')(client, message);
    });
}