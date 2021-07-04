import { Request, Response, NextFunction } from "express";
import * as pilotHelper from "../helpers/pilot-helper";
import { Pilot } from "../models/Pilot";
import {
  PilotDetails,
  PilotGeneralResult,
  RaceResult,
} from "../models/Results";

const getAllPilots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get all pilots
  const pilots = await Pilot.find();

  // return
  return res.status(200).json(pilots);
};

const addPilot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body?.name || !req.body?.team) {
      return res.status(400).json({
        message: "A name and a team are necessary to add a pilot",
      });
    }

    const existingPilot = await Pilot.findOne({ name: req.body.name });

    if (existingPilot) {
      return res.status(400).json({
        message: "A pilot with this name already exists",
      });
    }

    //TODO: check that every race has a maximum of 10 laps

    // Generate new random _id
    const _id = await pilotHelper.calcRandomPilotId();

    // add pilot
    let newPilot = new Pilot({ _id, ...req.body });
    newPilot = await Pilot.create(newPilot);

    // return
    return res.status(200).json(newPilot);
  } catch (error) {
    //error
    return res.status(500).json({ message: "Error", error });
  }
};

const addRace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body?.pilot || !req.body?.race) {
      return res.status(400).json({
        message: "A pilot and a race are necessary to add a race",
      });
    }

    let pilot = await Pilot.findOne({ name: req.body.pilot });

    if (!pilot) {
      return res.status(400).json({ message: "This pilot doesn't exist" });
    }

    const indexExistingRace = pilot.races.findIndex(
      (x) => x.name === req.body.race.name
    );

    //TODO: check that has a maximum of 10 laps

    if (indexExistingRace > -1) {
      pilot.races[indexExistingRace] = req.body.race;

      pilot = await pilot.save();

      return res.status(200).json({ message: "The race was changed", pilot });
    } else {
      pilot.races.push(req.body.race);

      pilot = await pilot.save();

      return res.status(200).json({ message: "The race was added", pilot });
    }
  } catch (error) {
    //error
    return res.status(500).json({ message: "Error", error });
  }
};

const addLap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body?.pilot || !req.body?.race || !req.body?.lap) {
      return res.status(400).json({
        message: "A pilot, a race and a lap are necessary to add a lap",
      });
    }

    let pilot = await Pilot.findOne({ name: req.body.pilot });

    if (!pilot) {
      return res.status(400).json({ message: "This pilot doesn't exist" });
    }

    const race = pilot.races?.find((x) => x.name === req.body.race);

    if (!race) {
      return res
        .status(400)
        .json({ message: "This race doesn't exist for this pilot" });
    } else if (race.laps.length >= 10) {
      return res.status(400).json({ message: "This race already has 10 laps" });
    } else {
      race.laps.push(req.body.lap);
      pilot = await pilot.save();

      return res.status(200).json({ message: "The lap was added", pilot });
    }
  } catch (error) {
    //error
    return res.status(500).json({ message: "Error", error });
  }
};

const getRaceClassification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body?.race) {
      return res.status(400).json({
        message: "A race is necessary to get its results",
      });
    }

    const pilots = await Pilot.find({
      races: {
        $all: [
          {
            $elemMatch: {
              name: req.body.race,
              laps: {
                $size: 10,
              },
            },
          },
        ],
      },
    });

    if (!pilots?.length) {
      return res.status(400).json({
        message: "This race doesn't exist or it has no pilots with 10 laps",
      });
    }

    const raceResult: RaceResult = pilotHelper.calcRaceResult(
      req.body.race,
      pilots
    );

    raceResult.classification.forEach((x) => delete x.timeNumber);

    return res.status(200).json({ raceResult });
  } catch (error) {
    //error
    return res.status(500).json({ message: "Error", error });
  }
};

const getGeneralClassification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pilots = await Pilot.find({});

    const pilotGeneralResults: PilotGeneralResult[] =
      pilotHelper.calcGeneralResult(pilots);

    pilotGeneralResults.forEach((x) => delete x.timeNumber);

    return res.status(200).json({ pilotGeneralResults });
  } catch (error) {
    //error
    return res.status(500).json({ message: "Error", error });
  }
};

const getPilotDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body?.pilot) {
      return res.status(400).json({
        message: "A pilot is necessary to get its results",
      });
    }

    const pilot = await Pilot.findOne({ name: req.body.pilot });

    const pilots = await Pilot.find();

    if (!pilot) {
      return res.status(400).json({ message: "This pilot doesn't exist" });
    }

    const pilotDetails: PilotDetails = pilotHelper.calcPilotDetails(pilot,pilots);

    return res.status(200).json({ pilotDetails });
  } catch (error) {
    //error
    return res.status(500).json({ message: "Error", error });
  }
};

export default {
  getAllPilots,
  addPilot,
  addRace,
  addLap,
  getRaceClassification,
  getGeneralClassification,
  getPilotDetails
};
