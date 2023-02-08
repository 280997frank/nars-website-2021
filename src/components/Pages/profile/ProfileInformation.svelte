<script lang="ts">
  import { fetchProfile } from "@/api/retailer";
  import TitleWithIcon from "@/components/Atoms/TitleWithIcon.svelte";
  import Navbar from "@/components/Molecules/Navbar.svelte";
  import ProfileInfoForm from "@/components/Organisms/ProfileInfoForm.svelte";
  import Layout from "@/components/Templates/Layout.svelte";
  import { userData } from "@/stores/profile";
  import { retailerName as retailerNameStore } from "@/stores/retailer";
  import { getAccessToken } from "@/utils";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { navigate } from "svelte-routing";

  export let retailerName: string;

  $retailerNameStore = retailerName;

  onMount(() => {
    if (getAccessToken() && !$userData) {
      fetchProfile()
        .then((profile) => {
          $userData = profile;
        })
        .catch((error) => console.error(error));
    }
  });
</script>

<Layout isPrivate>
  <Navbar
    onBackButtonClick="{() => navigate(`/${retailerName}/profile/settings`)}"
    backTitle="{$_('profile.settings')}"
  />
  <main class="main">
    <TitleWithIcon title="{$_('settings.personalInformation')}">
      <img
        src="/icons/icon-personal-info.svg"
        alt=""
        width="25px"
        height="25px"
      />
    </TitleWithIcon>
    <ProfileInfoForm />
  </main>
</Layout>

<style lang="scss">
  .main {
    padding: 0 16px;
  }
</style>
