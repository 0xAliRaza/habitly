<template>
  <div class="container">
    <div class="row">
      <div class="d-flex justify-content-end align-items-center mb-4">
        <toggle
          color="dark"
          btn-text="Create stack"
          @toggle="toggleForm"
          :visibility="formVisible"
        ></toggle>
      </div>
      <div class="col-sm-12 mb-5" v-if="formVisible">
        <form @submit.prevent>
          <div class="row align-items-center">
            <div class="col-lg-5">
              <VueMultiselect
                v-model="currentHabit"
                :options="goodHabits"
                placeholder="Select current habit"
                label="title"
                track-by="id"
              />
            </div>
            <div class="col-lg-5 mt-2 mt-lg-0">
              <VueMultiselect
                v-model="newHabit"
                :options="goodHabits"
                placeholder="Select new habit"
                label="title"
                trackBy="id"
              />
            </div>
            <div class="col-lg-2 text-lg-center text-end mt-2 mt-lg-0">
              <submit-button
                :loading="submitting"
                color="primary"
                :disabled="!currentHabit || !newHabit"
                @submit="onSubmit"
              ></submit-button>
            </div>
            <div class="col-12 mt-2" v-if="error">
              <div class="">
                <p class="text-danger p-2 m-0">Error: {{ error }}</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="col-sm-12">
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <h1 class="">Habit Stacks</h1>
          <div class="py-3" v-if="stacks.length < 1">
            <p class="alert-info p-1">
              You haven't created any habit stacks yet.
            </p>
          </div>
          <template v-else>
            <div class="my-2 align-self-end">
              <select v-model="tableView" class="form-select">
                <option :value="false">Paragraph</option>
                <option :value="true">Table</option>
              </select>
            </div>
            <div v-if="!tableView" class="py-3">
              <div
                v-for="stack in stacks"
                :key="stack.id"
                class="d-flex align-items-center mb-3"
              >
                <p class="m-0">
                  After I <a href="#">{{ stack.current_habit.title }}</a
                  >, I will <a href="#">{{ stack.new_habit.title }}</a
                  >.
                </p>
                <button
                  class="
                    btn btn--stack-delete
                    d-inline-flex
                    align-items-center
                    ms-auto
                  "
                  @click.prevent="onDelete(stack.id)"
                  :disabled="deleting"
                >
                  <template v-if="deleting == stack.id">
                    <span
                      class="spinner-border spinner-border-sm ms-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </template>
                  <template v-else>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash ms-1"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
                  </template>
                </button>
              </div>
            </div>
            <div class="table-responsive" v-else>
              <table class="table text-center table-bordered">
                <thead class="">
                  <tr>
                    <th scope="col">Current Habit</th>
                    <th scope="col">New Habit</th>
                    <th scope="col">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stack in stacks" :key="stack.id">
                    <td>
                      <a href="#" class="text-decoration-none">{{
                        stack.current_habit.title
                      }}</a>
                    </td>
                    <td>
                      <a href="#" class="text-decoration-none">{{
                        stack.new_habit.title
                      }}</a>
                    </td>
                    <td>
                      <button
                        class="
                          btn btn--stack-delete
                          d-inline-flex
                          align-items-center
                        "
                        @click.prevent="onDelete(stack.id)"
                        :disabled="deleting"
                      >
                        <template v-if="deleting == stack.id">
                          <span
                            class="spinner-border spinner-border-sm ms-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </template>
                        <template v-else>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-trash ms-1"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                          </svg>
                        </template>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import VueMultiselect from 'vue-multiselect';
import SubmitButton from '@/components/SubmitButton.vue';
import Toggle from '@/components/Toggle.vue';

export default {
  components: {
    VueMultiselect,
    SubmitButton,
    Toggle,
  },
  setup() {
    const store = useStore();
    const tableView = ref(false);
    const formVisible = ref(false);
    const currentHabit = ref(null);
    const newHabit = ref(null);
    const submitting = ref(false);
    const deleting = ref(null);
    const error = ref(null);
    const toggleForm = () => {
      currentHabit.value = null;
      newHabit.value = null;
      formVisible.value = !formVisible.value;
    };
    const onSubmit = () => {
      error.value = null;
      submitting.value = true;
      store
        .dispatch('stacks/create', {
          formData: {
            current_habit: currentHabit.value.id,
            new_habit: newHabit.value.id,
          },
        })
        .then((res) => {
          submitting.value = false;
          toggleForm();
        })
        .catch((e) => {
          submitting.value = false;
          console.log(
            '%cStacks.vue line:159 e.response',
            'color: white; background-color: #26bfa5;',
            e.response
          );
          error.value =
            e.response.data.Stack[0] ||
            e.response.status + e.response.statusText;
        });
    };
    const onDelete = (pk) => {
      error.value = null;
      deleting.value = pk;
      store
        .dispatch('stacks/delete', {
          pk: pk,
        })
        .then((res) => {
          deleting.value = null;
        })
        .catch((e) => {
          deleting.value = null;
        });
    };
    return {
      formVisible,
      currentHabit,
      newHabit,
      toggleForm,
      onSubmit,
      tableView,
      submitting,
      deleting,
      onDelete,
      error,
      stacks: computed(() => store.state.stacks.models),
      goodHabits: computed(() => store.getters['habits/good']),
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~vue-multiselect/dist/vue-multiselect.css';

.btn--stack-delete {
  color: $gray-400;
  transition: color 0.2s ease;
  &:hover,
  &:focus {
    color: $color-red;
  }
  span.spinner-border {
    color: $color-red;
  }
}
</style>
