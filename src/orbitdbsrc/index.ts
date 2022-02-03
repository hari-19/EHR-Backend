// tslint:disable-next-line: no-var-requires
const IPFS = require("ipfs");
// tslint:disable-next-line: no-var-requires
const OrbitDB = require("orbit-db");

// tslint:disable-next-line: no-namespace
export namespace OrbitDb {
  let ipfs: any;
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
    ipfs = await IPFS.create(ipfsOptions);

    const id = await ipfs.id();
    console.log("id", " ", id);
    console.log(id.addresses);
    // Create OrbitDB instance
    orbitdb = await OrbitDB.createInstance(ipfs);

    return orbitdb;
  }

  export async function connectToPeer (multiaddr: string, protocol = '/p2p-circuit/ipfs/') {
       try {
         await ipfs.swarm.connect(protocol + multiaddr)
       } catch(e) {
         throw (e)
    }
  }

  export async function getIpfsPeers() {
    const peers = await ipfs.swarm.peers()
    return peers
  }
}

export default OrbitDb;
