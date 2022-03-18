import { DS } from "./DS.js";
import { MongoDs } from "./mongo/MongoDs.js";
import { RedisDs } from "./redis/RedisDs.js";

const dataSources: Map<string, DS> = new Map<string, DS>();

const dsLocator = {
	allocate: (name: string, ds: DS) => dataSources.set(name, ds),
	acquire: (name): DS => dataSources.get(name)
}

dsLocator.allocate(`mongo`, new MongoDs());
dsLocator.allocate(`redis`, new RedisDs());

export {dsLocator};