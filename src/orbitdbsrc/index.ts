// tslint:disable-next-line: no-var-requires
const IPFS = require("ipfs");
// tslint:disable-next-line: no-var-requires
const OrbitDB = require("orbit-db");

// tslint:disable-next-line: no-namespace
export namespace OrbitDb {
  let orbitdb: any;

  export async function getInstance() {
    if (orbitdb) {
      return orbitdb;
    }
    // Create IPFS instance
    const ipfsOptions = {
      repo: "./ipfs",
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [] as any,
        Addresses: { Swarm: [] as any },
      },
    };
    const ipfs = await IPFS.create(ipfsOptions);

    // Create OrbitDB instance
    orbitdb = await OrbitDB.createInstance(ipfs);

    return orbitdb;
  }
}

export default OrbitDb;
