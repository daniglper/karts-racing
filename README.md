# karts-racing

Use guide:

1. Install with "npm install"
2. Create a local MongoDB named "KartsRacingDB"
3. Create a ".env" file from the "example.env" file, if you used a different DB name be sure to change it here
4. "npm start" to start the application
5. /populateDB (GET) to get the DB started

For all calculations, only races with 10 laps will be taken into account.

Current routes are:

- /populateDB (GET): populates the DB with the starting data
- /getAllPilots (GET): get a list of all pilots data
- /addPilot (POST): add a new pilot based on the request body (only name and team are required, _id can be given or automatically generated)
  Example JSON:
  {
  "name": "prueba1",
  "team": "teamPrueba1",
  "races": {
  "name": "race1",
  "laps": [
  {
  "time": "00:10:09.056"
  }
  ]
  }
  }
- /addRace (POST): add a new race to a pilot or updates a existing one
  Example JSON:
  {
  "pilot":"prueba1",
  "race": {
  "name": ""Race 1",
  "laps": [{
  "time": "00:10:09.000"
  },{
  "time": "00:10:11.000"
  },{
  "time": "00:10:12.000"
  }]
  }
  }
- /addLap (POST): add a new lap to a pilot's race if it has less than 10
  Example JSON:
  {
  "pilot": "prueba1",
  "race": ""Race 1",
  "lap": {
  "time": "00:10:01.000"
  }
  }
- /getRaceClassification (POST): get the classification of a race
  Example JSON:
  {
  "race": "Race 1"
  }
- /getGeneralClassification (GET): get the general classification
- /getPilotDetails (POST): get the details of a pilot
  Example JSON:
  {
  "pilot": "May Valentine"
  }
