import express from 'express';
import {sql} from '../config/db.js';

export const getTransactionsById=async (req, res) => {
    const {userId} = req.params;
    try{
        const transactions = await sql`SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC`;
        return res.status(200).json({transactions});
    }catch(error){
        console.error('Error fetching transactions:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

export const createTransaction = async (req, res) => {

    try{
        const {title, amount, category, user_id} = req.body;
        if(!title|| amount===undefined || !category || !user_id){
            return res.status(400).json({error: 'All fields are required'});
        }
        const transaction=await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;

        return res.status(201).json({transaction});

    }catch(error){
        console.error('Error creating transaction:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

export const deleteTransactions=async (req, res) => {
    const {userId} = req.params;
    try{
        const result = await sql`DELETE FROM transactions WHERE user_id=${userId} RETURNING *`;
        if(result.length === 0){
            return res.status(404).json({error: 'Transaction not found'});
        }
        return res.status(200).json({message: 'Transaction deleted successfully'});
    }catch(error){
        console.error('Error deleting transaction:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

export const getTransactionSummary = async (req, res) => {
    const {userId} = req.params;
    try{
        const balanceResult=await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id=${userId}`;

        const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id=${userId} AND amount > 0`;

        const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id=${userId} AND amount < 0`;

        const summary = {
            balance: parseFloat(balanceResult[0].balance),
            income: parseFloat(incomeResult[0].income),
            expense: parseFloat(expenseResult[0].expense)
        };
        return res.status(200).json({summary});
    }catch(error){
        console.error('Error fetching transaction summary:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}