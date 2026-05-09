import Phaser from "phaser";
import { BootScene } from "./game/scenes/BootScene";
import { MainScene } from "./game/scenes/MainScene";
import { UIScene } from "./game/scenes/UIScene";
import "./styles.css";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#151820",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 640,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, MainScene, UIScene],
};

new Phaser.Game(config);
