<script lang="ts">
  import { taskQrCode } from "@/api/wallet";
  import Button from "@/components/Atoms/Button.svelte";
  import CoinIcon from "@/components/Atoms/Icons/RedCoin.svelte";
  import { retailerName } from "@/stores/retailer";
  import { useMutation } from "@sveltestack/svelte-query";
  import QrScanner from "qr-scanner";
  import { onDestroy, onMount } from "svelte";
  // import { toasts } from "svelte-toasts";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";
  let stopCamera: () => void;
  let coin: number;

  const mutationQRCode = useMutation(taskQrCode, {
    onError(error: Error) {
      console.log("GET TASK ERROR", error.message);
      location.reload();
    },
  });

  onMount(async () => {
    const video = document.getElementById("preview") as HTMLVideoElement;
    if (video) {
      const scanner = new QrScanner(
        video,
        (result: string) => {
          redemQRCode(result, scanner);
        },
        (error) => {
          console.log(error, "error");
        }
      );

      await QrScanner.listCameras(true).then((cameras) => {
        if (cameras.length > 1) {
          scanner.setCamera(cameras[cameras.length - 1].id);
        } else {
          scanner.setCamera("face");
        }
      });

      stopCamera = () => {
        scanner.stop();
      };

      scanner.start();
    }
  });

  $: {
    if ($mutationQRCode.isSuccess) {
      const newCoin = $mutationQRCode.data.data.taskReward;
      coin = newCoin;
    }
  }

  const redemQRCode = (code, scanner) => {
    scanner.pause();
    const payload = {
      task: code,
    };
    $mutationQRCode.mutate(payload);
  };

  onDestroy(() => {
    stopCamera();
  });
</script>

<section id="qrcode-scanner" class="px-2 py-2 bg-pink-100 md:py-24">
  {#if $mutationQRCode.isSuccess}
    <div class="success-container">
      <h3 class="white congrats">{$_("nwallet.congrats")}</h3>
      <h5 class="white text1">{$_("nwallet.youFound")}</h5>
      <div class="score-container white">
        <CoinIcon height="{40}" width="{40}" />
        <span class="score">+{coin}</span>
      </div>
      <p class="white collect">{@html $_("nwallet.saveToNwallet")}</p>
      <div class="btn-containe">
        <Button onClick="{() => navigate(`/${$retailerName}/profile/nwallet`)}">
          {$_("nwallet.collect")}
        </Button>
      </div>
    </div>
  {/if}

  <div class="header-text mb-5">
    <h3 class="text-title">{@html $_("nwallet.collectNcoins")}</h3>
    <p class="text-content">
      {@html $_("nwallet.useYourCamera")}
    </p>
  </div>
  <br />
  <!-- svelte-ignore a11y-media-has-caption -->
  <video id="preview" muted playsinline></video>
</section>

<style lang="scss">
  @import "../../../styles/_typography.scss";
  .text-title {
    @include typography;
    text-transform: uppercase;
    font-size: 24px;
    height: 25px;
    line-height: 28.8px;
    font-weight: 300;
    text-align: left;
  }
  .text-content {
    @include typography;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 300;
    text-align: justify;
    margin-bottom: 1rem;
  }
  #preview {
    width: 100vw;
    height: 50vh;
    margin: 0px auto;
    object-fit: cover;
  }
  #qrcode-scanner {
    position: relative;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .success-container {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba($color: #000000, $alpha: 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .white {
    color: #fff;
    @include typography;
    text-transform: uppercase;
  }
  .congrats {
    font-size: 24px;
    margin-bottom: 0.5rem;
  }
  .text1 {
    font-size: 1rem;
  }
  .score-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-bottom: 1rem;
  }
  .score {
    font-size: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 5px;
    padding-left: 5px;
  }
  .collect {
    font-size: 15px;
    width: 50%;
    text-align: center;
  }
  .btn-containe {
    width: 50%;
  }
</style>
