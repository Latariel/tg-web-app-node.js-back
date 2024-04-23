const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6878750211:AAGbqBTanCD0LS1GWk27IlGbLq-Rbs2IXZU';

const bot = new TelegramBot(token, {polling: true});
const app =  express();


app.use(express.json())
app.use(cors())

const WebAppUrl = 'https://magenta-griffin-8f951b.netlify.app'

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'кнопочька on form', {
            reply_markup: {
                keyboard: [
                    [{text: 'form', web_app: {url: WebAppUrl + '/form'}}]
                ]
            }
        })
    }


        if (text === '/start'){
            await bot.sendMessage( chatId, 'купи пчелок', {
                reply_markup: {
                    inline_keyboard: [
                        [ {text: 'купить приколы', web_app: {url: WebAppUrl }}]
                    ]
                }
            })

    }

        if(msg?.web_app_data?.data) {
            try {
                const data = JSON.parse(msg?.web_app_data?.data)
                console.log(data)
                await bot.sendMessage(chatId,'спасибо за обратную связь');
                await bot.sendMessage(chatId,'ваш ужин на сегодня: ' + data?.country);
                await bot.sendMessage(chatId,'сегодня вы должны съесть покемонов: ' + data?.street);

                setTimeout(async () => {
                    await bot.sendMessage(chatId,'всю информацию вы получить в этом чате');


                }, 3000)
            } catch (e) {
            console.log(e)
            }


        }
    // bot.sendMessage(chatId, 'Received your message');
});


app.post('/web-data', async (req,res) =>{
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'успешная покупка',
            input_message_content: {
                message_text: 'поздравляю с покупкой, вы приняты в команду бандерлогов и приобрели товар на сумму: ' + totalPrice
            }
        })
        return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'не удалось приобрести товары ',
            input_message_content: {
                message_text: 'не удалось стать бандерлогом '
            }
        })
    }

    return res.status(500).json({});


})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))