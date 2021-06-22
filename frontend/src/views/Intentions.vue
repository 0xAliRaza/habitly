<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-12">
        <div class="d-flex align-items-center justify-content-end mb-4">
          <toggle color="dark" @toggle="onFormToggle" :visibility="formVisible">
            Create intention
          </toggle>
        </div>
      </div>
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
            <p class="alert-info p-1">
              You haven't created any intentions yet.
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
                v-for="intention in intentions"
                :key="intention.id"
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <p class="m-0">
                  I will <a href="#">{{ intention.habit.title }}</a> at
                  <span
                    :title="getFormattedDate(intention.time, true)"
                    class="text-primary"
                    >{{ getFormattedDate(intention.time) }}</span
                  >
                  in
                  <span class="text-primary">{{ intention.location }}</span
                  >.
                </p>
                <div class="text-nowrap px-2">
                  <button
                    class="
                      btn btn--intention-edit
                      d-inline-flex
                      align-items-center
                      px-0
                      ms-2
                    "
                    @click.prevent="onEdit(intention)"
                    :disabled="editing"
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
                    :disabled="deleting || editing"
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
                      <a href="#" class="text-decoration-none">{{
                        intention.habit.title
                      }}</a>
                    </td>
                    <td :title="getFormattedDate(intention.time, true)">
                      {{ getFormattedDate(intention.time) }}
                    </td>
                    <td style="min-width: 300px">
                      {{ intention.location }}
                    </td>
                    <td class="text-nowrap">
                      <button
                        class="
                          btn btn--intention-edit
                          d-inline-flex
                          align-items-center
                        "
                        @click.prevent="onEdit(intention)"
                        :disabled="editing || deleting"
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
                        "
                        @click.prevent="onDelete(intention.id)"
                        :disabled="deleting || editing"
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
import Toggle from '@/components/Toggle.vue';
import VueMultiselect from 'vue-multiselect';
import SubmitButton from '@/components/SubmitButton.vue';
import { reactive, ref, computed } from 'vue';
import store from '@/store';
import { DatePicker } from 'v-calendar';
import { DateTime } from 'luxon';
export default {
  components: {
    Toggle,
    VueMultiselect,
    SubmitButton,
    DatePicker,
  },
  setup() {
    const formInitialState = {
      habit: null,
      time: null,
      location: null,
    };
    const form = reactive({ ...formInitialState });

    const formVisible = ref(false);
    const formSubmitting = ref(false);
    const formInvalid = computed(
      () => !form.habit || !form.time || !form.location
    );

    const tableView = ref(false);
    const onFormToggle = () => {
      Object.assign(form, formInitialState);
      formVisible.value = !formVisible.value;
      editing.value = false;
    };

    const onFormSubmit = async () => {
      formSubmitting.value = true;
      const formData = form;
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
        console.log('%cIntentions.vue line:112 e', 'color: #007acc;', e);
      } finally {
        onFormToggle();
        formSubmitting.value = false;
      }
    };

    const deleting = ref(null);
    const editing = ref(false);

    const onDelete = async (pk) => {
      deleting.value = pk;

      try {
        await store.dispatch('intentions/delete', { pk });
      } catch (e) {
        console.log('%cIntentions.vue line:245 e', 'color: #007acc;', e);
      } finally {
        deleting.value = null;
      }
    };

    const onEdit = (intention) => {
      editing.value = intention.id;
      intention.time = new Date(intention.time);
      Object.assign(form, intention);
      formVisible.value = true;
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
    return {
      form,
      formVisible,
      formSubmitting,
      formInvalid,
      tableView,
      onDelete,
      onEdit,
      editing,
      deleting,
      onFormToggle,
      onFormSubmit,
      goodHabits,
      intentions,
      getFormattedDate,
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
</style>
