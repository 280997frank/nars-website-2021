<script lang="ts">
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Model3D from "@/components/Atoms/Model3D.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import Layout from "@/components/Templates/Layout.svelte";

  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    doc.style.setProperty("--app-width", `${window.innerWidth}px`);
  };

  onMount(() => {
    window.addEventListener("resize", appHeight, false);
    appHeight();

    return () => {
      window.removeEventListener("resize", appHeight, false);
    };
  });

  // function logout() {
  //   localStorage.clear();
  //   location.reload();
  // }
</script>

<Layout isPrivate="{false}">
  <Navbar onBackButtonClick="{() => navigate('/')}" />
  <Model3D />
  <!-- <button class="button" on:click="{logout}"> LOGOUT </button> -->
</Layout>

<style lang="scss">
  //
</style>
