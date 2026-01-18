import { buildApp } from "./app";

const app = buildApp();

app.listen({ port: Number(process.env.PORT) || 4000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
