const { Scenes } = require("telegraf");
const { changeChat } = require("../functions");

module.exports = new Scenes.WizardScene("changeChatScene",
    ctx => {
        ctx.reply("Введите id чата, в который надо отправлять цитаты\nКак получить chat id? Пересылаем в бота @getmyid_bot сообщение из нужного чата и копируем значение из строки \"Forwarded from\"", {reply_markup: {inline_keyboard: [[{text: "Отмена", callback_data: "cancelChatChanging"}]]}}).catch(err => console.log(err))
        return ctx.wizard.next()
    },
    async ctx => {
        if (ctx?.callbackQuery?.data == "cancelChatChanging") return await cancelChatChanging(ctx)
        if (!ctx?.message?.text) return await ctx.reply("Пожалуйста дайте ответ текстом").catch(err => console.log(err))
        if (!/\d+/ig.test(ctx.message.text)) return await ctx.reply("Пожалуйста отправьте только одно число - chat id").catch(err => console.log(err))
        await ctx.reply("Чат для отправки сообщений успешно обновлен").catch(err => console.log(err))
        await changeChat(ctx.message.text)
        ctx.scene.leave()
    }
)

async function cancelChatChanging(ctx)
{
    ctx.reply("Изменение чата, для отправки сообщений, отменено").catch(err => console.log(err))
    ctx.scene.leave()
}