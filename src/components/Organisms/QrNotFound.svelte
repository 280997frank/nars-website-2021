<script lang="ts">
  import { navigate } from "svelte-routing";
  import { _ } from "svelte-i18n";
  export let retailerName: string;
</script>

<div class="container">
  <div class="header-text">
    <h3 class="text-title">{$_("nwallet.comingSoon")}</h3>
    <p class="text-content">{$_("nwallet.noSeasonalOffer")}</p>
  </div>
  <button
    class="back"
    on:click="{() => navigate(`/${retailerName}/profile/nwallet`)}"
  >
    {$_("nwallet.back")}
  </button>
</div>

<style lang="scss">
  @import "../../styles/_typography.scss";
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 80%;
    width: 70%;
  }
  .text-title {
    @include typography;
    text-transform: uppercase;
    font-size: 24px;
    height: 25px;
    line-height: 28.8px;
    font-weight: 300;
    text-align: center;
  }
  .text-content {
    @include typography;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 300;
    text-align: center;
    margin-bottom: 1rem;
  }
  .back {
    @include typography;
    margin-top: 2rem;
    border: 1px solid #fff;
    padding: 10px 70px;
    cursor: pointer;
    background-color: #000;
  }
</style>
