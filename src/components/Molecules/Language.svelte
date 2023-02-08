<script lang="ts">
  import { Accordion, AccordionItem } from "svelte-collapsible";
  import { _, locale } from "svelte-i18n";

  import { supportedLanguages } from "@/stores/retailer";

  let arrow = "/icons/arrow.png";
  let globe = "/icons/icon-language.svg";
  let key = "";

  function switchLanguage(lang: string) {
    localStorage.setItem("locale", lang);
    $locale = lang;
  }

  function selectLanguage(this: HTMLDivElement): void {
    switchLanguage(this.dataset.lang);
  }
</script>

<Accordion bind:key>
  <AccordionItem key="language">
    <div
      slot="header"
      class="header is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center"
    >
      <div class="is-gap is-flex is-flex-direction-row is-align-items-center">
        <div class="icon">
          <img src="{globe}" alt="icon" width="32" height="32" />
        </div>
        <div>
          <h2>{$_("settings.language")}</h2>
        </div>
      </div>
      <div class="icon" class:is-active="{key === 'language'}">
        <img src="{arrow}" alt="icon" height="15" width="8" />
      </div>
    </div>

    <div slot="body" class="body">
      <div
        class="is-gap is-flex is-flex-direction-column is-align-items-flex-start"
      >
        {#each $supportedLanguages as lang (lang)}
          <div class="list-item" data-lang="{lang}" on:click="{selectLanguage}">
            <h3>{lang === "en" ? "ENGLISH" : "简体中文"}</h3>
          </div>
        {/each}
      </div>
    </div>
  </AccordionItem>
</Accordion>

<style lang="scss">
  @use "../../styles/flexbox" as flex;
  @use "../../styles/typography" as typography;

  :global(.accordion) {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }

  :global(.accordion-item) {
    margin: 0;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .header h2 {
    @include typography.typography;
    margin: 0;
    padding: 0;
  }

  .icon {
    color: white;
    width: 25px;
    height: 25px;
    transition: transform 0.4s;
    &.is-active {
      transform: rotate(90deg);
    }
  }

  .is-gap {
    @include flex.zod-gap;
  }

  .body {
    padding: 16px 40px 0;
  }

  .list-item {
    cursor: pointer;
  }

  .list-item:hover {
    color: #f5f5f5;
  }
</style>
