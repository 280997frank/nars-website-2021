<script lang="ts">
  import { navigate } from "svelte-routing";
  import { useMutation } from "@sveltestack/svelte-query";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileFooter from "@/components/Molecules/ProfileFooter.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import Qrscan from "@/components/Organisms/QrCode/Instascan.svelte";
  import NotFound from "@/components/Organisms/QrNotFound.svelte";
  import { fetchQRCodeStatusActive } from "@/api/wallet";
  // import { toasts } from "svelte-toasts";

  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { onMount } from "svelte";
  import Spinner from "../Atoms/Spinner.svelte";
  import { getAccessToken } from "@/utils";

  export let retailerName: string;
  let page: string;
  $retailerNameStore = retailerName;

  const mutationCheckQRCode = useMutation(fetchQRCodeStatusActive, {
    onError(error: Error) {
      console.log("GET TASK ERROR", error.message);
    },
  });

  onMount(() => {
    $mutationCheckQRCode.mutate();
  });

  $: {
    if ($mutationCheckQRCode.isSuccess) {
      if ($mutationCheckQRCode.data.data.retailerHasActiveQrCode) {
        page = "qrcode";
      } else {
        page = "notfound";
      }
    }
  }
</script>

<Layout>
  <Navbar
    onBackButtonClick="{() => navigate(`/${retailerName}/profile/nwallet`)}"
    backTitle="NWALLET"
  />
  {#if $mutationCheckQRCode.isLoading}
    <div class="loading-content">
      <Spinner />
    </div>
  {/if}
  <di class="content">
    {#if page === "qrcode"}
      <Qrscan />
    {/if}
    {#if page === "notfound"}
      <NotFound retailerName="{retailerName}" />
    {/if}
  </di>
  {#if getAccessToken()}
    <ProfileFooter />
  {/if}
</Layout>

<style lang="scss">
  .loading-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
  }
  .content {
    height: calc(100vh - 130px);
  }
  //
</style>
