import { Request, Response, NextFunction } from "express";
import { Pilot } from "../models/Pilot";

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

    // Generate new random _id
    const _id = await generateRandomPilotId();

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
    if (!req.body?.pilotId || !req.body?.race) {
      return res.status(400).json({
        message: "A pilotId and a race are necessary to add a race",
      });
    }

    let pilot = await Pilot.findOne({ _id: req.body.pilotId });

    if (!pilot) {
      return res.status(400).json({ message: "This pilotId doesn't exist" });
    }

    const indexExistingRace = pilot.races.findIndex(
      (x) => x.name === req.body.race.name
    );

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
    if (!req.body?.pilotId || !req.body?.raceName || !req.body?.lap) {
      return res.status(400).json({
        message:
          "A pilotId, a raceName and a lap are necessary to add a lap",
      });
    }

    let pilot = await Pilot.findOne({ _id: req.body.pilotId });

    if (!pilot) {
      return res.status(400).json({ message: "This pilotId doesn't exist" });
    }

    const race = pilot.races?.find((x) => x.name === req.body.raceName);

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

export default {
  addPilot,
  addRace,
  addLap,
  getAllPilots,
};

async function generateRandomPilotId(): Promise<string> {
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
