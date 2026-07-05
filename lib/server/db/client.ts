import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseurl = process.env.DATABASE_URL;
if(!databaseurl){
    throw new Error("DATABASE_URL is not defined");
}
const sql = neon(databaseurl);

export const db = drizzle({
    client:sql,
    schema
});