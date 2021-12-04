import * as ethService from '../services/ethService';
import { Request, Response } from 'express';
import Web3 from 'web3';

export const createAccount = async (req:  Request, res: Response, next: any) => {
    const acc = await ethService.createEthAccount();
    res.json({
        private_key: acc.privateKey,
        address: acc.address,
        balance: await ethService.getBalance(acc.address)
    });
}

export const sendTransaction = async (req: Request, res: Response, next: any) => {
    const key = process.env.ACC1
    const to = '0x866Ac76c9Ee3cF7F3c0dC3D2d61fFC8136c3fE83'
    const fromAcc  = await ethService.addAccount(key);
    const response = await ethService.sendEthSignedTransaction(fromAcc, to, Web3.utils.toWei('1', 'ether'), 21000);
    res.json(response);
}

export const getRecord = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.query;
        // console.log(req.params);
        if(!id) {
            throw new Error('Record Id not supplied');
        }

        if(typeof id !== 'string') {
            throw new Error('id not string');
        }
        const response = await ethService.getRecord(id);
        res.json({
            data: response
        });
    }
    catch(err) {
        next(err);
    }
}

export const postRecord = async (req: Request, res: Response, next: any) => {
    try {
        const { userId, key, data } = req.body;
        if(!key || !data || typeof key !== 'string' || typeof data !== 'string') {
            throw new Error('Incorrect Body');
        }
        const response = await ethService.postRecord(userId, key, data)
        res.json(response)
    }
    catch(err) {
        console.log(err);
        next(err);
    }
}

export const getFunds = async (req: Request, res: Response, next: any) => {
    try {
        const response = await ethService.addEther();
        res.json(response);
    }
    catch (err) {
        next(err);
    }
}

export const getBalance = async (req: Request, res: Response, next: any) => {
    try {
        const response = await ethService.getBalance(process.env.ADDR);
        res.json(response);
    }
    catch (err) {
        next(err);
    }
}