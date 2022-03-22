import GUN from 'gun';
import { IGunChainReference } from 'gun/types/chain';

class GunDB
{
    private static _instance: GunDB;
    public root: IGunChainReference<any, any, "pre_root">;

    private constructor()
    {
        const peers = ["https://gun-server-ehr.herokuapp.com/gun"];
        this.root = new GUN({
            peers
        });

        this.root.get("EHR-Hospital").on(data => console.log("EHR-Hospital", data));
        this.root.get("EHR-Notifications").on(data => console.log("EHR-Notifications", data));
        this.root.get("EHR-Patient").on(data => console.log("EHR-Patient", data));
    }

    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}

export default GunDB.Instance;