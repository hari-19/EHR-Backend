import { Request, Response } from "express";
import { Joi } from "express-validation";
import { HospitalModel } from "../schemas/hospital";
import GunDB from "../gun";
// tslint:disable-next-line: no-var-requires
require("gun/lib/then.js");

export async function getHospitals(req: Request, res: Response, next: any) {
  try {
    const list: any[] = [];
    const hospitalNode = GunDB.root.get("EHR-Hospital");
    hospitalNode.once(async (node) => {
      const keys = Object.keys(node);
      for (const key of keys) {
        if (key === "_") continue;

        const d = await hospitalNode.get(key).promise();
        const details = {
          id: d.put.id,
          name: d.put.name,
          url: d.put.url,
        };
        list.push(details);
      }
      res.json({
        data: list,
      });
    });
  } catch (error) {
    next(error);
  }
}

export const addHospitalValidation = {
  body: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    url: Joi.string().required(),
  }),
};

export async function addHospital(req: Request, res: Response, next: any) {
  try {
    const { id, name, url } = req.body;
    GunDB.root.get("EHR-Hospital").get(id).put({ id, name, url });
    res.status(201).send("Record Created");
  } catch (error) {
    next(error);
  }
}

export const getOneHospitalValidation = {
  body: Joi.object({
    id: Joi.string().required(),
  }),
};

export async function getOneHospital(req: Request, res: Response, next: any) {
  try {
    const { id } = req.body;
    GunDB.root
      .get("EHR-Hospital")
      .get(id)
      .once((node) => res.status(200).send(node));
  } catch (error) {
    next(error);
  }
}
