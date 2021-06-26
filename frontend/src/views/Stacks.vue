<template>
  <div class="container">
    <div class="row align-items-center justify-content-center">
      <!-- CREATE STACK -->
      <div class="d-flex justify-content-end align-items-center mb-4">
        <toggle color="dark" @toggle="toggleForm" :visibility="formVisible">
          Create stack
        </toggle>
      </div>
      <transition name="slide-in">
        <div class="col-lg-6 mb-5" v-if="formVisible">
          <form @submit.prevent>
            <div class="mb-3">
              <label
                for="current-habit"
                class="
                  form-label
                  d-inline-flex
                  justify-content-center
                  align-items-center
                "
                >Current habit
                <info-tooltip
                  placement="bottom"
                  title="Existing habit that is already atomic."
                ></info-tooltip
              ></label>
              <vue-multiselect
                v-model="currentHabit"
                :options="goodHabits"
                placeholder="Select current habit"
                label="title"
                track-by="id"
                id="current-habit"
              />
            </div>
            <div class="mb-3">
              <label
                for="new-habit"
                class="
                  form-label
                  d-inline-flex
                  justify-content-center
                  align-items-center
                "
                >New habit
                <info-tooltip
                  placement="right"
                  title="New habit that you want to make atomic."
                ></info-tooltip
              ></label>
              <vue-multiselect
                v-model="newHabit"
                :options="goodHabits"
                placeholder="Select new habit"
                label="title"
                track-by="id"
                id="new-habit"
              />
            </div>

            <div class="mb-3">
              <errors v-if="error" :error="error"> </errors>
            </div>

            <div class="d-flex justify-content-end">
              <submit-button
                :loading="submitting"
                color="primary"
                :disabled="!currentHabit || !newHabit"
                @submit="onSubmit"
              ></submit-button>
            </div>
          </form>
        </div>
      </transition>
      <!--/ CREATE STACK -->

      <!-- INDEX STACKS -->
      <div class="col-sm-12">
        <div
          class="
            d-flex
            flex-column
            align-items-center
            justify-content-center
            py-2
          "
        >
          <div class="d-flex align-itemc-center justify-content-center">
            <h1 class="m-0">Habit Stacks</h1>
            <info-tooltip
              title="Assign new habits with existing habits to make them atomic."
              placement="right"
            ></info-tooltip>
          </div>
          <div class="py-3" v-if="stacks.length < 1">
            <p class="alert alert-info p-2">No habit stacks found.</p>
          </div>
          <template v-else>
            <div class="my-2 align-self-end">
              <select v-model="tableView" class="form-select">
                <option :value="false">Paragraph</option>
                <option :value="true">Table</option>
              </select>
            </div>
            <!-- PARAGRAPH VIEW -->
            <div v-if="!tableView" class="py-3">
              <div
                v-for="stack in stacks"
                :key="stack.id"
                class="d-flex align-items-center mb-3"
              >
                <p class="m-0">
                  After I
                  <router-link :to="`/habits/${stack.current_habit.id}`">{{
                    stack.current_habit.title
                  }}</router-link
                  >, I will
                  <router-link :to="`/habits/${stack.new_habit.id}`">{{
                    stack.new_habit.title
                  }}</router-link
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
            <!--/ PARAGRAPH VIEW -->

            <!-- TABLE VIEW -->
            <div class="table-responsive py-3" v-else>
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
                      <router-link :to="`/habits/${stack.current_habit.id}`">{{
                        stack.current_habit.title
                      }}</router-link>
                    </td>
                    <td>
                      <router-link :to="`/habits/${stack.new_habit.id}`">{{
                        stack.new_habit.title
                      }}</router-link>
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
            <!--/ TABLE VIEW -->
          </template>
        </div>
      </div>
      <!--/ INDEX STACKS -->
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import VueMultiselect from 'vue-multiselect';
import SubmitButton from '@/components/SubmitButton.vue';
import Toggle from '@/components/Toggle.vue';
import Errors from '@/components/Errors.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
export default {
  components: {
    VueMultiselect,
    SubmitButton,
    Toggle,
    Errors,
    InfoTooltip,
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
      error.value = null;
    };
    const onSubmit = async () => {
      error.value = null;
      submitting.value = true;
      try {
        await store.dispatch('stacks/create', {
          formData: {
            current_habit: currentHabit.value.id,
            new_habit: newHabit.value.id,
          },
        });
      } catch (e) {
        error.value = e;
      } finally {
        submitting.value = false;
        if (!error.value) {
          toggleForm();
        }
      }
    };
    const onDelete = async (pk) => {
      error.value = null;
      deleting.value = pk;
      try {
        await store.dispatch('stacks/delete', {
          pk: pk,
        });
      } finally {
        deleting.value = null;
      }
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
