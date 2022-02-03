// tslint:disable-next-line: no-var-requires
const IPFS = require("ipfs");
// tslint:disable-next-line: no-var-requires
const OrbitDB = require("orbit-db");

// tslint:disable-next-line: no-namespace
export namespace OrbitDb {
  let orbitdb: any;

  export async function getInstance() {
    if (orbitdb) {
      console.log("Asdf");
      return orbitdb;
    }
    // Create IPFS instance
    const ipfsOptions = {
      repo: "./ipfs",
      relay: { enabled: true, hop: { enabled: true, active: true } },
      EXPERIMENTAL: { pubsub: true },
    };
    const ipfs = await IPFS.create(ipfsOptions);

    ipfs.config.set('Addresses.Swarm', ['/ip4/0.0.0.0/tcp/4002', '/ip4/127.0.0.1/tcp/4003/ws'], console.log);
    const id = ipfs.id();
    console.log(id.addresses);
    // Create OrbitDB instance
    orbitdb = await OrbitDB.createInstance(ipfs);

    return orbitdb;
  }
}

export default OrbitDb;
