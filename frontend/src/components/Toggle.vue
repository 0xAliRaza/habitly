<template>
  <div>
    <button v-if="visible" class="btn-close" @click.prevent="toggle"></button>
    <button
      v-else
      :class="{
        btn: true,
        'btn-sm': small,
        'btn-primary': color === 'primary',
        'btn-dark': color === 'dark',
        'btn-success': color === 'success',
        'btn-danger': color === 'danger',
        'btn-info': color === 'info',
      }"
      @click.prevent="toggle"
    >
      {{ btnText }}
    </button>
  </div>
</template>

<script>
import { ref, watch, watchEffect } from 'vue';
export default {
  emits: ['show', 'hide', 'toggle'],
  props: {
    color: String,
    small: Boolean,
    btnText: { type: String, required: true },
    visibility: { Boolean, required: true },
  },
  setup(props, { emit }) {
    const visible = ref(false);
    const toggle = () => {
      visible.value = !visible.value;
      emit('toggle');
    };

    watchEffect(() => {
      if (props.visibility === true) {
        visible.value = true;
      } else if (props.visibility === false) {
        visible.value = false;
      }
    });

    watch(visible, (visible) => {
      if (visible) {
        emit('show');
      } else {
        emit('hide');
      }
    });

    return { visible, toggle };
  },
};
</script>
