// import { ConfigModel, ConfigSchema } from "../schemas/config";
import { RecordSchema } from "../schemas/record";
import * as encryptionService from "../services/encryptionService";
import * as ethService from "../services/ethService";

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
    const encryptedData = encryptionService.encryptSymmetric({
        key: recordDoc.key,
        data: JSON.stringify(recordDoc.data)
    });

    await ethService.postRecord(recordDoc._id, encryptedData);
}