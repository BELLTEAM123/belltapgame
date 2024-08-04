const { Telegraf, Markup } = require("telegraf");
const express = require("express");
const cron = require("node-cron");
const app = express();
app.use(express.json());
const TOKEN = "7454146253:AAFVIBrfP7tKJxtEKWb4OoyJ-y12rBpnY5c";
const bot = new Telegraf(TOKEN);
const community_link = process.env.COMMUNITY_LINK || "https://t.me/bell_fi";
const community_links =
    process.env.COMMUNITY_LINK || "https://t.me/Bell_Fi_channel";
const x_links = process.env.x_LINK || "https://twitter.com/bell__fi";
const web_link = "https://app.bellfi.xyz/";

bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;
    ctx.replyWithMarkdown(
        `*Hey, ${userName}!  Welcome to BELL Fi!*
Tap on the bell and see your reward rise.

*BELL Fi* is a  ring-to-earn Web3 game. Bell will be the main utility token in the Bell Fi  Web applications.

Where are your buddies?
Get them  in the play.
More buddies, more rewards.
For  command Click /help `,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Join Channel", url: community_links },
                        { text: "Join Community", url: community_link },
                    ],
                    [{ text: "Follow on X", url: x_links }],
                    [{ text: "👋 Play now!", web_app: { url: urlSent } }],
                ],
                in: true,
            },
        },
    );
});

bot.command('help', (ctx) => {
    const helpMessage = `
Here are the commands you can use:
/start - Start the bot and get your custom link
/help - Show this help message
/community - Get the links to our community channels
/twitter - Get the link to our Twitter profile
    `;
    ctx.replyWithMarkdown(helpMessage);
});

bot.command('community', (ctx) => {
    ctx.replyWithMarkdown(
        'Join our community:',
        Markup.inlineKeyboard([
            [Markup.button.url('Community Group', community_link)],
            [Markup.button.url('Community Channel', community_links)]
        ])
    );
});

bot.command('twitter', (ctx) => {
    ctx.replyWithMarkdown(
        'Follow us on Twitter:',
        Markup.inlineKeyboard([
            [Markup.button.url('Twitter Profile', x_links)]
        ])
    );
});

// Function to send messages to all subscribers
const sendMessageToSubscribers = () => {
    subscribers.forEach((chatId) => {
        bot.telegram.sendMessage(
            chatId,
            'Hello buddy, it is time to play for some amazing rewards while building up your level in the game',
            Markup.inlineKeyboard([
                [Markup.button.url('Community Group', community_link)],
                [Markup.button.url('Community Channel', community_links)],
                [Markup.button.url('Follow us on Twitter', x_links)],
                [{ text: "👋 Play now!", web_app: { url: urlSent } }],                
            ])
        ).catch((err) => {
            console.error(`Failed to send message to ${chatId}`, err);
        });
    });
};

// Schedule the sendMessageToSubscribers function to run every 6 hours
cron.schedule('0 */6 * * *', () => {
    sendMessageToSubscribers();
});

app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
bot.launch();
