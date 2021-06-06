<template>
  <div class="habit">
    <span>Lorem ipsum dolor sit amet consectetur</span>
    <input type="checkbox" class="form-check-input" />
  </div>
</template>

<script>
export default {
  name: 'Habit',
};
</script>

<style lang="scss">
.habit {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: pxToRem(12) pxToRem(16);
  border: 1px solid rgba($color-green, 0.2);
  background-color: rgba($color-green, 0.07);
  border-radius: pxToRem(8);
  border-top-left-radius: 0;
  input {
    // padding: pxToRem(8) pxToRem(8);
    border: 1px solid rgba($color-green, 0.3);
  }
}
</style>
