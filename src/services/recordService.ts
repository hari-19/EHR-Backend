// import { ConfigModel, ConfigSchema } from "../schemas/config";
import { RecordSchema } from "../schemas/record";
import * as encryptionService from "../services/encryptionService";
import * as ethService from "../services/ethService";
import GunDB from "../gun";

// export async function getNewRecordId() {
//     const config: ConfigSchema = await ConfigModel.findById(0);

//     if (!config) {
//         throw new Error("Config document not found");
//     }

//     const { hospitalId, recordSl } = config;
//     const recordId: string = ("00000000" + (recordSl + 1)).slice(-8);
//     return hospitalId + "-" + recordId;
// }

export async function encryptAndSaveToEth(recordDoc: RecordSchema) {
    // const encryptedData = encryptionService.encryptSymmetric({
        // key: recordDoc.key,
        // data: JSON.stringify(recordDoc.data)
    // });

    // const patient = await GunDB.root.get('EHR-Patient').get(recordDoc.data.patientId).promise();
    // console.log(patient.put);
    // console.log(patient.put.ethPublicKey);
    // const key = patient.put.ethPublicKey;
    // const encryptedKey = encryptionService.encryptAsymmetric(recordDoc.key, key);

    // console.log(encryptedKey);
   const encryptedData = JSON.stringify(recordDoc.data);
    await ethService.postRecord(recordDoc.data.patientId, recordDoc._id, encryptedData);
    // await ethService.postRecordKey(recordDoc._id, encryptedKey);
}