import { ReceivedStatusUpdate, SendingStatusUpdate } from "@webxdc/types";

import { SENTENCES } from "~/lib/sentences";
import { MAX_LEVEL, MASTERED_STREAK, PLAY_ENERGY_COST } from "~/lib/constants";
import {
  db,
  getSession,
  setSession,
  getStreak,
  setStreak,
  getLevel,
  setLevel,
  getXp,
  setXp,
  getEnergy,
  setEnergy,
  getLastPlayed,
  setLastPlayed,
  getStudiedToday,
  setStudiedToday,
  setUnseenIndex,
  getUnseenIndex,
  setMaxSerial,
  getMaxSerial,
  setShowIntro,
  importBackup,
  isValidBackup,
} from "~/lib/storage";

const MONSTER_UPDATE_CMD = "mon-up",
  INIT_CMD = "init",
  NEW_CMD = "new",
  FINISHED_CMD = "finished",
  IMPORT_CMD = "import";
const MAX_MONSTER_STREAK = 999;
const sixMinutes = 6 * 60 * 1000;
let energyLastCheck = 0;
let setPlayerState = null as ((player: Player) => void) | null;
let setSessionState = (_: Session | null) => {};
const queue: ReceivedStatusUpdate<Payload>[] = [];
const workerLoop = async () => {
  while (queue.length > 0) {
    await processUpdate(queue.shift()!);
  }
  const now = Date.now();
  if (now - energyLastCheck >= 10000) {
    let { energy, time } = getEnergy();
    let changed = false;
    while (energy < getMaxEnergy(getLevel()) && now - time >= sixMinutes) {
      time += sixMinutes;
      setEnergy(++energy, time);
      changed = true;
    }
    if (changed && setPlayerState) setPlayerState(await getPlayer());
    energyLastCheck = now;
  }
  setTimeout(workerLoop, 100);
};
setTimeout(workerLoop, 0);

export function getCard(id: number): Card {
  const [sentence, meaning] = SENTENCES[id].split("\t");
  return { id, sentence, meanings: meaning.split("|") };
}

export async function getPlayer(): Promise<Player> {
  const now = Date.now();
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today).setDate(new Date(today).getDate() - 1);

  const seen = await db.monsters.count();
  const mastered = await db.monsters
    .where("streak")
    .aboveOrEqual(MASTERED_STREAK)
    .count();
  const toReview = await db.monsters.where("due").belowOrEqual(now).count();
  const streak = getLastPlayed() < yesterday ? 0 : getStreak();
  const studiedToday = getLastPlayed() < today ? 0 : getStudiedToday();
  const lvl = getLevel();
  const xp = getXp();
  const totalXp = lvl === MAX_LEVEL ? 0 : toNextLevelMediumFast(lvl);
  const { energy } = getEnergy();
  const maxEnergy = getMaxEnergy(lvl);
  return {
    lvl,
    xp,
    totalXp,
    energy,
    maxEnergy,
    streak,
    studiedToday,
    toReview,
    seen,
    mastered,
    total: SENTENCES.length,
  };
}

export function importGame(backup: Backup): boolean {
  if (isValidBackup(backup)) {
    const uid = window.webxdc.selfAddr;
    window.webxdc.sendUpdate(
      {
        payload: { uid, cmd: IMPORT_CMD, backup },
      },
      "",
    );
    return true;
  }
  return false;
}

export function startNewGame(mode: GameMode) {
  const energyCost =
    mode === "easy" ? PLAY_ENERGY_COST : Math.floor(PLAY_ENERGY_COST / 2);
  const energy = getEnergy().energy - energyCost;
  if (energy < 0) return;

  const uid = window.webxdc.selfAddr;
  window.webxdc.sendUpdate(
    {
      payload: { uid, cmd: NEW_CMD, time: Date.now(), energy, mode },
    },
    "",
  );
}

function getResultsModal(
  session: Session,
  endTime: number,
  next: ModalPayload | null,
): ModalPayload {
  const total = session.correct.length;
  const correct = total - session.failedIds.length;
  return {
    type: "results",
    time: endTime - session.start,
    xp: session.xp,
    accuracy: Math.round((correct / total) * 100),
    next,
  };
}

