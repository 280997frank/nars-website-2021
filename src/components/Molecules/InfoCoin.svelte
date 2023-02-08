<script lang="ts">
  import CoinIcon from "@/components/Atoms/Icons/RedCoin.svelte";
  import { json, _ } from "svelte-i18n";
  import Modal from "../Atoms/Modal.svelte";

  export let onClose = () => null;
  export let isOpen = false;

  const paragraphs = $json("nwallet.howToEarnParagraphs") as string[];
</script>

<Modal isOpen="{isOpen}" onClose="{onClose}">
  <div class="content-title">
    <CoinIcon width="{35}" height="{35}" />
    <span class="content-title-text">{@html $_("nwallet.howToEarn")}</span>
  </div>
  <div class="instruction">
    {#each paragraphs as paragraph (paragraph)}
      <p>{@html paragraph}</p>
    {/each}
  </div>
</Modal>

<style lang="scss">
  .content-title {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }
  .content-title-text {
    font-size: 24px;
    font-weight: 250;
    color: #fff;
    margin-left: 28px;
    padding-top: 7px;
  }

  .instruction {
    height: 42vh;
    overflow-y: auto;
  }

  p {
    font-weight: 300;
    color: #fff;
  }
</style>
