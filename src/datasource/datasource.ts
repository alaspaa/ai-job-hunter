import pgPromise from "pg-promise";
import config from "../config/config";

const initOptions = {};
const pgp = pgPromise(initOptions);

export const datasource = pgp(config.connectionString)