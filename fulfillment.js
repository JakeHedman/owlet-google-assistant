// Owlet app login credentials
const OWLET_EMAIL = "";
const OWLET_PASSWORD = "";

const functions = require("firebase-functions");
const { dialogflow } = require("actions-on-google");
const { connect } = require("@williamshupe/owlet");

const app = dialogflow();

const owletPromise = connect(OWLET_EMAIL, OWLET_PASSWORD);
const deviceIdPromise = owletPromise
  .then((owlet) => owlet.getDevices())
  .then((devices) => devices[0].id);

const getProperties = () =>
  owletPromise.then((owlet) => {
    return deviceIdPromise.then((deviceId) => {
      return owlet.getProperties(deviceId);
    });
  });

const baseStationOffCheck = (conv, props) => {
  if (!props.isBaseStationOn) {
    conv.ask("I'm not sure, the base station is not turned on");
    return true;
  }
};

const sockDisconnectedCheck = (conv, props) => {
  if (!props.isSockConnected) {
    conv.ask("I'm not sure, the sock is not connected to the base station");
    return true;
  }
};

const sockOffCheck = (conv, props) => {
  if (props.isSockOff) {
    conv.ask(`I'm not sure, ${props.babyName} is not wearing the sock.`);
    return true;
  }
};

app.intent("Get status", (conv) => {
  const command = conv.parameters.status_property;
  return getProperties().then((props) => {
    if (command === "on") {
      if (props.isBaseStationOn) {
        conv.ask("Yes, the base station is turned on.");
      } else {
        conv.ask("No, the base station is turned off");
      }
      return;
    }

    if (command === "off") {
      if (props.isBaseStationOn) {
        conv.ask("No, the base station is turned on.");
      } else {
        conv.ask("Yes, the base station is turned off");
      }
      return;
    }

    if (command === "charging") {
      if (props.isCharging) {
        conv.ask("Yes, the sock is plugged in and charging.");
      } else {
        conv.ask("No, the sock is not currently charging.");
      }
      return;
    }

    if (command === "charged") {
      if (props.batteryLevel === 100) {
        conv.ask("Yes, the sock is fully charged.");
      } else {
        conv.ask("No, the sock is not fully charged");
      }
      return;
    }

    if (command === "connected") {
      if (props.isSockConnected) {
        conv.ask("Yes, the sock is connected to the base station.");
      } else {
        conv.ask("No, the sock is not connected");
      }
    }
  });
});

app.intent("Get charge", (conv) => {
  return getProperties().then((props) => {
    if (sockDisconnectedCheck(conv, props)) {
      return;
    }
    conv.ask(`The sock has ${props.batteryLevel} percent of battery left.`);
  });
});

app.intent("Get readings", (conv) => {
  return getProperties().then((props) => {
    if (baseStationOffCheck(conv, props)) {
      return;
    }
    if (sockDisconnectedCheck(conv, props)) {
      return;
    }
    if (props.isWiggling) {
      conv.ask(`${props.babyName} is wiggling`);
      return;
    }
    conv.ask(
      `${props.babyName}'s heart rate is ${props.heartRate} beats per minute and their oxygen level is ${props.oxygenLevel} percent`
    );
  });
});

app.intent("Get wiggling", (conv) => {
  return getProperties().then((props) => {
    if (baseStationOffCheck(conv, props)) {
      return;
    }
    if (sockDisconnectedCheck(conv, props)) {
      return;
    }
    if (sockOffCheck(conv, props)) {
      return;
    }
    if (props.isWiggling) {
      conv.ask(`Yes, ${props.babyName} is wiggling`);
    } else {
      conv.ask(`No, ${props.babyName} is not wiggling`);
    }
  });
});

app.intent("Get reading", (conv) => {
  const command = conv.parameters.reading_property;
  return getProperties().then((props) => {
    if (baseStationOffCheck(conv, props)) {
      return;
    }
    if (sockDisconnectedCheck(conv, props)) {
      return;
    }
    if (command === "heart rate") {
      conv.ask(
        `${props.babyName}'s heart rate is ${props.heartRate} beats per minute`
      );
      return;
    }

    if (command === "oxygen level") {
      conv.ask(
        `${props.babyName}'s oxygen level is ${props.oxygenLevel} percent`
      );
    }
  });
});

app.intent("Set state", (conv) => {
  const command = conv.parameters.set_state;
  return owletPromise.then((owlet) => {
    return deviceIdPromise.then((deviceId) => {
      if (command === "on") {
        return owlet.turnBaseStationOn(deviceId).then(() => {
          conv.ask("Sure, turning the base station on");
        });
      }
      if (command === "off") {
        return owlet.turnBaseStationOff(deviceId).then(() => {
          conv.ask("Sure, turning off the base station");
        });
      }
    });
  });
});

app.intent("Get wearing sock", (conv) => {
  return getProperties().then((props) => {
    if (sockDisconnectedCheck(conv, props)) {
      return true;
    }
    if (props.isSockOff) {
      if (props.isBaseStationOn) {
        conv.ask(
          `${props.babyName} is not wearing the sock, but the base station is turned on.`
        );
      } else {
        conv.ask(
          `${props.babyName} is not wearing the sock and the base station is turned off.`
        );
      }
    } else {
      if (props.isBaseStationOn) {
        conv.ask(
          `${props.babyName} is wearing the sock and the base station is turned on.`
        );
      } else {
        conv.ask(
          `${props.babyName} is wearing the sock, but the base station is turned off.`
        );
      }
    }
  });
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
