const { Scenes } = require("telegraf");
const { addPhrase } = require("../functions");

module.exports = new Scenes.WizardScene("addPhraseScene",
    async ctx => {
        ctx.scene.session.state.phrase = "";
        const example = "<b><u>Какой-то жирный и подчеркнутый текст</u></b> + <i>какой-то курсивный текст</i> + <b>какой-то жирный текст</b> + <s>Какой-то зачеркнутый текст</s>";
        await ctx.reply("Введите текст для новой цитаты. Чтобы добавить форматирование, используйте теги. Список поддерживаемых тегов:\n<b>Жирный шрифт</b>\n<i>Курсив</i>\n<u>Подчеркнутый текст</u>\n<s>Зачеркнутый текст</s>\n\nПример использования:\n" + example).catch(err => console.log(err))
        await ctx.replyWithHTML("В итоге отформатированный текст будет выглядеть так:\n\n" + example).catch(err => console.log(err))
        await ctx.reply("Теперь, зная, как пользоваться форматированием, отправьте цитату с нужными тегами", { reply_markup: { inline_keyboard: [[{ text: "Отмна", callback_data: "cancel" }]]}}).catch(err => console.log(err))
        return ctx.wizard.next();
    },
    async ctx => {
        if (ctx?.callbackQuery?.data == "cancel") return await cancelAdding(ctx)
        if (!ctx?.message?.text) return await ctx.reply("Пожалуйста дайте ответ текстом").catch(err => console.log(err))
        const errors = await checkHtmlTags(ctx.message.text);
        if (errors) return await ctx.reply(`Обнаружены ошибки:\n\n${errors.join("\n")}`, { reply_markup: { inline_keyboard: [[{ text: "Назад", callback_data: "toPreviousStep" }]]}}).catch(err => console.log(err))
        await ctx.replyWithHTML(`Цитата будет выглядеть вот так:\n\n${ctx.message.text}\n\nПодтверждаете добавление?`, { reply_markup: { inline_keyboard: [[{ text: "Да", callback_data: "confirmAdding" }], [{ text: "Назад", callback_data: "toPreviousStep" }]]}}).catch(err => console.log(err))
        ctx.scene.session.state.phrase = ctx.message.text;
        return ctx.wizard.next()
    },
    ctx => {
        if (!["confirmAdding", "toPreviousStep"].includes(ctx?.callbackQuery?.data)) return ctx.reply("Выберите одну из кнопок").catch(err => console.log(err))
        if (ctx.callbackQuery.data == "toPreviousStep") return ctx.scene.reenter();
        ctx.reply("Цитата успешно добавлена").catch(err => console.log(err))
        addPhrase(ctx.scene.session.state.phrase);
        ctx.scene.leave()
    }
)

async function cancelAdding(ctx)
{
    ctx.reply("Добавление новой цитаты отменено").catch(err => console.log(err))
    ctx.scene.leave()
}

async function checkHtmlTags(string)
{
    const errors = [];

    const tags =
    {
        "<b>": "</b>",
        "<i>": "</i>",
        "<u>": "</u>",
        "<s>": "</s>"
    }

    for (const key in tags)
    {
        const amountOfOppenedTags = string.match(new RegExp(key, "g"))?.length ?? 0
        const amountOfClosedTags = string.match(new RegExp(tags[key], "g"))?.length ?? 0
        if (amountOfOppenedTags > amountOfClosedTags) errors.push(`Нет закрывающегося тега ${key}. Для того, чтобы его добавить допишите ${tags[key]}`)
        if (amountOfOppenedTags < amountOfClosedTags) errors.push(`Нет открывающегося тега ${key}. Для того, чтобы его добавить допишите ${key}`)
    }
    
    const allTags = string.match(/<\w+/g) || []; // Регулярное выражение для поиска всех тегов
    for (const tag of allTags)
    {
        const tagName = tag.substring(1);
        if (!Object.keys(tags).includes(`${tag}>`)) errors.push(`Вы используете неподдерживаемый тег ${tagName}`);
    }

    return errors.length == 0 ? null : errors
}