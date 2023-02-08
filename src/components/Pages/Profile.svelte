<script lang="ts">
  import Layout from "@/components/Templates/Layout.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileFooter from "@/components/Molecules/ProfileFooter.svelte";
  import Navatar from "@/components/Atoms/Navatar.svelte";
  import { getRoomName, goToRoom } from "@/utils";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { getAccessToken } from "@/utils";
  export let retailerName: string;
  import { _ } from "svelte-i18n";

  $retailerNameStore = retailerName;

  // import { initializeWeChatApi } from "@/utils/wechat";

  // export let location: Location;

  // initializeWeChatApi(encodeURIComponent(location.href.split("#")[0]));
</script>

<Layout isPrivate>
  <Navbar
    backTitle="{$_(
      'backButton.nonstop' +
        getRoomName().charAt(0).toUpperCase() +
        getRoomName().slice(1)
    )}"
    onBackButtonClick="{() => goToRoom(getRoomName())}"
  />
  <Navatar />
  {#if getAccessToken()}
    <ProfileFooter />
  {/if}
</Layout>

<style lang="scss">
  //
</style>
