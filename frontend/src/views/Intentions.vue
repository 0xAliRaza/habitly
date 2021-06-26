<template>
  <transition name="fade">
    <yayy v-show="yayy"></yayy>
  </transition>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-12">
        <div class="d-flex align-items-center justify-content-end mb-4">
          <toggle color="dark" @toggle="toggleForm" :visibility="formVisible">
            Create intention
          </toggle>
        </div>
      </div>
      <transition name="slide-in">
        <div v-if="formVisible" class="col-lg-6 mb-5">
          <form @submit.prevent>
            <div class="mb-3">
              <label for="habit" class="form-label">Habit</label>
              <vue-multiselect
                v-model="form.habit"
                :options="goodHabits"
                placeholder="Select a habit"
                label="title"
                track-by="id"
                id="habit"
              />
            </div>

            <div class="mb-3">
              <label for="location" class="form-label">Location</label>
              <input
                required
                type="text"
                class="form-control"
                id="location"
                v-model="form.location"
                maxlength="50"
                placeholder="E.g. The kitchen..."
              />
            </div>
            <div class="mb-3">
              <label for="time" class="form-label">Date and Time</label>
              <date-picker
                id="time"
                v-model="form.time"
                color="blue"
                mode="dateTime"
                :min-date="new Date()"
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <input
                    class="form-control"
                    :value="inputValue"
                    v-on="inputEvents"
                    placeholder="Give your habit time to live in this world..."
                  />
                </template>
              </date-picker>
            </div>
            <div class="mb-3">
              <errors v-if="formError" :error="formError"></errors>
            </div>
            <div class="d-flex justify-content-end">
              <submit-button
                :loading="formSubmitting"
                :disabled="formInvalid"
                color="primary"
                @submit="onFormSubmit"
              ></submit-button>
            </div>
          </form>
        </div>
      </transition>
      <div class="col-sm-12">
        <div
          class="
            py-2
            d-flex
            flex-column
            align-items-center
            justify-content-center
          "
        >
          <h1>Intentions</h1>
          <div class="py-3" v-if="intentions.length < 1">
            <p class="alert alert-info p-2">No intentions found.</p>
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
                v-for="intention in intentions"
                :key="intention.id"
                class="d-flex justify-content-between align-items-start mb-3"
              >
                <p class="m-0">
                  I will
                  <router-link :to="`/habits/${intention.habit.id}`">{{
                    intention.habit.title
                  }}</router-link>
                  at
                  <span
                    :title="getFormattedDate(intention.time, true)"
                    class="text-primary"
                    >{{ getFormattedDate(intention.time) }}</span
                  >
                  in
                  <span class="text-primary">{{ intention.location }}</span
                  >.
                </p>
                <div
                  class="
                    text-nowrap
                    px-2
                    py-1
                    ms-2
                    d-flex
                    align-items-center
                    justify-content-center
                  "
                >
                  <input
                    v-if="completing != intention.id"
                    type="checkbox"
                    class="form-check-input m-0 intention-done-checkbox"
                    @click.prevent="completeIntention(intention)"
                    :disabled="isDisabled"
                    title="Toggle intention status"
                    :checked="intention.done"
                  />
                  <span
                    v-else
                    class="spinner-border spinner-border-sm text-primary"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <button
                    class="
                      btn btn--intention-edit
                      d-inline-flex
                      align-items-center
                      p-0
                      ms-2
                    "
                    @click.prevent="onEdit(intention)"
                    :disabled="isDisabled"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>
                  <button
                    class="
                      btn btn--intention-delete
                      d-inline-flex
                      align-items-center
                      p-0
                      ms-2
                    "
                    @click.prevent="onDelete(intention.id)"
                    :disabled="isDisabled"
                  >
                    <template v-if="deleting == intention.id">
                      <span
                        class="spinner-border spinner-border-sm"
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
                        class="bi bi-trash"
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
            </div>
            <div class="table-responsive py-3" v-else>
              <table class="table text-center table-bordered">
                <thead class="">
                  <tr>
                    <th scope="col">Habit</th>
                    <th scope="col">Date Time</th>
                    <th scope="col">Location</th>
                    <th scope="col">Operations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="intention in intentions" :key="intention.id">
                    <td style="min-width: 200px">
                      <router-link :to="`/habits/${intention.habit.id}`">{{
                        intention.habit.title
                      }}</router-link>
                    </td>
                    <td :title="getFormattedDate(intention.time, true)">
                      {{ getFormattedDate(intention.time) }}
                    </td>
                    <td style="min-width: 300px">
                      {{ intention.location }}
                    </td>
                    <td class="text-nowrap">
                      <div
                        class="
                          text-nowrap
                          px-2
                          d-flex
                          align-items-center
                          justify-content-center
                        "
                      >
                        <input
                          v-if="completing != intention.id"
                          type="checkbox"
                          class="form-check-input m-0 intention-done-checkbox"
                          @click.prevent="completeIntention(intention)"
                          :disabled="isDisabled"
                          :checked="intention.done"
                          title="Toggle intention status"
                        />
                        <span
                          v-else
                          class="spinner-border spinner-border-sm text-primary"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <button
                          class="
                            btn btn--intention-edit
                            d-inline-flex
                            align-items-center
                            px-0
                            ms-2
                          "
                          @click.prevent="onEdit(intention)"
                          :disabled="isDisabled"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                            />
                            <path
                              fill-rule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                            />
                          </svg>
                        </button>
                        <button
                          class="
                            btn btn--intention-delete
                            d-inline-flex
                            align-items-center
                            px-0
                            ms-2
                          "
                          @click.prevent="onDelete(intention.id)"
                          :disabled="isDisabled"
                        >
                          <template v-if="deleting == intention.id">
                            <span
                              class="spinner-border spinner-border-sm"
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
                              class="bi bi-trash"
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <div class="my-2 align-self-start">
            <button
              class="
                btn btn-link
                text-decoration-none
                d-flex
                justify-content-center
                align-items-center
              "
              @click.prevent="toggleCompletedIntentions"
            >
              Show completed
              <svg
                v-if="completedIntentionsVisible"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-caret-down-fill ms-1"
                viewBox="0 0 16 16"
              >
                <path
                  d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-caret-right-fill ms-1"
                viewBox="0 0 16 16"
              >
                <path
                  d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"
                />
              </svg>
            </button>
          </div>
          <transition name="slide-in">
            <template v-if="completedIntentionsVisible">
              <div class="py-3" v-if="completedIntentions.length < 1">
                <p class="alert alert-info p-2">
                  No completed intentions found.
                </p>
              </div>
              <div class="py-3" v-else>
                <div
                  v-for="intention in completedIntentions"
                  :key="intention.id"
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <p class="m-0 text-decoration-line-through">
                    I will
                    <router-link :to="`/habits/${intention.habit.id}`">{{
                      intention.habit.title
                    }}</router-link>
                    at
                    <span
                      :title="getFormattedDate(intention.time, true)"
                      class="text-primary"
                      >{{ getFormattedDate(intention.time) }}</span
                    >
                    in
                    <span class="text-primary">{{ intention.location }}</span
                    >.
                  </p>
                  <div
                    class="
                      text-nowrap
                      px-2
                      d-flex
                      align-items-center
                      justify-content-center
                    "
                  >
                    <input
                      type="checkbox"
                      class="form-check-input m-0 intention-done-checkbox"
                      @click.prevent
                      :disabled="true"
                      :checked="true"
                    />
                    <button
                      class="
                        btn btn--intention-delete
                        d-inline-flex
                        align-items-center
                        px-0
                        ms-2
                      "
                      @click.prevent="onDelete(intention.id, true)"
                      :disabled="isDisabled"
                    >
                      <template v-if="deleting == intention.id">
                        <span
                          class="spinner-border spinner-border-sm"
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
                          class="bi bi-trash"
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
              </div>
            </template>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Yayy from '@/components/Yayy.vue';
