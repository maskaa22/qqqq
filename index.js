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


    const {image} = req.files;
    console.log(image)
            let fileName = uuid.v4() + ".jpg";

            // const pathFile = path.resolve(__dirname, 'public', fileName);
            // image.mv(pathFile)

     image.mv(`${__dirname}/public/${fileName}`, err => {

              if (err) {
                console.log(err)
              }
              res.status(500)
            })

            fs.readdir(testFolder, (err, files) => {
              files.forEach(file => {
                console.log(file);
              });
            });

          //   if(!fs.existsSync(uploadDir)) {fs.mkdirSync(uploadDir)};
          //   fs.chmodSync(uploadDir, 0o777)

          //   const tempFilePath = path.join(uploadDir, fileName + '.temp');
          //   fs.writeFile(tempFilePath, image.data, (err) => {
          //     if(err) {
          //       console.log(err)
          //       return res.status(500).send(err)
          //     } 
          //   })
          // const pathFile = path.join(uploadDir, fileName);
          // fs.rename(tempFilePath, pathFile, (err) => {if(err) {
          //   console.log(err)
          //   return res.status(500).send(err)} })
            
           console.log(__dirname)

      return res.send('GOOOOOOd') 


      //  const file = req.file;
       
      //  console.log(22222);
      //  if(!file) {
      //   console.log('NOT IMAGE');
      //    return res.status(400).send('No file');
      //  }
      //  console.log('Image OKKKKK');
      //  return res.send('GOOOOOOd')



      //  const oldPath = file.path;
      //  // const newPath = `uploads/${file.originalname}`;
      //  const newPath = path.join(__dirname, 'uploads', file.originalname);
      //  fs.renameSync(oldPath, newPath);
      //  console.log(newPath);

      //  const imageUrl = `https://telegram-bot-picture-node.onrender.com/${newPath}`;
      //  console.log(imageUrl)


       // const imagePath = path.join(__dirname, 'uploads', file.filename);
       // console.log(imagePath)

       // async function main() {
       //   const response = await openai.chat.completions.create({
       //     model: "gpt-4o",
       //     messages: [
       //       {
       //         role: "user",
       //         content: [
       //           { type: "text", text: "What’s in this image?" },
       //           {
       //             type: "image_url",
       //             image_url: {
       //               url: imageUrl,
       //             },
       //           },
       //         ],
       //       },
       //     ],
       //     max_tokens: 500,
       //   });
       //   console.log(response.choices[0]);
       // }
       // main();
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
