<template>
  <div>
    <button
      @click.prevent="submit"
      class="d-inline-flex justify-content-center align-items-center btn"
      :class="{
        'btn-small': small,
        'btn-primary': color === 'primary',
        'btn-dark': color === 'dark',
        'btn-success': color === 'success',
        'btn-danger': color === 'danger',
        'btn-info': color === 'info',
      }"
      :disabled="loading || disabled"
    >
      <template v-if="loading">
        <slot name="loading">Submitting</slot>
        <span
          class="spinner-border spinner-border-sm ms-1"
          role="status"
          aria-hidden="true"
        ></span>
      </template>
      <template v-else>
        <slot>Submit</slot>
      </template>
    </button>
  </div>
</template>

<script>
export default {
  emits: ['submit'],
  props: {
    loading: { type: Boolean, required: true },
    disabled: Boolean,
    small: Boolean,
    color: String,
  },
  setup(props, { emit }) {
    const submit = () => {
      emit('submit');
    };

    return { submit };
  },
};
</script>
