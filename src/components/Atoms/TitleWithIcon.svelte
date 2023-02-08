<script lang="ts">
  export let title: string;
</script>

<div
  class="title-w-icon is-flex is-flex-direction-row	is-align-items-center	is-gap"
>
  <div class="icon">
    <slot />
  </div>
  <h1>{title.toLocaleUpperCase()}</h1>
</div>

<style lang="scss">
  @use "../../styles/flexbox" as flex;
  @use "../../styles/typography" as t;

  .title-w-icon {
    padding: 10px 0;
  }

  h1 {
    @include t.typography;
    font-size: 22px;
    line-height: 2.25rem;
    // margin-top: 5px;
    text-align: start;
  }

  .icon {
    color: white;
    width: 25px;
    height: 25px;
  }

  .is-gap {
    @include flex.zod-gap;
  }
</style>
