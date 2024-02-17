const path = require("path")
require("dotenv").config({path: path.join(__dirname, ".env")})
const { Telegraf, Scenes, session } = require("telegraf")
const cron = require("node-cron")
const { randomInt } = require("crypto")
const { getLastMessageTime, getInterval, getPhrases, getChat, setLastMessageTime } = require("./functions")

const bot = new Telegraf(process.env.botToken)

const addPhraseScene = require("./scenes/addPhraseScene")
const changeChatScene = require("./scenes/changeChatScene")
const changeIntervalScene = require("./scenes/changeIntervalScene")

const stage = new Scenes.Stage([addPhraseScene, changeChatScene, changeIntervalScene])

bot.use(session());
bot.use(stage.middleware())

const admins = [6952299846, 1386450473]

bot.start(ctx => {
    if (!admins.includes(ctx.from.id)) return
    ctx.reply("Возможности бота:\n/addPhrase - добавить цитату\n/changeChat - сменить чат, куда будут отправляться цитаты\n/changeInterval - изменить интервал между сообщениями").catch(err => console.log(err))
})

bot.command("addPhrase", ctx => {
    if (!admins.includes(ctx.from.id)) return
    ctx.scene.enter("addPhraseScene")
})

bot.command("changeChat", ctx => {
    if (!admins.includes(ctx.from.id)) return
    ctx.scene.enter("changeChatScene")
})

bot.command("changeInterval", ctx => {
    if (!admins.includes(ctx.from.id)) return
    ctx.scene.enter("changeIntervalScene")
})

cron.schedule("0 * * * *", async function ()
{
    const lastMessageTime = Number(await getLastMessageTime())
    const intervalInHours = Number(await getInterval())
    const timeForNewMessage = lastMessageTime + intervalInHours * 60 * 60 * 1000
    
    if (timeForNewMessage < new Date().getTime()) return
    const phrases = await getPhrases();
    await bot.telegram.sendMessage(await getChat(), phrases[randomInt(phrases.length)], { parse_mode: "HTML" }).catch(err => console.log(err))
    await setLastMessageTime(new Date().getTime())
})

bot.launch();

(async function ()
{
    if (Number(await getLastMessageTime()) == 0) await setLastMessageTime(new Date().getTime())
})()