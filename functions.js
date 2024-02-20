const path = require("path")
const fs = require("fs")
const moment = require("moment")

const phrasesFilePath = path.join(__dirname, "phrases.json")
const chatIdFilePath = path.join(__dirname, "chatId.txt")
const intervalFilePath = path.join(__dirname, "interval.txt")
const lastMessageTimeFilePath = path.join(__dirname, "lastMessageTime.txt")

async function getPhrases()
{
    return JSON.parse(fs.readFileSync(phrasesFilePath, "utf-8"))
}

async function addPhrase(phrase)
{
    const phrases = await getPhrases();
    phrases.push(phrase);
    fs.writeFileSync(phrasesFilePath, JSON.stringify(phrases, null, 4), "utf-8");
}

async function getChat()
{
    return fs.readFileSync(chatIdFilePath, "utf-8")
}

async function changeChat(chatId)
{
    fs.writeFileSync(chatIdFilePath, chatId.toString(), "utf-8")
}

async function getInterval()
{
    return fs.readFileSync(intervalFilePath, "utf-8")
}

async function changeInterval(hours)
{
    fs.writeFileSync(intervalFilePath, hours.toString(), "utf-8")
}


async function getLastMessageTime()
{
    return fs.readFileSync(lastMessageTimeFilePath, "utf-8")
}

async function setLastMessageTime()
{
    const formattedTime = moment(new Date()).format("DD.MM.YYYY HH")
    fs.writeFileSync(lastMessageTimeFilePath, formattedTime, "utf-8")
}

async function checkDifference(currentTime, timeToCompareWith, differenceInHours) 
{
    const formatedCurrentTime = moment(currentTime)
    const formatedTimeToCompareWith = moment(timeToCompareWith, "DD.MM.YYYY HH")
    return formatedCurrentTime.diff(formatedTimeToCompareWith, "hours") >= differenceInHours
}

module.exports = { getPhrases, addPhrase, getChat, changeChat, getInterval, changeInterval, getLastMessageTime, setLastMessageTime, checkDifference }