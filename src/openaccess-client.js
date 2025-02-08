import axios from 'axios';

const base_url = 'https://debug.openaccess.co.id/api/';
const headers = {
    "Authorization": "Bearer 523fbb3e-a803-446b-ae57-35756c2662fb",
    "Accept": "application/json"
};


async function fetchProductDigitals() {
    // This mock API returns the requested lighting values
    const response = await axios.get( base_url + 'konek/paket-addons?with=price&status=active&company_id=1&type=produk_digital', headers);

    return response.data.data;
}

async function orderProductDigital(name, phone, paket_addon_id, subscription_type, duration, user) {
    const data = {
        name,
        phone,
        paket_addon_id,
        subscription_type,
        duration,
        user,
    };

    // This mock API returns the requested lighting values
    const response = await axios.post( base_url + 'konek/plus/pelanggan' , data, {
        headers: headers,
    });
    return response;
}

export {orderProductDigital, fetchProductDigitals};
  