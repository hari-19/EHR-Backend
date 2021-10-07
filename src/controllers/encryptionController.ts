import * as encryptionService from '../services/encryptionService'
import { Request, Response } from 'express';

export const encrypt = (req: Request, res: Response, next: any) => {
    const { data } = req.body;
    const response = encryptionService.encryptSymmetric(data);
    res.json(response);
}

export const decrypt = (req: Request, res: Response, next: any) => {
    const { data, key } = req.body;
    const response = encryptionService.decryptSymmetric(data, key);
    res.json(response);
}

export const genKey = (req: Request, res: Response, next: any) => {
    const response = encryptionService.generateKey();
    res.json(response);
}

export const aEncrypt = (req: Request, res: Response, next: any) => {
    const { data, key } = req.body;
    const response = encryptionService.encryptAsymmetric(data, key);
    res.json(response);
}

export const aDecrypt = (req: Request, res: Response, next: any) => {
    const { data, key } = req.body;
    const response = encryptionService.decryptAsymmetric(data, key);
    res.json(response);
}