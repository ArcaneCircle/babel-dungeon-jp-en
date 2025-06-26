// @ts-ignore
import { Howl } from "howler";

import VictorySmallURL from "@sfx/VictorySmall.mp3";
import successURL from "@sfx/success.mp3";
import errorURL from "@sfx/error.mp3";
import vgmenuhighlightURL from "@sfx/vgmenuhighlight.mp3";

export const levelUpSfx = new Howl({
  src: [VictorySmallURL],
});

export const successSfx = new Howl({
  src: [successURL],
});

export const errorSfx = new Howl({
  src: [errorURL],
});

export const clickSfx = new Howl({
  src: [vgmenuhighlightURL],
});
