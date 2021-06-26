<template>
  <form @submit.prevent>
    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input
        required
        type="text"
        class="form-control"
        id="title"
        v-model="form.title"
        maxlength="50"
        placeholder="E.g. Go for a run"
      />
    </div>
    <div class="mb-3">
      <label
        for="ritual"
        class="
          form-label
          d-inline-flex
          justify-content-center
          align-items-center
        "
        >Ritual
        <info-tooltip
          placement="right"
          title="Action that your habit starts with."
        ></info-tooltip>
      </label>
      <input
        type="text"
        class="form-control"
        id="ritual"
        v-model="form.ritual"
        maxlength="50"
        placeholder="E.g. Wearing running shorts"
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
    <div class="mb-3">
      <label for="type" class="form-label">Type</label>
      <select required class="form-select" id="type" v-model="form.type">
        <option selected disabled value>------</option>
        <option value="G">Good</option>
        <option value="B">Bad</option>
      </select>
    </div>
    <div class="mb-3">
      <errors v-if="error" :error="error"> </errors>
    </div>

    <div class="d-flex justify-content-end">
      <submit-button
        :loading="loading"
        color="primary"
        @submit="onSubmit"
      ></submit-button>
    </div>
  </form>
</template>

<style lang="sass" scoped></style>

<script>
import { reactive } from 'vue';
import Errors from '@/components/Errors.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import InfoTooltip from './InfoTooltip.vue';
export default {
  name: 'HabitForm',
  components: { Errors, InfoTooltip, SubmitButton },
  props: {
    habit: {
      type: Object,
      default() {
        return { title: '', ritual: '', description: '', type: '' };
      },
    },
    error: Object,
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
      // - because otherwise it stays reactive
      emit('onSubmit', { ...form });
    };

    return { form, onSubmit };
  },
};
</script>
