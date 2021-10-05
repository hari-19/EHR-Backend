import { createEthAccount, getBalance, addAccount, sendEthSignedTransaction } from '../services/ethService';
import { Request, Response } from 'express';
import Web3 from 'web3';

export const createAccount = async (req:  Request, res: Response, next: any) => {
    const acc = await createEthAccount();
    res.json({
        private_key: acc.privateKey,
        address: acc.address,
        balance: await getBalance(acc.address)
    });
}

export const sendTransaction = async (req: Request, res: Response, next: any) => {
    const key = process.env.ACC1
    const to = '0x866Ac76c9Ee3cF7F3c0dC3D2d61fFC8136c3fE83'
    const fromAcc  = await addAccount(key);
    const response = await sendEthSignedTransaction(fromAcc, to, Web3.utils.toWei('1', 'ether'), 21000);
    res.json(response);
}