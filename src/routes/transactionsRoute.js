import express from 'express';
import {createTransaction, deleteTransactions, getTransactionsById, getTransactionSummary} from '../controllers/transactionsControllers.js';

const router=express.Router();


router.get('/:userId',getTransactionsById); 

router.post('/', createTransaction);

router.delete('/:userId', deleteTransactions);

router.get('/summary/:userId', getTransactionSummary);

export default router;