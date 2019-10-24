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
client.on('message', (channel, message) => {
    console.log(message);
});

console.log(`Subscribing ${args.channel}`);
client.subscribe(args.channel);
