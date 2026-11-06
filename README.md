# Web Audio Speaker Tones

A small, dependency-free JavaScript module and demo page for generating speaker test tones with the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

**Live demo:** https://speakercleaningtool-com.github.io/web-audio-speaker-tones/

## Features

- Steady sine tone at any frequency (demo uses 165 Hz)
- Exponential frequency sweep (demo: 100 Hz to 1 kHz)
- Left / right channel test with `StereoPannerNode`
- Live volume control
- 50 ms fade in and out to avoid speaker pops
- Runs fully in the browser. No microphone, no recording, no uploads, no dependencies

## Usage

```html
<script type="module">
  import { ToneEngine } from "./tone-engine.js";

  let engine;
  document.querySelector("#play").addEventListener("click", () => {
    engine ??= new ToneEngine(); // create inside a user gesture
    engine.playTone({ frequency: 165, duration: 30, volume: 0.3 });
  });
</script>
```

### API

| Method | Options |
| --- | --- |
| `playTone(opts)` | `frequency` (Hz), `duration` (s), `volume` (0 to 1), `pan` (-1 to 1), `type` (`sine`, `square`, `triangle`, `sawtooth`) |
| `playSweep(opts)` | `from` (Hz), `to` (Hz), `duration` (s), `volume`, `pan` |
| `setVolume(v)` | `0` to `1` |
| `stop()` | Fades out and stops the current sound |

## Why create the AudioContext on click?

Browsers block audio until the user interacts with the page. Creating the `AudioContext` inside a click or tap handler avoids the "suspended" state and autoplay warnings.

## Safety

Start at a low volume. Do not play test tones through earbuds or headphones at high volume. Stop if the speaker rattles or distorts. Tones cannot repair hardware damage.

## Run locally

```bash
npx serve .
# or
python3 -m http.server
```

Open the printed URL. ES modules need a local server; opening `index.html` directly from disk will not load the module.

## Deploy to GitHub Pages

1. Push this folder to a public repo named `web-audio-speaker-tones`.
2. Go to **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Your demo appears at `https://YOUR-USERNAME.github.io/web-audio-speaker-tones/`.

## Production tool

This module is a simplified version of the audio engine behind [Speaker Cleaning Tool](https://speakercleaningtool.com), a free browser tool with speaker, headphone and microphone tests plus troubleshooting guides.

## Author

Nayeem, Software Developer. [speakercleaningtool.com](https://speakercleaningtool.com)

## License

[MIT](./LICENSE)
