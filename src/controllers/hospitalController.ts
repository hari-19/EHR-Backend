import { Request, Response } from 'express';
import { Joi } from 'express-validation';
import { HospitalModel } from '../schemas/hospital';

export async function getHospitals (req: Request, res: Response, next: any) {
    try {
        const hospitals = await HospitalModel.find();
        res.json({
            data: hospitals
        });
    }
    catch(error) {
        next(error);
    }
}

export const addHospitalValidation = {
    body: Joi.object({
         id: Joi.string().required(),
         name: Joi.string().required(),
         url: Joi.string().required()
     }),
};

export async function addHospital (req: Request, res: Response, next: any) {
    try {
        const {id, name, url} = req.body;
        await HospitalModel.create({
            _id: id,
            name,
            url
        })
        res.status(201).send("Record Created");
    }
    catch(error) {
        next(error);
    }
}