export function sendMonsterUpdate(
  monster: Monster,
  correct: boolean,
): ModalPayload | null {
  monster = { ...monster };
  let modal = null;
  const now = new Date();
  const level = getLevel();
  monster.seen = now.getTime();
  let xp = 0;
  if (correct) {
    monster.streak = Math.min(monster.streak + 1, MAX_MONSTER_STREAK);
    if (level !== MAX_LEVEL) {
      const bonus = Math.min(Math.floor(level / 5), 40);
      xp = Math.min(bonus + monster.streak, 50);
    }

    const addHours = (hours: number): number =>
      new Date(now).setHours(now.getHours() + hours);
    const addDays = (days: number): number => {
      return new Date(new Date(now).setHours(0, 0, 0, 0)).setDate(
        now.getDate() + days,
      );
    };

    switch (monster.streak) {
      case 1: {
        monster.due = addHours(2);
        break;
      }
      case 2: {
        monster.due = addHours(24);
        break;
      }
      case 3: {
        monster.due = addHours(48);
        break;
      }
      default: {
        if (monster.streak > 15) {
          monster.due = addDays(30 * 5 + monster.streak * 4);
        } else if (monster.streak > 10) {
          monster.due = addDays(30 * (monster.streak - 10));
        } else if (monster.streak > MASTERED_STREAK) {
          monster.due = addDays(monster.streak * 2);
        } else {
          monster.due = addDays(monster.streak);
        }
      }
    }
  } else {
    monster.streak = 0;
    monster.due = 0;
  }

  const session = getSession()!;
  updateMonster(monster, session);
  session.xp += xp;
  if (!session.pending.length && !session.failed.length) {
    const update = {
      payload: {
        uid: window.webxdc.selfAddr,
        cmd: FINISHED_CMD,
        session,
      },
    } as SendingStatusUpdate<Payload>;
    const { level: newLevel } = increaseXp(session.xp);
    if (level < newLevel) {
      const newEnergy = getMaxEnergy(newLevel) - getMaxEnergy(level);
      modal = getResultsModal(session, monster.seen, {
        type: "levelUp",
        newEnergy,
        newLevel,
      });
      update.info = `${window.webxdc.selfName} reached level ${newLevel} 🎉`;
    } else {
      modal = getResultsModal(session, monster.seen, null);
    }
    window.webxdc.sendUpdate(update, "");
  } else {
    const update = {
      payload: {
        uid: window.webxdc.selfAddr,
        cmd: MONSTER_UPDATE_CMD,
        sessionId: session.start,
        monster,
        xp,
      },
    } as SendingStatusUpdate<Payload>;
    window.webxdc.sendUpdate(update, "");
  }
  return modal;
}

export function initGame(
  sessionHook: (session: Session | null) => void,
  playerHook: (player: Player) => void,
) {
  window.webxdc
    .setUpdateListener(
      (update: ReceivedStatusUpdate<Payload>) => queue.push(update),
      getMaxSerial(),
    )
    .then(() => {
      queue.push({
        payload: {
          uid: window.webxdc.selfAddr,
          cmd: INIT_CMD,
          sessionHook,
          playerHook,
        },
        serial: -1,
        max_serial: 0,
      });
    });
}

