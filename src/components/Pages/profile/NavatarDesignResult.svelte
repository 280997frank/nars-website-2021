<script lang="ts">
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileFooter from "@/components/Molecules/ProfileFooter.svelte";
  import NavatarDesignResultContent from "@/components/Organisms/navatar/NavatarDesignResultContent.svelte";
  import Layout from "@/components/Templates/Layout.svelte";

  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { getAccessToken } from "@/utils";
  export let retailerName: string;

  $retailerNameStore = retailerName;
</script>

<Layout isFlex isPrivate>
  <Navbar
    backTitle="{$_('backButton.profile')}"
    onBackButtonClick="{() => navigate(`/${retailerName}/profile`)}"
  />
  <NavatarDesignResultContent retailerName="{retailerName}" />
  {#if getAccessToken()}
    <ProfileFooter />
  {/if}
</Layout>

<style lang="scss">
</style>
