<script>
  export let fill = "none";
  export let fillSvg = "none";
  export let width = 24;
  export let height = 24;
</script>

<svg
  width="{width}"
  height="{height}"
  viewBox="0 0 24 24"
  fill="{fillSvg}"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM10.0369 16H8.66675V8H10.1866L13.9402 13.8936H13.9632V8H15.3334V16H13.8136L10.0715 10.1176H10.0369V16Z"
    fill="{fill}"></path>
  <rect
    x="0.5"
    y="0.5"
    width="23"
    height="23"
    rx="11.5"
    stroke="{fill !== 'none' ? fill : 'white'}"></rect>
</svg>

<style>
  svg {
    cursor: pointer;
  }
</style>
