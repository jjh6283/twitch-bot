// make environment vars specified in .env file available for node process
require ('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    website: {
        response: 'https://twitch.tv/jujubearsx'
    },
    
    upvote: {
        response: (user) => `User ${user} was just upvoted`
    }
}

const client = new tmi.Client({

    identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},

    // channels bot will listen in on
	channels: [ 'jujubearsx' ]
    
});

client.connect();

// anytime the client gets a message, this gets fired
client.on('message', (channel, tags, message, self) => {
    const isNotBot = tags.username.toLowerCase() != process.env.TWITCH_BOT_USERNAME

    if (!isNotBot) return;

    const [raw, command, argument] = message.match(regexpCommand);

    const {response} = commands[command] || {};

    if (typeof response === 'function') {
        client.say(channel, response(tags.username));
    }
    else if (typeof response === 'string') {
        client.say(channel, response);
    }

    if (command) {
        client.say(channel, `Command ${command} found with argument ${argument}`)
    }

    /*
    if(isNotBot) {
        client.say(channel, `Message "${message}" was sent by ${tags.username}`)
    }*/

	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
});