import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { askAgen } from '../repositories/agenRepository';
import { sendWhatsapp } from '../services/fonnteClient';
import { removeTrailingNewlines } from '../helpers/stringHelper';

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

export default router;