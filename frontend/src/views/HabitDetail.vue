<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-12">
        <div class="d-flex align-items-center justify-content-end mb-4">
          <toggle
            small
            color="success"
            @toggle="habitForm.visible = !habitForm.visible"
            :visibility="habitForm.visible"
          >
            Edit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil-square ms-1"
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
          </toggle>
          <submit-button
            v-if="!habitForm.visible"
            class="ms-2"
            :loading="deleting"
            @submit="deleteHabit"
            small
            color="danger"
          >
            Delete
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
          </submit-button>
        </div>
      </div>
      <transition name="slide-in">
        <div v-if="habitForm.visible" class="col-lg-6 mb-5">
          <habit-form
            @onSubmit="updateHabit"
            :loading="habitForm.loading"
            :habit="habitForm.habit"
          ></habit-form>
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
          <p class="alert alert-info my-3 p-2" v-if="!habitForm.habit">
            Habit does not exist.
          </p>
          <template v-else>
            <h1>Habit Details</h1>
            <div class="py-3">
              <div class="table-responsive">
                <table class="table">
                  <tbody>
                    <tr>
                      <th scope="row">Title:</th>
                      <td>
                        {{ habitForm.habit.title }}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Type:</th>
                      <td>
                        <span
                          v-if="habitForm.habit.type == 'G'"
                          class="badge bg-success"
                          >Good</span
                        >
                        <span v-else class="badge bg-danger">Bad</span>
                      </td>
                    </tr>
                    <tr v-if="habitForm.habit.ritual">
                      <th scope="row">Ritual:</th>
                      <td>{{ habitForm.habit.ritual }}</td>
                    </tr>
                    <tr v-if="habitForm.habit.description">
                      <th scope="row">Description:</th>
                      <td>{{ habitForm.habit.description }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Repetitions:</th>
                      <td>{{ habitForm.habit.repetitions }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Streak:</th>
                      <td>{{ habitForm.habit.streak }} days</td>
                    </tr>
                    <tr>
                      <th scope="row">Created at:</th>
                      <td
                        :title="
                          getFormattedDate(habitForm.habit.created_at, true)
                        "
                      >
                        {{ getFormattedDate(habitForm.habit.created_at) }}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Updated at:</th>
                      <td
                        :title="
                          getFormattedDate(habitForm.habit.updated_at, true)
                        "
                      >
                        {{ getFormattedDate(habitForm.habit.updated_at) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div
        class="
          d-flex
          justify-content-end
          align-items-center
          mb-4
          mx-md-5
          px-md-5
        "
      >
        <toggle
          class=""
          color="dark"
          small
          @toggle="toggleRepForm"
          :visibility="repetitionForm.visible"
        >
          Add repetition
        </toggle>
      </div>
      <transition name="slide-in">
        <div class="col-sm-12 mb-5" v-if="repetitionForm.visible">
          <form @submit.prevent>
            <div class="row align-items-center justify-content-center">
              <div class="col-sm-10 col-md-7 col-xl-4">
                <date-picker
                  v-model="repetitionForm.date"
                  color="blue"
                  mode="date"
                  :max-date="new Date()"
                  :attributes="[{ dates: new Date(), highlight: true }]"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <input
                      class="form-control"
                      :value="inputValue"
                      v-on="inputEvents"
                      placeholder="Select a date when you repeated this habit..."
                    />
                  </template>
                </date-picker>
              </div>
              <div
                class="
                  col-sm-2
                  d-flex
                  justify-content-sm-center justify-content-end
                  mt-2 mt-sm-0
                "
              >
                <submit-button
                  :loading="repetitionForm.loading"
                  color="primary"
                  :disabled="!repetitionForm.date || !habitForm.habit"
                  @submit="createRepetition"
                ></submit-button>
              </div>
            </div>
          </form>
        </div>
      </transition>
      <div class="col-md-8 col-lg-6 col-xl-5 py-2" v-if="habitForm.habit">
        <h3 class="text-center mb-3">Repetitions</h3>

        <calendar
          ref="calendarEl"
          class="calendar"
          is-expanded
          :max-date="new Date()"
          :attributes="calendar.attributes"
          @update:from-page="refreshCalendarAttrs"
          @dayclick="deleteRepetition"
        >
        </calendar>
        <p class="calendar__loading">
          <template v-if="calendar.loading">
            {{ calendar.loading }}
            <span
              class="spinner-border spinner-border-sm ms-1"
              role="status"
              aria-hidden="true"
            ></span>
          </template>
          <template v-else>
            Note: Click a date to delete its repetition.
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Toggle from '@/components/Toggle.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import HabitForm from '@/components/HabitForm.vue';
import { reactive, ref, computed, watch, watchEffect } from 'vue';
import { DatePicker, Calendar } from 'v-calendar';
import { DateTime } from 'luxon';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import repetitions from '@/api/repetitions';
export default {
  components: {
    Toggle,
    SubmitButton,
    DatePicker,
    Calendar,
    HabitForm,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    let pk = computed(() => route.params.id);
    const habitForm = reactive({ habit: null, visible: false, loading: false });
    watchEffect(() => {
      if (pk.value) {
        habitForm.habit = store.getters['habits/get'](pk.value);
      }
    });
    const updateHabit = async (formData) => {
      if (!habitForm.habit) {
        return;
      }
      const today = DateTime.now();
      habitForm.loading = true;
      try {
        await store.dispatch('habits/update', {
          pk: habitForm.habit.id,
          formData: formData,
        });
      } finally {
        await refreshCalendarAttrs({ year: today.year, month: today.month });
        habitForm.loading = false;
        habitForm.visible = false;
      }
    };

    const deleting = ref(false);
    const deleteHabit = async () => {
      deleting.value = true;
      await store.dispatch('habits/delete', { pk: habitForm.habit.id });
      router.push({ name: 'Habits' });
    };

    const repetitionForm = reactive({
      date: null,
      visible: false,
      loading: false,
    });

    const toggleRepForm = () => {
      repetitionForm.date = null;
      repetitionForm.visible = !repetitionForm.visible;
    };

    const createRepetition = async () => {
      // If Form is empty, return
      if (!repetitionForm.date || !habitForm.habit) {
        return;
      }
      const date = DateTime.fromJSDate(repetitionForm.date);
      repetitionForm.loading = true;
      try {
        await store.dispatch('habits/createRepetition', {
          habit: habitForm.habit.id,
          repetition: {
            date: date.toISODate(),
            habit: habitForm.habit.id,
          },
        });
      } finally {
        await calendarEl.value.move({
          year: date.year,
          month: date.month,
        });
        refreshCalendarAttrs({
          year: date.year,
          month: date.month,
        });
        repetitionForm.loading = false;
        toggleRepForm();
      }
    };
    const calendarEl = ref(null);
    const calendar = reactive({
      loading: false,
      attributes: [],
    });
    const deleteRepetition = async (day) => {
      if (
        !day.attributesMap.day ||
        !day.attributesMap.day.customData.repetition
      ) {
        return;
      }
      calendar.loading = 'Deleting';
      try {
        await store.dispatch('habits/deleteRepetition', {
          habit: habitForm.habit.id,
          pk: day.attributesMap.day.customData.repetition,
        });
        refreshCalendarAttrs({ year: day.year, month: day.month });
      } finally {
        calendar.loading = null;
      }
    };

    let timeout;
    const refreshCalendarAttrs = async (page) => {
      clearTimeout(timeout);
      calendar.loading = 'Updating';
      timeout = setTimeout(async () => {
        try {
          if (!habitForm.habit) {
            return;
          }
          const res = (
            await repetitions.index({
              year: page.year,
              month: page.month,
              habit: habitForm.habit.id,
            })
          ).data;

          calendar.attributes = res.map((rep) => {
            const attr = {};
            attr.key = 'day';
            attr.dates = [rep.date];
            attr.highlight = {
              color: habitForm.habit.type == 'G' ? 'green' : 'red',
              fillMode: 'solid',
            };
            attr.customData = { repetition: rep.id };
            return attr;
          });
        } finally {
          calendar.loading = null;
        }
      }, 1000);
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

    return {
      habitForm,
      updateHabit,
      deleting,
      deleteHabit,
      repetitionForm,
      toggleRepForm,
      createRepetition,
      deleteRepetition,
      calendarEl,
      calendar,
      refreshCalendarAttrs,
      getFormattedDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.calendar__loading {
  font-weight: 400;
  font-size: pxToRem(16);
  color: $gray-600;
  text-align: center;
  margin: pxToRem(5) 0;
}
</style>
