const path = require("path")
const fs = require("fs")

const phrasesFilePath = path.join(__dirname, "phrases.json")
const chatIdFilePath = path.join(__dirname, "chatId.txt")
const intervalFilePath = path.join(__dirname, "interval.txt")
const lastMessageTimeFilePath = path.join(__dirname, "interval.txt")

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

async function setLastMessageTime(lastMessageTime = new Date().getTime())
{
    fs.writeFileSync(lastMessageTimeFilePath, lastMessageTime.toString(), "utf-8")
}

module.exports = { getPhrases, addPhrase, getChat, changeChat, getInterval, changeInterval, getLastMessageTime, setLastMessageTime }