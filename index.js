/* eslint-disable no-console */

// require('node-json-color-stringify');
const jclrz = require('json-colorz');

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
    try {
        const obj = JSON.parse(message);
        jclrz.level.show = args.multiline;

        jclrz(obj)
    } catch (e) {
        console.log(message);
    }
});

console.log(`Subscribing ${args.channel}`);
client.subscribe(args.channel);
