export type SessionModel = {
  id: string;
  hasPlayer: boolean;
  hasConnection: boolean;
  queueLength: number;
  playerStatus: string;
};
