<template>
  <div
    class="habit"
    tabindex="0"
    :class="{
      'habit--good': habit.type === 'G',
      'habit--bad': habit.type === 'B',
    }"
  >
    <router-link custom v-slot="{ navigate }" :to="'/habits/' + habit.id">
      <div @click="navigate" class="habit__text">
        <span>{{ habit.title }}</span>
      </div>
    </router-link>
    <div class="habit__checkbox">
      <input
        type="checkbox"
        class="form-check-input"
        @click.prevent="toggleRep"
        :checked="habit.todays_repetition"
        :disabled="repetitionLoading"
        v-if="repetitionLoading !== habit.id"
        title="Toggle today's repetition"
      />
      <span
        v-else
        class="spinner-border spinner-border-sm text-primary"
        role="status"
        aria-hidden="true"
      ></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Habit',
  emits: ['deleteRep', 'createRep'],
  props: {
    repetitionLoading: Number,
    habit: { required: true, type: Object },
  },
  setup(props, { emit }) {
    const toggleRep = () => {
      if (props.habit.todays_repetition) {
        // Delete only if already exists
        emit('deleteRep', props.habit);
      } else {
        emit('createRep', props.habit);
      }
    };
    return { toggleRep };
  },
};
</script>
<style lang="scss" scoped>
.habit {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  border-radius: pxToRem(8);
  border-top-left-radius: 0;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 pxToRem(4) pxToRem(10) 0 rgba($color-gray, 0.25);
  }

  &__text {
    flex: 1;
    margin-right: pxToRem(10);
    padding: pxToRem(12) 0 pxToRem(12) pxToRem(16);
  }
  &__checkbox {
    display: inline-flex;
    align-items: center;
    margin-right: pxToRem(16);
  }

  input[type='checkbox'] {
    height: 1.1em;
    width: 1.1em;
    border-radius: 0.27em;
    margin: 0;
    &:checked {
      background-color: $color-primary;
      &:focus {
        box-shadow: 0 0 0 0.25rem rgba($color-primary, 0.25);
      }
    }
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
