
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { orderProductDigital } from "./openaccess-client.js";
// import { init } from "./services/pinecone.js";
import { getInformasiProductKonek } from "./rag.js";

const listProductDigital = tool(async ({prompt}) => {
  console.log('prompt' ,prompt);
  const response = await getInformasiProductKonek(prompt);
  return response;
  // return JSON.stringify(response);
} , {
  name: "list_product_digital",
  description: "Gunakan tools ini untuk informasi mengenai produk konek market. Harap menyimpan id dari data produk digital karena akan digunakan untuk mengisi paket_addon_id pada saat membuat order",
  schema: z.object({
    prompt: z.string().describe('Prompt untuk mencari data produk. Data tidak boleh berupa string kosong')
  })
});

const orderProduct = tool(async ({name, phone, paket_addon_id, subscription_type, duration, user}) => {
  try {
    const response = await orderProductDigital(name, phone, paket_addon_id, subscription_type, duration, user);
    if(response.status == 200) {
      return 'link pembayaran : ' + response.data.data.checkout_link;
    }
  } catch (error) {
    return 'gagal membuat pembayaran'
    
  }

}, {
  name: "create_order",
  description: `
    Gunakan tools ini untuk membuat order. Sebelum menggunakan fungsi ini dapatkan 
    nama pelanggan, no telepon, paket produk digital yang dipilih berupa id yang di dapat dari list_product_digital dan id sama dengan , tipe langganan (Contoh bulanan, harian, tahunan) dan jumlah profil ataupun akun yang dipesan. 
    Ketika berhasil tampilkan apa adanya return dari fungsi ini
  `,
  schema: z.object({
    name: z.string().describe('Nama dari pelanggan yang ingin atau tertarik membeli produk digital. Wajib didapatkan sebelum menggunakan fungsi ini.'),
    phone: z.string().describe('Nomor telepon dari pelanggan yang ingin atau tertarik membeli produk digital. Wajib didapatkan sebelum menggunakan fungsi ini.'),
    paket_addon_id: z.string().describe('paket_addon_id didapat dari id menggunakan tools list_product_digital yang berupa angka. Wajib mendapatkan id dari tools list_product_digital cari sesuai produk yang dipilih pelanggan.'),
    subscription_type: z.enum(['monthly' , 'daily']).describe('Tipe langganan yang dipilih oleh pelanggan. Biasanya berupa bulanan, harian dan tahunan. ketika pelanggan sudah memilih tipe langganan, ubah bentuk data menjadi monthly, daily, yearly hanya saat menggunakan tools. Wajib didapatkan sebelum menggunakan fungsi ini.'),
    duration: z.number().default(1).describe('Lama durasi langganan pelanggan. Wajib didapatkan sebelum menggunakan fungsi ini. jika harian dimulai dari angka 1. jika monthly dimulai dari angka 1'),
    user: z.number().default(1).describe('Jumlah akun atau profil produk digital yang ingin dibeli. Biasanya berupa angka yang diberikan oleh pelanggan. Wajib didapatkan sebelum menggunakan fungsi ini.'),
  }),
})


export  {orderProduct , listProductDigital};