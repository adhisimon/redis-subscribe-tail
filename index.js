/* eslint-disable no-console */

// require('node-json-color-stringify');
const jclrz = require('json-colorz');
const bashTitle = require('node-bash-title');

const redis = require('redis');

const args = require('args-parser')(process.argv);

let alterBashTitleIdx = 0;

function alterBashTitle(title) {
    const titleTwice = `${title} -  ${title}`;
    bashTitle(titleTwice.slice(alterBashTitleIdx, alterBashTitleIdx + title.length));

    alterBashTitleIdx += 1;
    if (alterBashTitleIdx >= title.length) alterBashTitleIdx = 0;
}

if (!args.channel) {
    console.log('Please specified channel using --channel argument.');
    process.exit(0);
}

process.title = args.channel;

alterBashTitle(args.channel);
setInterval(() => {
    alterBashTitle(args.channel);
}, 1000);

console.log('Creating redis client');
const client = redis.createClient({ host: 'localhost' });

client.on('subscribe', (channel, count) => {
    console.log(`Channel ${channel} subscribed (count: ${count})`);
});

client.on('message', (channel, message) => {
    try {
        const obj = JSON.parse(message);
        jclrz.level.show = args.multiline;

        jclrz(obj);
    } catch (e) {
        console.log(message);
    }
});

console.log(`Subscribing ${args.channel}`);
client.subscribe(args.channel);
