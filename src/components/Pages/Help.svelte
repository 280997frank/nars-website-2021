<script lang="ts">
  import { navigate } from "svelte-routing";
  import { _ } from "svelte-i18n";

  import Layout from "@/components/Templates/Layout.svelte";
  import TitleWithIcon from "../Atoms/TitleWithIcon.svelte";
  import Navbar from "../Molecules/Navbar.svelte";
  import HelpContainer from "../Organisms/HelpContainer.svelte";

  import { retailerName as retailerNameStore } from "@/stores/retailer";

  export let retailerName: string;

  $retailerNameStore = retailerName;
</script>

<Layout>
  <Navbar
    onBackButtonClick="{() => navigate(`/${retailerName}/profile/settings`)}"
    backTitle="{$_('settings.title')}"
  />
  <main class="main">
    <TitleWithIcon title="{$_('settings.help')}">
      <img
        src="/icons/icon-help.svg"
        alt="information"
        width="25px"
        height="25px"
      />
    </TitleWithIcon>

    <div class="help-list">
      <HelpContainer />
    </div>
  </main>
</Layout>

<style lang="scss">
  .main {
    height: 100%;
    height: -webkit-fill-available;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
  }

  .help-list {
    flex: 1;
    overflow: hidden auto;
    margin-bottom: 4rem;
  }
</style>
