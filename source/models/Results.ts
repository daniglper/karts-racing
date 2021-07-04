export interface RaceResult {
  race: string;
  classification: RaceResultPilot[];
}

export interface RaceResultPilot {
  position: number;
  pilot: string;
  time: string;
  bestLap: string;
  points: number;
}

export interface PilotRaceData {
  pilot: string;
  time: number;
  bestLapTime: number;
  bestLap: string;
}