import Toggle from '@/components/Toggle.vue';
import VueMultiselect from 'vue-multiselect';
import SubmitButton from '@/components/SubmitButton.vue';
import Errors from '@/components/Errors.vue';
import { ref, computed } from 'vue';
import store from '@/store';
import { DatePicker } from 'v-calendar';
import { DateTime } from 'luxon';
export default {
  components: {
    Yayy,
    Toggle,
    VueMultiselect,
    SubmitButton,
    DatePicker,
    Errors,
  },
  setup() {
    const formInitialState = {
      habit: null,
      time: null,
      location: null,
    };
    const form = ref({ ...formInitialState });

    const formVisible = ref(false);
    const formSubmitting = ref(false);
    const formInvalid = computed(
      () => !form.value.habit || !form.value.time || !form.value.location
    );
    const formError = ref(null);

    const tableView = ref(false);
    const toggleForm = () => {
      form.value = { ...formInitialState };
      editing.value = false;
      formError.value = null;
      formVisible.value = !formVisible.value;
    };

    const onFormSubmit = async () => {
      formError.value = null;
      formSubmitting.value = true;
      // Make a non-reactive duplicate of form object
      const formData = { ...form.value };
      formData.habit = formData.habit.id;
      try {
        if (formData.id) {
          await store.dispatch('intentions/update', {
            formData: formData,
            pk: formData.id,
          });
        } else {
          await store.dispatch('intentions/create', { formData });
        }
      } catch (e) {
        formError.value = e;
      } finally {
        formSubmitting.value = false;
        if (!formError.value) {
          toggleForm();
        }
      }
    };

    const deleting = ref(null);
    const completing = ref(null);
    const editing = ref(false);
    const yayy = ref(false);
    const onDelete = async (pk, completed = false) => {
      deleting.value = pk;

      try {
        if (completed) {
          await store.dispatch('intentions/deleteCompleted', { pk });
        } else {
          await store.dispatch('intentions/delete', { pk });
        }
      } finally {
        deleting.value = null;
      }
    };

    const onEdit = (intention) => {
      const model = { ...intention };
      editing.value = model.id;
      model.time = new Date(model.time);
      form.value = model;
      formVisible.value = true;
    };

    const completeIntention = async (intention) => {
      const formData = { ...intention };
      completing.value = formData.id;
      formData.habit = formData.habit.id;
      formData.done = true;
      let error;
      try {
        await store.dispatch('intentions/update', {
          formData: formData,
          pk: formData.id,
        });
      } catch (e) {
        error = e;
      } finally {
        completing.value = null;
        if (!error) {
          yayy.value = true;
          setTimeout(() => {
            yayy.value = false;
          }, 1000);
        }
      }
    };

    const completedIntentionsVisible = ref(false);
    const toggleCompletedIntentions = async () => {
      if (!store.state.intentions.completedRefreshed) {
        await store.dispatch('intentions/refreshCompleted');
      }
      completedIntentionsVisible.value = !completedIntentionsVisible.value;
    };

    const getFormattedDate = (ISOString, long = false) => {
      if (long) {
        return DateTime.fromISO(ISOString).toLocaleString(
          DateTime.DATETIME_FULL
        );
      } else {
        return DateTime.fromISO(ISOString).toLocaleString(
          DateTime.DATETIME_MED_WITH_WEEKDAY
        );
      }
    };

    const goodHabits = computed(() => store.getters['habits/good']);
    const intentions = computed(() => store.state.intentions.models);
    const completedIntentions = computed(
      () => store.state.intentions.completedModels
    );

    const isDisabled = computed(
      () =>
        editing.value || deleting.value || completing.value || formVisible.value
    );
    return {
      form,
      formVisible,
      formSubmitting,
      formInvalid,
      formError,
      tableView,
      onDelete,
      onEdit,
      editing,
      deleting,
      yayy,
      completing,
      toggleForm,
      onFormSubmit,
      completeIntention,
      completedIntentionsVisible,
      toggleCompletedIntentions,
      goodHabits,
      intentions,
      completedIntentions,
      getFormattedDate,
      isDisabled,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~vue-multiselect/dist/vue-multiselect.css';
.btn--intention-delete {
  color: $gray-400;
  &:hover,
  &:focus {
    color: $color-red;
  }
  span.spinner-border {
    color: $color-red;
  }
}
.btn--intention-edit {
  color: $gray-400;
  &:hover,
  &:focus {
    color: $color-green;
  }
  span.spinner-border {
    color: $color-green;
  }
}

.intention-done-checkbox {
  border-color: $gray-400;
  margin: 0;
  cursor: pointer;
}
</style>
