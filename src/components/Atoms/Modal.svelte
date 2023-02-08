<script>
  import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
  import MediaQuery from "./MediaQuery.svelte";

  export let isOpen = false;
  export let onClose;
  export let title = null;
</script>

{#if isOpen}
  <div class="overlay">
    <MediaQuery query="(max-width: 480px)" let:matches>
      <div class="modal {matches ? 'modal-mobile' : 'modal-desktop'}">
        <div class="is-flex is-flex-direction-row	is-justify-content-flex-end	">
          <button on:click="{onClose}" class="btn-close">
            <span class="icon">
              <IoIosClose />
            </span>
          </button>
        </div>
        <main class="main">
          {#if title !== null}
            <section class="header">
              <h1 class="title">{title}</h1>
            </section>
            <hr />
          {/if}
          <section class="content">
            <slot />
          </section>
        </main>
      </div>
    </MediaQuery>
  </div>
{/if}

<style lang="scss">
  @use "../../styles/typography" as t;

  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 500;
    background-color: rgba(0, 0, 0, 0.9);
    display: grid;
    align-items: center;
    justify-items: center;
  }

  .modal {
    padding: 1em;
    position: relative;
    border-radius: 5px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    display: block;

    .icon {
      color: white;
      width: 40px;
      height: 40px;
    }

    .main {
      background: black;
      border: 1px solid white;
      padding: 28px;

      @media (min-width: 53vh) {
        width: 39vh;
      }

      hr {
        background-color: #292929;
        height: 1px;
      }

      section.header {
        margin-bottom: 10px;
      }
      .title {
        @include t.typography;
        text-transform: uppercase;
        font-size: 24px;
        line-height: 2.25rem;
        margin-top: 1rem;
        text-align: start;
      }

      .content {
        min-height: 42vh;
      }
    }
  }

  .modal-mobile {
    width: 95%;
  }

  .modal-desktop {
    top: -20px;
    width: 400px;
  }

  .btn-close {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    margin-right: -8px;
  }
</style>
