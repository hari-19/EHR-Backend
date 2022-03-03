import { PatientModel, PatientSchema } from "../schemas/patient";
import { Request, Response } from "express";
import { Joi } from "express-validation";
import { sendError } from "../helpers/errorHelper";
import bcrypt from "bcrypt";
import * as authService from "../services/authService";

import GunDB from "../gun";
import { randomUUID } from "crypto";

/**
 * Post Notification Controller Validator Config
 */

export const postNotificationValidation = {
  body: Joi.object({
    id: Joi.string().required(),
    hospitalId: Joi.string().required(),
    recordId: Joi.array().items(Joi.string()).required(),
  }),
};

/**
 * Function to Post Notification Requests.
 */
export async function postRequest(req: Request, res: Response, next: any) {
  try {
    const { id, hospitalId, recordId } = req.body;

    const notificationsNode = GunDB.root.get("EHR-Notifications");
    const patientRequestNode = notificationsNode.get(id);

    patientRequestNode.get(randomUUID()).put(
      {
        hospitalId,
        recordId: JSON.stringify(recordId),
      },
      (ack) => {
        if(ack.err) {
            throw ack.err;
        }
        res.status(201).send({
          message: "Request Created Successfully",
        });
      }
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Post Notification Controller Validator Config
 */

export const getNotificationValidation = {
  body: Joi.object({
    id: Joi.string().required(),
  }),
};

/**
 * Function to Get Notification Requests.
 */
export async function getRequest(req: Request, res: Response, next: any) {
  try {
    const { id } = req.body;

    const notificationsNode = GunDB.root.get("EHR-Notifications");
    const hospitalsNode = GunDB.root.get("EHR-Hospital");
    const patientRequestNode = notificationsNode.get(id);

    const list: any[] = [];
    patientRequestNode.once(async (node) => {
      if(!node) {
        res.json({
          data: list,
        });
        return;
      }
      const keys = Object.keys(node);
      for (const key of keys) {
        if (key === "_") continue;
        const d = await patientRequestNode.get(key).promise();
        console.log(d.put);
        // console.log()
        if(d.put == null) {
          continue;
        }
        const hospitalId = d.put.hospitalId;
        const h = await hospitalsNode.get(hospitalId).promise();
        const details = {
          notificationId: key,
          hospitalId,
          hospitalName: h.put.name,
          hospitalUrl: h.put.url,
          recordId: JSON.parse(d.put.recordId)
        };
        list.push(details);
      }

      res.json({
        data: list,
      });
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
}