<script lang="ts">
  import { useQuery } from "@sveltestack/svelte-query";
  import { _ } from "svelte-i18n";
  interface QueryResult {
    name: string;
    description: string;
    subscribers_count: number;
    stargazers_count: number;
    forks_count: number;
  }

  const queryResult = useQuery<QueryResult, Error>("repoData", () =>
    fetch("https://api.github.com/repos/SvelteStack/svelte-query").then((res) =>
      res.json()
    )
  );
</script>

{#if $queryResult.isLoading}
  <div id="loading">{$_("nwallet.loading")}</div>
{:else if $queryResult.error}
  <span>An error has occurred: {$queryResult.error.message}</span>
{:else}
  <div>
    <h1>{$queryResult.data.name}</h1>
    <p>{$queryResult.data.description}</p>
    <strong>👀 {$queryResult.data.subscribers_count}</strong>{" "}
    <strong>✨ {$queryResult.data.stargazers_count}</strong>{" "}
    <strong>🍴 {$queryResult.data.forks_count}</strong>
  </div>
  <section class="section">
    <h1 class="title">Section</h1>
    <h2 class="subtitle">
      A simple container to divide your page into <strong>sections</strong>,
      like the one you're currently reading.
    </h2>
  </section>
{/if}

<style lang="scss">
  strong {
    &:hover {
      background-color: red;
      color: white;
    }
  }

  .title {
    background-color: teal;
    color: white;
  }

  #loading {
    opacity: 0.5;
    font-weight: bold;
    color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
