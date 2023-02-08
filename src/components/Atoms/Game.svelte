<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { gameInstance } from "@/stores/game";

  onMount(() => {
    $gameInstance = window.UnityLoader.instantiate(
      "gameContainer",
      $_("play.json")
    );

    let scaleToFit = false;

    try {
      scaleToFit = !!JSON.parse("true");
    } catch (e) {
      scaleToFit = true;
    }

    function onResize() {
      const canvas = $gameInstance.Module.canvas;
      const container = $gameInstance.container;
      let w = 0;
      let h = 0;

      if (scaleToFit) {
        w = window.innerWidth;
        h = window.innerHeight;

        const r = 2880 / 1500;

        if (w * r > window.innerHeight) {
          w = Math.min(w, Math.ceil(h / r));
        }
        h = Math.floor(w * r);
      } else {
        w = 1500;
        h = 2880;
      }

      container.style.width = canvas.style.width = `inherit`;
      container.style.height = canvas.style.height = `${h}px`;
      container.style.top = `${Math.floor((window.innerHeight - h) / 2)}px`;
      container.style.left = `${Math.floor((window.innerWidth - w) / 2)}px`;
    }

    onResize();

    window.addEventListener("resize", onResize, false);

    return () => {
      window.removeEventListener("resize", onResize, false);
      $gameInstance.Quit();
    };
  });
</script>

<div id="gameContainer" data-pixelated="true">
  <canvas></canvas>
</div>

<style lang="scss">
  div#gameContainer {
    background: transparent !important;
    // position: absolute;
    width: 100% !important ;
    position: static !important;

    &[data-pixelated="true"] canvas {
      image-rendering: optimizeSpeed;
      image-rendering: -webkit-crisp-edges;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: optimize-contrast;
      image-rendering: pixelated;
      -ms-interpolation-mode: nearest-neighbor;
    }

    canvas {
      position: absolute;
    }
  }
</style>
