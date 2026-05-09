import Phaser from "phaser";

const MUSIC_KEY = "music-main";

const SFX_KEYS = {
  wind: "sfx-kyle-wind",
  lightning: "sfx-paul-lightning",
  objectPushed: "sfx-object-pushed",
  puzzleSolved: "sfx-puzzle-solved",
  victory: "sfx-victory",
} as const;

type SfxKey = keyof typeof SFX_KEYS;

export class AudioSystem {
  private music?: Phaser.Sound.BaseSound;
  private muted = false;

  constructor(private readonly scene: Phaser.Scene) {}

  static preload(scene: Phaser.Scene): void {
    scene.load.audio(MUSIC_KEY, "/assets/audio/music-main.mp3");
    scene.load.audio(SFX_KEYS.wind, "/assets/audio/sfx/kyle-wind.wav");
    scene.load.audio(SFX_KEYS.lightning, "/assets/audio/sfx/paul-lightning.wav");
    scene.load.audio(SFX_KEYS.objectPushed, "/assets/audio/sfx/object-pushed.wav");
    scene.load.audio(SFX_KEYS.puzzleSolved, "/assets/audio/sfx/puzzle-solved.wav");
    scene.load.audio(SFX_KEYS.victory, "/assets/audio/sfx/victory.wav");
  }

  startMusic(): void {
    if (!this.music) {
      this.music = this.scene.sound.add(MUSIC_KEY, { loop: true, volume: 0.35 });
    }

    if (!this.music.isPlaying && !this.muted) {
      this.music.play();
    }
  }

  playSfx(key: SfxKey): void {
    if (this.muted) return;

    this.scene.sound.play(SFX_KEYS[key], { volume: 0.5 });
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    this.scene.sound.setMute(this.muted);
    return this.muted;
  }
}
