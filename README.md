# Owlet Google Assistant Actions

This is some javascript I used to get Google Assistant working with my Owlet
smart sock back in 2018. I'm not sure if this still works, but people still
keep asking for it in 2021 so I have decided to open source it.

## Demo

https://www.youtube.com/watch?v=jOx2ZX8LafA

## Getting started

My memory is a bit foggy since I'm writing this tutorial 3 years after setting
up my own project, but I'll do my best.

1. Enter your Owlet username and password at the top of fulfillment.js.

2. Replace "Olivia" with your baby's name in `dialogflow/intents/*.json`. Feel
   free to skip this step if your baby's name is in fact Olivia.

3. Create a [dialogflow project](https://dialogflow.cloud.google.com/).

4. Upload `fulfillments.js` to dialogflow. You can use the [inline
   editor](https://cloud.google.com/dialogflow/es/docs/fulfillment-inline-editor).

5. Replace xxxx with your project name in `dialogflow/agent.json`.

6. Zip the `dialogflow` directory and [import it](https://cloud.google.com/dialogflow/es/docs/agents-settings#export).

7. `fulfillments.js` uses a few npm modules. I don't remember how I installed
   those, but I'm guessing there is a package.json you can edit somewhere.

## TODO

- [ ] Test and see if this actually works in *current year*

- [ ] A detailed getting started tutorial

- [ ] No card-coded baby name (search for Olivia in diaglogflow/)

- [ ] No hard-coded username/password in fulfilment.js. Maybe even support
multiple accounts so each user doesn't have to have their own dialogflow
instance?

## Looking for maintainer

My kids are too old for the Owlet sock now so I don't have much interest in
this project anymore. Let me know if you'd like to maintain the project.
