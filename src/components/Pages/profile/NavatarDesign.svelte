<script lang="ts">
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileFooter from "@/components/Molecules/ProfileFooter.svelte";
  import NavatarDesignContent from "@/components/Organisms/navatar/NavatarDesignContent.svelte";
  import Layout from "@/components/Templates/Layout.svelte";

  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { getAccessToken } from "@/utils";
  import { backFromNavatar } from "@/stores/navatar";
  export let retailerName: string;

  $retailerNameStore = retailerName;

  onDestroy(() => {
    backFromNavatar.set("");
  });
</script>

<Layout isFlex isPrivate>
  <Navbar
    backTitle="{$backFromNavatar
      ? $_('backButton.backToProduct')
      : $_('backButton.profile')}"
    onBackButtonClick="{() =>
      navigate($backFromNavatar || `/${retailerName}/profile`)}"
  />
  <NavatarDesignContent retailerName="{retailerName}" />
  {#if getAccessToken()}
    <ProfileFooter />
  {/if}
</Layout>

<style lang="scss">
</style>
