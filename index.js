/* eslint-disable no-console */

require('node-json-color-stringify');
const redis = require('redis');

const args = require('args-parser')(process.argv);

if (!args.channel) {
    console.log('Please specified channel using --channel argument.');
    process.exit(0);
}

console.log('Creating redis client');
const client = redis.createClient({ host: 'localhost' });

client.on('subscribe', (channel, count) => {
    console.log(`Channel ${channel} subscribed (count: ${count})`);
});

client.on('message', (channel, message) => {
    let prettyMessage = message;
    try {
        const indent = args.multiline ? 2 : null;
        const obj = JSON.parse(message);
        prettyMessage = JSON.colorStringify(obj, null, indent);
    } catch (e) {
        console.log('Message is not a JSON');
    }

    console.log(prettyMessage);
});

console.log(`Subscribing ${args.channel}`);
client.subscribe(args.channel);
