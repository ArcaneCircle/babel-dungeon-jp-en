import Dexie, { type EntityTable } from "dexie";

import { LANG1_CODE, LANG2_CODE } from "~/lib/lang";

const VERSION = 3;

export const db = new Dexie("gamedb") as Dexie & {
  monsters: EntityTable<Monster, "id">;
};
db.version(1).stores({ monsters: "id, streak, due" });

const BACKUP_CODE = `${LANG1_CODE}-${LANG2_CODE}`;

export async function exportBackup(): Promise<Backup> {
  const monsters = await db.monsters.toArray();
  return {
    version: VERSION,
    lang: BACKUP_CODE,
    showIntro: localStorage.showIntro,
    monsters,
    session: localStorage.session,
    unseenIndex: localStorage.unseenIndex,
    mode: localStorage.mode,
    // Player
    streak: localStorage.streak,
    level: localStorage.level,
    xp: localStorage.xp,
    energy: localStorage.energy,
    energyTimestamp: localStorage.energyTimestamp,
    studiedToday: localStorage.studiedToday,
    lastPlayed: localStorage.lastPlayed,
    // UI settings
    music: localStorage.music,
    sfx: localStorage.sfx,
    tts: localStorage.tts,
  };
}

export async function importBackup(backup: Backup) {
  if (!isValidBackup(backup)) {
    return;
  }

  await db.monsters.bulkPut(backup.monsters);
  localStorage.showIntro = backup.showIntro;
  localStorage.session = backup.session || "";
  localStorage.unseenIndex = backup.unseenIndex;
  localStorage.mode = backup.mode;
  // Player
  localStorage.streak = backup.streak;
  localStorage.level = backup.level;
  localStorage.xp = backup.xp;
  localStorage.energy = backup.energy;
  localStorage.energyTimestamp = backup.energyTimestamp;
  localStorage.studiedToday = backup.studiedToday;
  localStorage.lastPlayed = backup.lastPlayed;
  // UI settings
  localStorage.music = backup.music || "";
  localStorage.sfx = backup.sfx || "";
  localStorage.tts = backup.tts || "";
}

export function isValidBackup(backup: Backup): boolean {
  return (
    backup.lang === BACKUP_CODE &&
    backup.version <= VERSION &&
    backup.version > 2
  );
}

export function getSession(): Session | null {
  const session = localStorage.session;
  return session ? JSON.parse(session) : null;
}

export function setSession(session: Session) {
  localStorage.session = JSON.stringify(session);
}

export function getMaxSerial(): number {
  return parseInt(localStorage.maxSerial || "0");
}

export function setMaxSerial(maxSerial: number) {
  localStorage.maxSerial = maxSerial;
}

export function getShowIntro(): number {
  return parseInt(localStorage.showIntro || "1");
}

export function setShowIntro() {
  localStorage.showIntro = 0;
}

export function getMusicEnabled(): boolean {
  return parseInt(localStorage.music || "1") === 1;
}

export function setMusicEnabled(enabled: boolean) {
  localStorage.music = enabled ? 1 : 0;
}

export function getSFXEnabled(): boolean {
  return parseInt(localStorage.sfx || "1") === 1;
}

export function setSFXEnabled(enabled: boolean) {
  localStorage.sfx = enabled ? 1 : 0;
}

export function getTTSEnabled(): boolean {
  return parseInt(localStorage.tts || "0") === 1;
}

export function setTTSEnabled(enabled: boolean) {
  localStorage.tts = enabled ? 1 : 0;
}

export function getMode(): boolean {
  return parseInt(localStorage.mode || "1") === 1;
}

export function setMode(mode: boolean) {
  localStorage.mode = mode ? 1 : 0;
}

export function getUnseenIndex(): number {
  return parseInt(localStorage.unseenIndex || "0");
}

export function setUnseenIndex(unseenIndex: number) {
  localStorage.unseenIndex = unseenIndex;
}

export function getStreak(): number {
  return parseInt(localStorage.streak || "0");
}

export function setStreak(streak: number) {
  localStorage.streak = streak;
}

export function getLevel(): number {
  return parseInt(localStorage.level || "1");
}

export function setLevel(level: number) {
  localStorage.level = level;
}

export function getXp(): number {
  return parseInt(localStorage.xp || "0");
}

export function setXp(xp: number) {
  localStorage.xp = xp;
}

export function getEnergy(): { energy: number; time: number } {
  return {
    energy: parseInt(localStorage.energy || "30"),
    time: parseInt(localStorage.energyTimestamp || "0"),
  };
}

export function setEnergy(energy: number, time: number) {
  localStorage.energy = energy;
  localStorage.energyTimestamp = time;
}

export function getStudiedToday(): number {
  return parseInt(localStorage.studiedToday || "0");
}

export function setStudiedToday(count: number) {
  localStorage.studiedToday = count;
}

export function getLastPlayed(): number {
  return parseInt(localStorage.lastPlayed || "0");
}

export function setLastPlayed(day: number) {
  localStorage.lastPlayed = day;
}

// @ts-ignore: for testing
window.reset = () => {
  db.delete();
  localStorage.clear();
  window.location.reload();
};
