import { ILap, IPilot, Pilot } from "../models/Pilot";
import {
  PilotGeneralResult,
  PilotRaceData,
  RaceResult,
  RaceResultPilot,
} from "../models/Results";
import Big from "big.js";

const classificationPoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export async function calcRandomPilotId(): Promise<string> {
  // TODO: Improvable, but will do for now
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let existingId = true;
  let id: string = "";

  // loop if the id already exists
  while (existingId) {
    id = "";
    for (let i = 0; i < 24; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    existingId = await Pilot.exists({ _id: id });
  }

  return id;
}

export function calcRaceResult(race: string, pilots: IPilot[]): RaceResult {
  const raceResult: RaceResult = {
    race,
    classification: [],
  };

  const pilotResults: PilotRaceData[] = [];

  // Convert each pilot data to manageable data
  pilots.forEach((pilot) => {
    const pilotRace = pilot.races.find((x) => x.name === race);

    if (pilotRace && pilotRace.laps?.length === 10) {
      const pilotRaceData: PilotRaceData = calcPilotRaceData(
        pilot.name,
        pilotRace.laps
      );

      pilotResults.push(pilotRaceData);
    }
  });

  // sort by time
  pilotResults.sort((a, b) => new Big(a.time).minus(b.time).toNumber());

  // calculate best lap time
  const bestLapTime = Math.min(...pilotResults.map((x) => x.bestLapTime));

  // build classification
  for (let index = 0; index < pilotResults.length; index++) {
    const pilotResult = pilotResults[index];

    const raceResultPilot: RaceResultPilot = {
      position: index + 1,
      pilot: pilotResult.pilot,
      time: calcStringTime(pilotResult.time),
      timeNumber: pilotResult.time,
      bestLap: pilotResult.bestLap,
      points: index < 10 ? classificationPoints[index] : 0,
    };

    if (new Big(pilotResult.bestLapTime).eq(bestLapTime))
      raceResultPilot.points++;

    raceResult.classification.push(raceResultPilot);
  }

  return raceResult;
}

export function calcGeneralResult(pilots: IPilot[]): PilotGeneralResult[] {
  const races: string[] = [];
  // Filter only races with 10 laps
  pilots.forEach((pilot) => {
    pilot.races = pilot?.races.filter((x) => x.laps?.length === 10);

    // get the races with at least 1 pilot with 10 laps
    pilot.races.forEach((race) => {
      if (!races.some((x) => x === race.name)) races.push(race.name);
    });
  });

  const raceResults = races.map((x) => calcRaceResult(x, pilots));

  const pilotGeneralResults: PilotGeneralResult[] = pilots.map((x) => {
    return {
      pilot: x.name,
      time: "",
      timeNumber: 0,
      points: 0,
      racesAttended: 0,
    };
  });

  raceResults.forEach((raceResult) => {
    raceResult.classification.forEach((pilotRaceResult) => {
      const pilot = pilotGeneralResults.find(
        (x) => x.pilot === pilotRaceResult.pilot
      );

      if (pilot) {
        pilot.points += pilotRaceResult.points;
        pilot.timeNumber = new Big(pilot.timeNumber ?? 0)
          .add(pilotRaceResult.timeNumber ?? 0)
          .toNumber();
        pilot.racesAttended++;
      }
    });
  });

  pilotGeneralResults.sort((a, b) => b.points - a.points);

  pilotGeneralResults.forEach(
    (x) => (x.time = calcStringTime(x.timeNumber ?? 0))
  );

  return pilotGeneralResults;
}

/*
 *  Private functions
 */

function calcPilotRaceData(pilot: string, laps: ILap[]): PilotRaceData {
  try {
    let totalTime = new Big(0);
    let bestLapTime: number = NaN;
    let bestLap: string = "";
    for (const lap of laps) {
      const [time, milisecs] = lap.time.split(".");

      const hourMinSec = time.split(":");

      const [hourMs, minMs, secMs, ms] = [
        new Big(hourMinSec[0]).mul(60 * 60 * 1000),
        new Big(hourMinSec[1]).mul(60 * 1000),
        new Big(hourMinSec[2]).mul(1000),
        new Big(milisecs),
      ];

      const totalMs = hourMs.add(minMs).add(secMs).add(ms);

      if (isNaN(bestLapTime) || new Big(bestLapTime).gt(totalMs)) {
        bestLapTime = totalMs.toNumber();
        bestLap = lap.time;
      }

      totalTime = totalTime.add(totalMs);
    }

    return { pilot, time: totalTime.toNumber(), bestLapTime, bestLap };
  } catch (error) {
    throw new Error("UnexpectedError while calculating results: " + error);
  }
}

function calcStringTime(ms: number): string {
  let bigMs = new Big(ms);

  const hoursNumber = Math.floor(bigMs.div(60 * 60 * 1000).toNumber());
  let hours: string = hoursNumber.toString();
  if (hours.length === 1) hours = "0" + hours;
  bigMs = bigMs.sub(new Big(hoursNumber).mul(60 * 60 * 1000));

  const minsNumber = Math.floor(bigMs.div(60 * 1000).toNumber());
  let mins: string = minsNumber.toString();
  if (mins.length === 1) mins = "0" + mins;
  bigMs = bigMs.sub(new Big(minsNumber).mul(60 * 1000));

  const secsNumber = Math.floor(bigMs.div(1000).toNumber());
  let secs: string = secsNumber.toString();
  if (secs.length === 1) secs = "0" + secs;
  bigMs = bigMs.sub(new Big(secsNumber).mul(1000));

  let milisecs: string = bigMs.toString();
  if (milisecs.length === 1) milisecs = "00" + milisecs;
  if (milisecs.length === 2) milisecs = "0" + milisecs;

  return hours + ":" + mins + ":" + secs + "." + milisecs;
}
