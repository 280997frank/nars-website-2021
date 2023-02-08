<script lang="ts">
  import { _ } from "svelte-i18n";

  import { gameInstance } from "@/stores/game";

  export let onSkip: () => void;

  function skipTutorial() {
    $gameInstance.SendMessage(
      "[Bridge]",
      "ReceiveMessageFromPage",
      JSON.stringify({
        Type: "skip",
        Username: "",
        Token: "",
        Api: "",
      })
    );

    onSkip();
  }
</script>

<nav class="navbar" aria-label="main navigation">
  <div class="navbar-brand">
    <h1 class="navbar-item">{$_("play.title")}</h1>
    <button class="skip button is-text" on:click="{skipTutorial}">
      {$_("play.skip")}
    </button>
  </div>
</nav>

<style lang="scss">
  .navbar {
    background-color: transparent;
    padding-top: 1rem;
  }

  .navbar-brand {
    justify-content: flex-end;
    align-items: center;
    position: relative;
    width: 100%;

    .navbar-item {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      font-weight: normal;
      color: white;
      font-weight: normal;
    }
  }

  .skip {
    color: white;

    &:hover {
      color: black;
    }
  }
</style>
