export interface RaceResult {
  race: string;
  classification: RaceResultPilot[];
}

export interface RaceResultPilot {
  position: number;
  pilot: string;
  time: string;
  timeNumber?: number;
  bestLap: string;
  points: number;
}

export interface PilotRaceData {
  pilot: string;
  time: number;
  bestLapTime: number;
  bestLap: string;
}

export interface PilotGeneralResult {
  pilot: string;
  time: string;
  timeNumber?: number;
  points: number;
  racesAttended: number;
}
