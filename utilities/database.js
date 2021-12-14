import { MongoClient, ObjectId } from "mongodb";

import config from "../config/index.js";

let database;

export const connectToDatabase = async () => {
  const options = { useUnifiedTopology: true, useNewUrlParser: true };
  const client = new MongoClient(config.dbUrl, options);
  await client.connect();
  database = client.db(config.dbName);
};

const setDb = (collection) => database.collection(collection);

const idQuery = (id) => {
  return { _id: new ObjectId(id) };
};

const queryOptions = (projectionFields = [], sortOptions = {}) => {
  const options = { projection: {}, sort: sortOptions };
  for (let field of projectionFields) {
    options.projection[field] = 1;
  }
  return options;
};

export const db = {
  create: async (collection, data) => {
    const db = setDb(collection);
    const isArray = Array.isArray(data);
    return isArray ? await db.insertMany(data) : await db.insertOne(data);
  },
  findById: async (collection, id, projectionFields) => {
    const db = setDb(collection);
    const query = idQuery(id);
    const options = queryOptions(projectionFields);
    return await db.findOne(query, options);
  },
  find: async (collection, query, projectionFields, sortOptions) => {
    const db = setDb(collection);
    const options = queryOptions(projectionFields, sortOptions);
    return await db.find(query, options).toArray();
  },
  updateById: async (collection, id, data) => {
    const db = setDb(collection);
    const filter = idQuery(id);
    const update = { $set: data };
    return await db.updateOne(filter, update);
  },
  update: async (collection, filter, data) => {
    const db = setDb(collection);
    const update = { $set: data };
    return await db.updateMany(filter, update);
  },
  deleteById: async (collection, id) => {
    const db = setDb(collection);
    const filter = idQuery(id);
    return await db.deleteOne(filter);
  },
  delete: async (collection, filter) => {
    const db = setDb(collection);
    return await db.deleteMany(filter);
  },
};
