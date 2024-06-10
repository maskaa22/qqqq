const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const {OpenAI} = require('openai');
const uuid = require("uuid");
const fileUpload = require('express-fileupload');


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
// app.use(express.static('uploads'));
// app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.static('public'));
app.use(fileUpload());
app.use(cors({origin: true}));



const TelegramBot = require('node-telegram-bot-api');

const token = '7192604167:AAEqdRty9vz7RToy1XVSGrHKEbE6t5W9lo0';
const webAppUrl = process.env.WEBAPPURL || 'https://telegram-bot-picture-react.vercel.app/';

const bot = new TelegramBot(token, { polling: {
  interval: 1000
} });

// const uploadDir = path.join(__dirname, 'uploads');
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {cb(null, uploadDir)},
//   filename: (req, file, cb) => {cb(null, file.originalname)}
// })
// const upload = multer({storage});

bot.on('message', async (msg) => {
  //console.log('111212')
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Вітаю тебе в нашому чат-боті');

    await bot.sendMessage(chatId, 'Завантаж свою картинку нижче', {
      reply_markup: {
        keyboard: [
          [{ text: 'Заповни форму', web_app: { url: webAppUrl } }]
        ]
      }
    })

  }

  if (msg?.web_app_data?.data) {
    try {
      
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, 'Good' + data.base64Image)

    } catch (e) {
      console.log(e)
    }
  }


});

const uploadDir = path.join(__dirname, 'public');
app.post("/upload-image", async (req, res) => {
  // console.log('00000');
 
   const openai = new OpenAI({
     apiKey: process.env.OPENAIKEY ||'sk-proj-bEOnz5Ufafy7sy1uHTtFT3BlbkFJr9ZhF4VIxGdB1cHmJB6S'
   });

   try {
    console.log(11111);

    const tempFilePath = path.join(__dirname, 'temp.txt');
    fs.writeFileSync(tempFilePath, 'Это временный файл');
    console.log('Great', tempFilePath)


    const {image} = req.files;
    console.log(image)
            let fileName = uuid.v4() + ".png";

    image.mv(`${__dirname}/public/${image.name}`, err => {

              if (err) {
                console.log(err)
              }
              res.status(500)
            })

            fs.readdir(`${__dirname}/public`, (err, files) => {
              files.forEach(file => {
                console.log(file);
              });
            });

           console.log(__dirname)

      return res.send('GOOOOOOd') 

   } catch(err) {
     console.log(err);
   }

 })

 app.get('uploads/:imageName', (req, res) => {
   const imageName = req.params.imageName;
   console.log(imageName)
 })
 app.get('/', (req, res) => {
  res.send({
    'name': 'Maria'
  })
})

app.listen(port, () => console.log('server started on Port ' + port));
