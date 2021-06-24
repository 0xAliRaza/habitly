<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input
        required
        type="text"
        class="form-control"
        id="title"
        v-model="form.title"
        maxlength="50"
      />
    </div>
    <div class="mb-3">
      <label for="ritual" class="form-label">Ritual</label>
      <input
        type="text"
        class="form-control"
        id="ritual"
        v-model="form.ritual"
        maxlength="50"
      />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea
        class="form-control"
        id="description"
        v-model="form.description"
        maxlength="250"
      >
      </textarea>
    </div>
    <div class="mb-4">
      <label for="type" class="form-label">Type</label>
      <select required class="form-select" id="type" v-model="form.type">
        <option selected disabled value>------</option>
        <option value="G">Good</option>
        <option value="B">Bad</option>
      </select>
    </div>

    <div class="d-flex justify-content-end">
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <template v-if="loading">
          Submitting
          <span
            class="spinner-border spinner-border-sm ms-1"
            role="status"
            aria-hidden="true"
          ></span>
        </template>
        <template v-else> Submit </template>
      </button>
    </div>
  </form>
</template>

<style lang="sass" scoped></style>

<script>
import { reactive } from 'vue';
export default {
  name: 'HabitForm',
  props: {
    habit: {
      type: Object,
      default() {
        return { title: '', ritual: '', description: '', type: '' };
      },
    },
    loading: { type: Boolean, required: true },
  },
  setup(props, { emit }) {
    const form = reactive({
      title: props.habit.title,
      ritual: props.habit.ritual,
      description: props.habit.description,
      type: props.habit.type,
    });

    const onSubmit = () => {
      // Make a duplicate of form object by spreading it inside an empty object
      // - because other it would stay reactive
      emit('onSubmit', { form: { ...form } });
    };

    return { form, onSubmit };
  },
};
</script>
