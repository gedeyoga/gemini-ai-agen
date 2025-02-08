// import {
//     FunctionDeclarationSchemaType,
//     HarmBlockThreshold,
//     HarmCategory,
//     VertexAI,
//     Reas
//   } from '@google-cloud/vertexai';
//   import axios from 'axios';
  
//   const project = 'openaccess-424403';
//   const location = 'us-central1';
//   const textModel =  'gemini-1.5-flash-001';

  
//   const vertexAI = new VertexAI({
//     project: project, 
//     location: location,
//   });

  

//   const getProductDigitalDeclaration = {
//     name: "getProductDigital",
//     parameters: {
//       type: "OBJECT",
//       description: "Seluruh list produk digital yang tersedia pada platform. Harap menyimpan id dari data produk digital karena akan digunakan untuk mengisi paket_addon_id pada saat membuat order",
//       properties: {},
//       required: [],
//     },
//   };
  
//   // Executable function code. Put it in a map keyed by the function name
//   // so that you can call it once you get the name string from the model.
//   const functions = {
//     getProductDigital: () => {
//       return fetchProductDigitals();
//     }
//   };
  
  
//   // Instantiate Gemini models
//   const generativeModel = vertexAI.getGenerativeModel({
//       model: textModel,
//       // The following parameters are optional
//       // They can also be passed to individual content generation requests
//         safetySettings: [
//             {
//                 category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 
//                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
//             },
//             {
//                 category: HarmCategory.HARM_CATEGORY_HARASSMENT, 
//                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
//             },
//             {
//                 category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, 
//                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
//             },
//             {
//                 category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, 
//                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
//             },
//             {
//                 category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, 
//                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
//             },
//         ],
//       generationConfig: {maxOutputTokens: 256},
//       systemInstruction: {
//         role: 'system',
//         parts: [
//             {
//                 "text": `Anda adalah customer service yang menjual produk digital secara online.
//                 Nama saya adalah eda. Saya seorang wanita berusia 20 tahun. Saya sangat mengerti tentang produk digital seperti netflix dan spotify.
//                 Anda hanya menggunakan informasi produk digital yang hanya tersedia tools.
//                 Anda dapat memberikan informasi yang relevan dengan pertanyaan pengguna atau ringkasan dari konten.
//                 Jika mereka bertanya tentang konten, Anda dapat memberikan detail lebih lanjut.
//                 Jika pengguna tampak tertarik, Anda dapat menyarankan mereka untuk mendaftar atau membeli produk digital.
//                 Jika pengguna tertarik tanyakan durasi berlangganan paket produk digital.
//                 Anda wajib mengingat produk digital yang dipilih pelanggan berupa id dan nama. 
//                 Jika anda tidak mengetahui id produk digital dipilih, cari berdasarkan nama produk digital dan simpan data tersebut.
//                 anda tidak perlu bereaksi ketika sudah mengingat produk digital yang dipilih dan lanjut mendapatkan informasi untuk kebutuhan pembuatan order.
//                 Jika anda merasa informasi order ada yang kurang tanyakan kembali ke pelanggan.
//                 Gunakan kamu sebagai kata ganti pelanggan.
//                 Jangan mengaku sebagai bot jika ada yang bertanya akan tetapi informasikan anda sebagai customer service dari konek market`
//             }
//         ] 
//       },

//       tools: [
//         {
//           functionDeclarations: [getProductDigitalDeclaration],
//         }
//       ]
//   });

  
//   async function streamChat() {
//     const chat = generativeModel.startChat();
//     const chatInput = "Halo";
//     const result = await chat.sendMessageStream(chatInput);
//     for await (const item of result.stream) {
//         console.log("Stream chunk: ", item.candidates[0].content.parts[0].text);
//     }
//   }


//   async function sendChat() {
//     const chat = generativeModel.startChat();
//     const chatInput = "Berapa harga netflix bulanan?";
//     const result = await chat.sendMessage(chatInput);
//     const response = result.response;
//     for (let index = 0; index < response.candidates[0].content.parts.length; index++) {
//       if(response.candidates[0].content.parts[index].hasOwnProperty('text')) {
//         console.log(response.candidates[0].content.parts[index].text);
//       }else if (response.candidates[0].content.parts[index].hasOwnProperty('functionCall')){
//         console.log(response.candidates[0].content.parts[index].functionCall);
//       }
      
//     }
//   }
  
// //   streamChat();
// sendChat();


// const express = require('express');
import express from "express";
import agenRoutes from "./routes/agenRoutes.js";
const app = express();
const port = 3000;
   
 
app.use(express.json());

app.use('/agent', agenRoutes);

app.get('/' , (req, res) => {
  res.send('Konek Market');
})

app.listen(() => {
  // console.log(' Example app ');
}) 

module.exports = app;
// let chat_history = [];

// const response = await agentExecutor.invoke({ 
//   chat_history: [
//     { role: "user", content: "berikan saya detail lengkap list produk konek market beserta harganya" },
//     { role: "assistant", content: "Netflix Premium harganya Rp. 60.000 untuk 1 bulan, Spotify Premium Rp. 33.000 untuk 1 bulan, Disney+ Hotstar Rp. 45.000 untuk 1 bulan, VIU Premium Rp. 20.000 untuk 1 bulan, dan WeTV Rp. 25.000 untuk 1 bulan. Kamu tertarik dengan produk digital yang mana? \n" },
//     { role: "user", content: "saya mau pilih yang netflix" },
//     { role: "assistant", content: "Oke, Netflix ya. Kamu mau langganan berapa lama? \n" },
//     { role: "user", content: "yang bulanan" },
//     { role: "assistant", content: "Oke, Netflix bulanan. Kamu mau berapa akun? \n\n\n" },
//     { role: "user", content: "1 akun aja" },
//     { role: "assistant", content: "Oke, Netflix bulanan 1 akun. Boleh minta nomor telepon kamu? \n" },
//     { role: "user", content: "081236540148" },
//     { role: "assistant", content: "Nama kamu siapa? \n\n\n" },
//   ],
//   chat_history: chat_history,
//   input: "Halo" 
// });

// // chat_history.push(response);

// console.log(response);