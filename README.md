# Babel Dungeon (🇯🇵/🇬🇧)

A gamified tool for Japanese/English vocabulary learning

## Contributing

### Installing Dependencies

After cloning this repo, install dependencies:

```
pnpm i
```

### Checking code format

```
pnpm check
```

### Testing the app in the browser

To test your work in your browser (with hot reloading!) while developing:

```
pnpm start
```

### Building

To package the WebXDC file:

```
pnpm build
```

To package the WebXDC with developer tools inside to debug in Delta Chat, set the `NODE_ENV`
environment variable to "debug":

```
NODE_ENV=debug pnpm build
```

The resulting optimized `.xdc` file is saved in `dist-xdc/` folder.

### Releasing

To automatically build and create a new GitHub release with the `.xdc` file:

```
git tag -a v1.0.1
git push origin v1.0.1
```

### Credits

- The sentences were extracted from the [Tatoeba](https://tatoeba.org/en/downloads) collection (licensed under CC-BY 2.0).

- Font used: [Press Start 2P](https://github.com/fontsource/font-files/tree/main/fonts/google/press-start-2p) by Google (OFL-1.1 licensed)

- Random monster generator code taken from https://github.com/fabianobizarro/react-monsterid (MIT license)

- Background music is "Cave.mp3" from https://opengameart.org/content/cc0-scraps (CC0 - public domain)

- Level-up SFX is "VictorySmall.wav" from https://opengameart.org/content/8-bit-sound-fx (CC0 - public domain)

- Success/error SFX are "1.wav" and "7.wav" from https://opengameart.org/content/8bit-sfx (CC0 - public domain)

- Click/select SFX is "vgmenuselect.ogg" from https://opengameart.org/content/8bit-menu-highlight (CC0 - public domain)
