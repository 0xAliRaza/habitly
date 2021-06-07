<template>
  <div class="habit habit--good" tabindex="0">
    <span>Lorem ipsum dolor sit amet consectetur</span>
    <input type="checkbox" class="form-check-input" />
  </div>
</template>

<script>
export default {
  name: 'Habit',
};
</script>

<style lang="scss" scoped>
.habit {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: pxToRem(12) pxToRem(16);
  border-radius: pxToRem(8);
  border-top-left-radius: 0;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 pxToRem(4) pxToRem(10) 0 rgba($color-gray, 0.25);
  }

  input[type='checkbox'] {
    height: 1.1em;
    width: 1.1em;
    border-radius: 0.27em;
    margin: 0;
  }
  &--good {
    background-color: rgba($color-green, 0.1);
    border: 1px solid rgba($color-green, 0.2);
    &:hover {
      background-color: rgba($color-green, 0.2);
    }
    &:focus {
      outline-color: $color-green;
    }
    input[type='checkbox'] {
      border: 1px solid rgba($color-green, 0.3);
    }
  }
  &--bad {
    background-color: rgba($color-red, 0.1);
    border: 1px solid rgba($color-red, 0.2);
    &:hover {
      background-color: rgba($color-red, 0.2);
    }
    &:focus {
      outline-color: $color-red;
    }
    input[type='checkbox'] {
      border: 1px solid rgba($color-red, 0.3);
    }
  }
}
</style>
