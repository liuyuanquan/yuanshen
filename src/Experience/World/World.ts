import * as kokomi from "kokomi.js";
import * as THREE from "three";
import { Howl } from "howler";

import type Experience from "../Experience";

import AmbientLightComponent from "./AmbientLightComponent";
import DirectionalLightComponent from "./DirectionalLightComponent";
import PolarLight from "./PolarLight";
import StarParticle from "./StarParticle";
import Column from "./Column";
import GradientBackground from "./GradientBackground";
import BigCloud from "./BigCloud";
import Cloud from "./Cloud";
import HashFog from "./HashFog";
import ForwardCamera from "./ForwardCamera";

export default class World extends kokomi.Component {
  declare base: Experience;
  alc!: AmbientLightComponent | null;
  dlc!: DirectionalLightComponent | null;
  pl!: PolarLight | null;
  sp!: StarParticle | null;
  co!: Column | null;
  gb!: GradientBackground | null;
  bc!: BigCloud | null;
  cl!: Cloud | null;
  hf!: HashFog | null;
  fc!: ForwardCamera | null;
  bgm!: Howl;
  constructor(base: Experience) {
    super(base);

    this.base.am.on("ready", async () => {
      this.base.scene.fog = new THREE.Fog(0x389af2, 5000, 10000);

      // done
      this.gb = new GradientBackground(this.base);
      this.gb.addExisting();
      this.alc = new AmbientLightComponent(this.base);
      this.alc.addExisting();
      this.dlc = new DirectionalLightComponent(this.base);
      this.dlc.addExisting();
      this.co = new Column(this.base);
      this.co.addExisting();
      this.bc = new BigCloud(this.base);
      this.bc.addExisting();
      this.cl = new Cloud(this.base);
      this.cl.addExisting();
      this.pl = new PolarLight(this.base);
      this.pl.addExisting();
      this.sp = new StarParticle(this.base);
      this.sp.addExisting();
      this.hf = new HashFog(this.base);
      this.hf.addExisting();
      // this.ro = new Road(this.base);
      // this.ro.addExisting();
      this.fc = new ForwardCamera(this.base);
      this.fc.addExisting();

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
