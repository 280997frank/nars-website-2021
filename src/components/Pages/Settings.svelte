<script lang="ts">
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  import SettingsContainer from "@/components/Organisms/SettingContainer.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileFooter from "@/components/Molecules/ProfileFooter.svelte";

  import { retailerName as retailerNameStore } from "@/stores/retailer";

  import { getAccessToken } from "@/utils";

  export let retailerName: string;

  $retailerNameStore = retailerName;
</script>

<Layout>
  {#if getAccessToken()}
    <Navbar
      onBackButtonClick="{() => navigate(`/${retailerName}/profile`)}"
      backTitle="{$_('backButton.profile')}"
    />
  {:else}
    <Navbar
      onBackButtonClick="{() => navigate(`/${retailerName}`)}"
      backTitle="{$_('backButton.nonstopHall')}"
    />
  {/if}
  <SettingsContainer />
  {#if getAccessToken()}
    <ProfileFooter />
  {/if}
</Layout>

<style lang="scss">
  //
</style>