async function processUpdate(update: ReceivedStatusUpdate<Payload>) {
  const payload = update.payload;
  if (payload.uid === window.webxdc.selfAddr) {
    switch (payload.cmd) {
      case INIT_CMD: {
        setSessionState = payload.sessionHook;
        setPlayerState = payload.playerHook;
        setSessionState(getSession());
        setPlayerState(await getPlayer());
        return; // this command is not real update, abort
      }
      case MONSTER_UPDATE_CMD: {
        const session = getSession();
        if (session && payload.sessionId === session.start) {
          const findMon = (m: Monster) =>
            m.id === payload.monster.id && m.seen === payload.monster.seen;
          // hack for iOS bug: updates get processed twice
          if (
            session.correct.findIndex(findMon) === -1 &&
            session.failed.findIndex(findMon) === -1
          ) {
            updateMonster(payload.monster, session);
            if (payload.xp) session.xp += payload.xp;
            setSession(session);
          }
          setSessionState(session);
        }
        break;
      }
      case FINISHED_CMD: {
        const session = payload.session;
        await db.monsters.bulkPut(session.correct);

        const { xp, level } = increaseXp(session.xp);
        if (getLevel() < level) {
          setEnergy(getMaxEnergy(level), Date.now());
        }
        setXp(xp);
        setLevel(level);

        const date = new Date(session.correct[session.correct.length - 1].seen);
        const newPlayed = date.setHours(0, 0, 0, 0);
        const lastPlayed = getLastPlayed();
        if (lastPlayed < newPlayed) {
          setStudiedToday(session.correct.length); // different day, reset counter
          setLastPlayed(newPlayed);
          const oneDayBefore = date.setDate(date.getDate() - 1);
          setStreak(lastPlayed < oneDayBefore ? 1 : getStreak() + 1);
        } else {
          // same day, increase counter
          setStudiedToday(getStudiedToday() + session.correct.length);
        }
        if (setPlayerState) setPlayerState(await getPlayer());
        setSession(session);
        setSessionState(session);
        break;
      }
      case NEW_CMD: {
        setEnergy(payload.energy, payload.time);
        const session = await createNewSession(payload.time, payload.mode);
        setSession(session);
        setShowIntro();
        setSessionState(session);
        break;
      }
      case IMPORT_CMD: {
        await importBackup(payload.backup);
        if (setPlayerState) setPlayerState(await getPlayer());
        setSessionState(getSession());
        break;
      }
    }
  }

  if (update.serial === update.max_serial) setMaxSerial(update.serial);
}

async function createNewSession(
  start: number,
  mode: GameMode,
): Promise<Session> {
  let monsters = await db.monsters
    .orderBy("due")
    .filter((monster) => monster.due <= start)
    .limit(10)
    .toArray();
  let unseenIndex = getUnseenIndex();
  const newMonsters = [];
  for (
    let i = unseenIndex;
    newMonsters.length + monsters.length < 10 && i < SENTENCES.length;
    i++
  ) {
    newMonsters.push({ id: i, streak: 0, due: 0, seen: 0 });
  }
  if (newMonsters.length > 0) {
    await db.monsters.bulkPut(newMonsters);
    setUnseenIndex(unseenIndex + newMonsters.length);
  }
  if (monsters.length < 10) {
    monsters = await db.monsters.orderBy("due").limit(10).toArray();
  }
  return {
    start,
    mode,
    xp: 0,
    failedIds: [],
    correct: [],
    failed: [],
    pending: monsters,
  };
}

function updateMonster(monster: Monster, session: Session) {
  let array = session.pending;
  let index = array.findIndex((c) => c.id === monster.id);
  if (index === -1) {
    array = session.failed;
    index = array.findIndex((c) => c.id === monster.id);
  }
  array.splice(index, 1);
  if (monster.streak === 0) {
    session.failed.push(monster);
    if (session.failedIds.indexOf(monster.id) === -1) {
      session.failedIds.push(monster.id);
    }
  } else {
    session.correct.push(monster);
  }
}

function increaseXp(xp: number): { xp: number; level: number } {
  xp += getXp();
  let level = getLevel();
  let totalXp = toNextLevelMediumFast(level);
  while (xp >= totalXp) {
    xp -= totalXp;
    totalXp = toNextLevelMediumFast(++level);
  }
  if (level >= MAX_LEVEL) {
    level = MAX_LEVEL;
    xp = 0;
  }
  return { level, xp };
}

function toNextLevelMediumFast(level: number): number {
  if (level === 1) return 20;
  if (level === 2) return 34;
  if (level === 3) return 47;
  return (level + 1) ** 3 - level ** 3;
}

function getMaxEnergy(level: number): number {
  return 30 + Math.floor(level / 10);
}
