import mongo from "mongodb";

const MongoClient = mongo.MongoClient;

const url = process.env.DB_URL;

MongoClient.connect(url);

class Database {
    private readonly MongoClient;

    constructor() {
        this.MongoClient = mongo.MongoClient;
    }

    async insertOne(collection: string, object: any) {
        const db = await this.MongoClient.connect(url);
        const dbo = db.db(process.env.DB_NAME);
        const result = await dbo.collection(collection).insertOne(object);
        db.close();
        return result;
    }

    async insertMany(collection: string, object: any) {
        const db = await this.MongoClient.connect(url);
        const dbo = db.db(process.env.DB_NAME);
        const result = await dbo.collection(collection).insertMany(object);
        db.close();
        return result;
    }

    async findOne(collection: string, query: any) {
        const db = await this.MongoClient.connect(url);
        const dbo = db.db(process.env.DB_NAME);
        const result = await dbo.collection(collection).findOne();
        db.close();
        return result;
    }

    async find(collection: string, query: any) {
        const db = await this.MongoClient.connect(url);
        const dbo = db.db(process.env.DB_NAME);
    }


}