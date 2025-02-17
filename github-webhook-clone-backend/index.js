import express from "express";
import axios from "axios";

const app = express();
const port = process.env.port || 5600;
app.use(express.json());

//Storing the incoming data in memory
const webhooks = {
  //These all will be array of objects, the object being { payloadUrl, secret, eventTypes }
  COMMIT: [],
  PUSH: [],
  MERGE: [],
};

app.post("/api/webhooks", (req, res) => {
  //Destructurind data coming from the frontend
  const { payloadUrl, secret, eventTypes } = req.body;

  //looping through eventTypes (bc it is an array), and we need to to store each eventType in their respective webhook
  //Example: eventTypes: [commit, push], then there will be 2 sepereate entries in the webhook object
  //1 for webooks.COMMIT and 1 for webhooks.PUSH
  eventTypes.forEach((eventType) => {
    webhooks[eventType].push({ payloadUrl, secret });
  });

  return res.sendStatus(201);
});

app.post("/api/event-emulate", (req, res) => {
  const { type, data } = req.body;

  //Event triggers (Call webhook) (Webhook are executed asynchronously)
  setTimeout(async () => {
    //All code here runs asynchronously (runs in background)

    //passing the webhook['COMMIT'] element (or any element of the 3 which matches type)
    const webhookList = webhooks[type];

    //looping through the "webhook['COMMIT'] element" array of objects
    for (let i = 0; i < webhookList.lenght; i++) {
      //storing individual object from the array of objects
      const curWebhook = webhookList[i];
      //destructuring the object into variable
      const { payloadUrl, secret } = curWebhook;
      //calling the payloadUrl using axios
      try {
        await axios.post(payloadUrl, data, {
          headers: {
            "x-secret": secret,
          },
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }, 0);

  res.sendStatus(200);
});

//testing to see how the object passed looks like
app.get("/api/test", (req, res) => {
  res.json(webhooks);
});

app.listen(port, () => console.log("Listening on port ", port));
