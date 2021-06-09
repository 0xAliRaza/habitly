<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input type="text" class="form-control" id="title" v-model="form.title" />
    </div>
    <div class="mb-3">
      <label for="ritual" class="form-label">Ritual</label>
      <input
        type="text"
        class="form-control"
        id="ritual"
        v-model="form.ritual"
      />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea
        class="form-control"
        id="description"
        v-model="form.description"
      >
      </textarea>
    </div>
    <div class="mb-3">
      <label for="type" class="form-label">Type</label>
      <select class="form-select" id="type" v-model="form.type">
        <option value="good">Good</option>
        <option value="bad">Bad</option>
      </select>
    </div>

    <div class="d-flex justify-content-end">
      <button type="submit" class="btn btn-dark">Submit</button>
    </div>
  </form>
</template>

<style lang="sass" scoped></style>

<script>
import { ref } from 'vue';
export default {
  name: 'HabitForm',
  props: {
    title: { type: String, default: '' },
    ritual: { type: String, default: '' },
    description: { type: String, default: '' },
    type: { type: String, default: '' },
  },
  setup(props, { emit }) {
    const form = ref({
      title: props.title,
      ritual: props.ritual,
      description: props.description,
      type: props.type,
    });
    const onSubmit = () => emit('onSubmit', form);

    return { form, onSubmit };
  },
};
</script>
