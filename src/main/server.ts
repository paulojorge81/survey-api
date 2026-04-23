/* eslint-disable no-console */
import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import { env } from "./config/env";

const port = 5050;

MongoHelper.connect(env.MONGO_URL)
  .then(async () => {
    const { app } = (await import("./config/app"))
    app.listen(port, () => { console.log(`Server running at port: ${port}`); });

  }).catch(console.error)
