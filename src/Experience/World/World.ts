import * as kokomi from "kokomi.js";
import * as THREE from "three";
import { Howl } from "howler";

import type Experience from "../Experience";

import GradientBackground from "./GradientBackground";
import BigCloud from "./BigCloud";
import Column from "./Column";
import Cloud from "./Cloud";
import PolarLight from "./PolarLight";
import StarParticle from "./StarParticle";

export default class World extends kokomi.Component {
  declare base: Experience;
  gb!: GradientBackground | null;
  bc!: BigCloud | null;
  co!: Column | null;
  cl!: Cloud | null;
  pl!: PolarLight | null;
  sp!: StarParticle | null;
  bgm!: Howl;
  constructor(base: Experience) {
    super(base);

    this.base.am.on("ready", async () => {
      this.base.scene.fog = new THREE.Fog(0x389af2, 5000, 10000);

      this.gb = new GradientBackground(this.base);
      this.gb.addExisting();
      this.bc = new BigCloud(this.base);
      this.bc.addExisting();
      this.co = new Column(this.base);
      this.co.addExisting();
      this.cl = new Cloud(this.base);
      this.cl.addExisting();
      this.pl = new PolarLight(this.base);
      this.pl.addExisting();
      this.sp = new StarParticle(this.base);
      this.sp.addExisting();

      await kokomi.sleep(1000);

      document.querySelector(".loader-screen")?.classList.add("hollow");

      const bgm = new Howl({
        src: "Genshin/BGM.mp3",
        loop: true,
      });
      this.bgm = bgm;
      bgm.play();

      await kokomi.sleep(1000);

      document.querySelector(".menu")?.classList.remove("hidden");
    });
  }
  update(): void {
    const progressbar = document.querySelector(
      ".loader-progress"
    )! as HTMLProgressElement;
    progressbar.value = this.base.am.loadProgress * 100;
  }
}
