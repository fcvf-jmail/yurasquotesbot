const { Scenes } = require("telegraf");
const { changeInterval } = require("../functions");

module.exports = new Scenes.WizardScene("changeIntervalScene",
    ctx => {
        ctx.reply("Чтобы изменить интервал отправки сообщения, отправьте одно число - кол-во часов между сообщениями", {reply_markup: {inline_keyboard: [[{text: "Отмена", callback_data: "cancelIntervalChanging"}]]}})
        return ctx.wizard.next()
    },
    async ctx => {
        if (ctx?.callbackQuery?.data == "cancelIntervalChanging") return await cancelIntervalChanging(ctx)
        if (!ctx?.message?.text) return await ctx.reply("Пожалуйста дайте ответ текстом")
        if (!/\d+/ig.test(ctx.message.text)) return await ctx.reply("Пожалуйста отправьте только одно число - кол-во часов между сообщеняими")
        await changeInterval(ctx.message.text)
        ctx.reply("Интервал отправки сообщений успешно изменен")
        ctx.scene.leave()
    }
)

async function cancelIntervalChanging(ctx)
{
    ctx.reply("Изменение интервала отправки сообщений отменено")
    ctx.scene.leave()
}