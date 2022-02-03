import { OrbitDb } from "./index";

export async function addDoctor() {
    console.log("Reached");
    const orbitdb = await OrbitDb.getInstance();
    const options = {
        // Give write access to everyone
        accessController: {
          write: ['*']
        }
    }
    console.log("Reached");

    // console.log(process.env.ORBIT_DB_DOCTOR);
    const db = await orbitdb.keyvalue(process.env.ORBIT_DB_DOCTOR);
    console.log("Reached1");
    // const db = await orbitdb.keyvalue('doctor', options);
    console.log(db.address.toString());
    console.log("Reached2");
    await db.load();

    await db.put('abc', "Hariii", {pin: true});
    console.log("Added");
}

export async function getDoctor() {
    const orbitdb = await OrbitDb.getInstance();
    const db = await orbitdb.keyvalue(process.env.ORBIT_DB_DOCTOR);
    await db.load();
    const val = db.get('abc');
    console.log(val);
}