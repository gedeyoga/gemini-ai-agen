import axios from "axios";
import FormData from 'form-data';
const base_url = process.env.FONNTE_API;
const token = process.env.FONNTE_TOKEN;

const sendWhatsapp = async ( target , message) => {

    const data = {
        target: target, 
        message: message,
        url: "",
        schedule: '0',
        typing: 'true',
        delay: '2',
        countryCode: '62',
    }

    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    const headers = {
        'Authorization': token,
        ...formData.getHeaders(),
    }

    const response = await axios.post(base_url + 'send' , formData, {
        headers: headers
    });

    return response;   
}

export {sendWhatsapp}