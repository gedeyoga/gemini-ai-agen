import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { askAgen } from '../repositories/agenRepository';
import { sendWhatsapp } from '../services/fonnteClient';
import { removeTrailingNewlines } from '../helpers/stringHelper';
import { addStores, init } from '../services/pinecone';
import { fetchProductDigitals } from '../openaccess-client';

const router = Router();

const checkValidation = [
    body('session_id').notEmpty().isString().withMessage('Session is required'),
    body('chat').notEmpty().isString().withMessage('Chat is required'),
];

const checkValidationFonnte = [
    body('sender').notEmpty().isString().withMessage('Sender is required'),
    body('message').notEmpty().isString().withMessage('Message is required'),
];

router.all('/webhook-fonnte' , async (req, res) => {

    if((req.method == 'GET' && !req.query.hasOwnProperty('sender')) || (req.method == 'POST' && !req.body.hasOwnProperty('sender')) ) {
        
        res.status(200).json({
            message: 'no data fetched!'
        });
        
        return false;
    } 

    const { sender, message } = req.method == 'GET' ? req.query : req.body; 

    //create agen
    const response = await askAgen(sender, message);

    const output = removeTrailingNewlines(response.output);

    //Balas pesan user
    const responseNotif = await sendWhatsapp(sender, output);

    res.status(201).json({ 
        role: "assistant", 
        content: output
    });
  
}); 

// Menambahkan produk baru
router.post('/chat' , checkValidation, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { session_id, chat } = req.body;
    const response = await askAgen(session_id, chat);
    
    res.status(201).json({ 
        role: "assistant", 
        content: response.output
    });
  
});

router.post('/generate-vector' , async(req, res) => {
    const response = await fetchProductDigitals();

    const data = response.map((item) => {
        let pricing_desc = '';
        for (let index = 0; index < item.price.length; index++) {
            const price = item.price[index];
            const duration = price.subscription_type == 'monthly' ? 30 : 1;
            
            pricing_desc += `\n - user: ${price.user}, duration:  ${duration}, price:  ${price.price}, subscription_type: ${price.subscription_type}`;
        }
      return {
        pageContent: 'id: ' + item.id + ', description: ' + item.name + ', ' + pricing_desc,
        metadata: {},
        id: item.id + '',
      }  
    });

    try {
        await addStores(data);
        res.status(201).json({
            message: 'Generate data vector success',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Gagal membuat vektor',
        });
    }
})
export default router;