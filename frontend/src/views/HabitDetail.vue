<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-12">
        <div class="d-flex align-items-center justify-content-end mb-4">
          <!-- <button
            type="button"
            class="
              btn btn-success btn-sm
              d-inline-flex
              align-items-center
              justify-content-center
            "
            @click="habitFormVisible = !habitFormVisible"
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
          </button> -->
          <toggle
            small
            color="success"
            btn-text="Edit"
            @toggle="habitFormVisible = !habitFormVisible"
            :visibility="habitFormVisible"
          ></toggle>
          <button
            v-if="!habitFormVisible"
            type="button"
            class="
              btn btn-sm btn-danger
              ms-2
              d-inline-flex
              align-items-center
              justify-content-center
            "
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
          </button>
        </div>
      </div>
      <div v-if="habitFormVisible" class="col-lg-6 mb-5">
        <habit-form
          @onSubmit="submitHabit"
          :loading="habitFormLoading"
          :habit="habit"
        ></habit-form>
      </div>

      <div class="col-sm-12" v-if="!habitFormVisible">
        <div
          class="
            py-2
            d-flex
            flex-column
            align-items-center
            justify-content-center
          "
        >
          <p class="alert-info my-3 p-2" v-if="!habit">Habit does not exist.</p>
          <template v-else>
            <h1>Habit Details</h1>
            <div class="py-3">
              <div class="table-responsive">
                <table class="table">
                  <tbody>
                    <tr>
                      <th scope="row">Title:</th>
                      <td>
                        {{ habit.title }}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Type:</th>
                      <td>
                        <span v-if="habit.type == 'G'" class="badge bg-success"
                          >Good</span
                        >
                        <span v-else class="badge bg-danger">Bad</span>
                      </td>
                    </tr>
                    <tr v-if="habit.ritual">
                      <th scope="row">Ritual:</th>
                      <td>{{ habit.ritual }}</td>
                    </tr>
                    <tr v-if="habit.description">
                      <th scope="row">Description:</th>
                      <td>{{ habit.description }}</td>
                    </tr>
                    <tr>
                      <th scope="row">Total repetitions:</th>
                      <td>$$$</td>
                    </tr>
                    <tr>
                      <th scope="row">Created at:</th>
                      <td :title="getFormattedDate(habit.created_at, true)">
                        {{ getFormattedDate(habit.created_at) }}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Updated at:</th>
                      <td :title="getFormattedDate(habit.updated_at, true)">
                        {{ getFormattedDate(habit.updated_at) }}
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
          btn-text="Add repetition"
          @toggle="toggleRepForm"
          :visibility="repFormVisible"
        ></toggle>
      </div>
      <div class="col-sm-12 mb-5" v-if="repFormVisible">
        <form @submit.prevent>
          <div class="row align-items-center justify-content-center">
            <div class="col-sm-10 col-md-7 col-xl-4">
              <date-picker
                v-model="repFormDate"
                color="blue"
                mode="date"
                :max-date="new Date()"
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
                :loading="repFormSubmitting"
                color="primary"
                :disabled="!repFormDate || !habit"
                @submit="submitRepForm"
              ></submit-button>
            </div>
          </div>
        </form>
      </div>
      <div class="col-md-8 col-lg-6 col-xl-5 py-2" v-if="habit">
        <h3 class="text-center mb-3">Repetitions</h3>

        <calendar
          ref="calendar"
          class="calendar"
          is-expanded
          :max-date="new Date()"
          :attributes="calendarAttrs"
          @update:from-page="refreshCalendarAttrs"
          @dayclick="onRepDelete"
        >
        </calendar>
        <p class="calendar__loading">
          <template v-if="calendarLoading">
            {{ calendarLoading }}
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
import { useRoute } from 'vue-router';
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
    const store = useStore();
    let pk = computed(() => route.params.id);
    const habit = ref(null);
    watchEffect(() => {
      if (pk.value) {
        habit.value = store.getters['habits/get'](pk.value);
      }
    });
    const repFormDate = ref(null);
    const repFormVisible = ref(false);
    const repFormSubmitting = ref(false);

    const toggleRepForm = () => {
      repFormDate.value = null;
      repFormVisible.value = !repFormVisible.value;
    };

    const submitRepForm = async () => {
      // If Form is empty, return
      if (!repFormDate.value || !habit.value) {
        return;
      }
      const date = DateTime.fromJSDate(repFormDate.value);
      repFormSubmitting.value = true;
      try {
        await repetitions.create({
          date: date.toISODate(),
          habit: habit.value.id,
        });
      } finally {
        await calendar.value.move({
          year: date.year,
          month: date.month,
        });
        refreshCalendarAttrs({
          year: date.year,
          month: date.month,
        });
        repFormSubmitting.value = false;
        toggleRepForm();
      }
    };

    const calendarLoading = ref(null);
    const calendar = ref(null);
    const onRepDelete = async (day) => {
      if (
        !day.attributesMap.day ||
        !day.attributesMap.day.customData.repetition
      ) {
        return;
      }
      calendarLoading.value = 'Deleting';
      try {
        await repetitions.delete(day.attributesMap.day.customData.repetition);
        refreshCalendarAttrs({ year: day.year, month: day.month });
      } finally {
        calendarLoading.value = null;
      }
    };

    const calendarAttrs = ref([]);

    let timeout;
    const refreshCalendarAttrs = async (page) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        calendarLoading.value = 'Updating';
        try {
          const res = (
            await repetitions.index({
              year: page.year,
              month: page.month,
              habit: habit.value.id,
            })
          ).data;
          calendarAttrs.value = res.map((rep) => {
            const attr = {};
            attr.key = 'day';
            attr.dates = [rep.date];
            attr.highlight = {
              color: habit.value.type == 'G' ? 'green' : 'red',
              fillMode: 'solid',
            };
            attr.customData = { repetition: rep.id };
            return attr;
          });
        } finally {
          calendarLoading.value = null;
        }
      }, 1000);
    };

    const habitFormVisible = ref(false);
    const habitFormLoading = ref(false);
    const submitHabit = async (formData) => {
      if (!habit.value) {
        return;
      }
      const today = DateTime.now();
      habitFormLoading.value = true;
      try {
        await store.dispatch('habits/update', {
          pk: habit.value.id,
          formData: formData,
        });
      } finally {
        await refreshCalendarAttrs({ year: today.year, month: today.month });
        habitFormLoading.value = false;
        habitFormVisible.value = false;
      }
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
      habit,
      repFormDate,
      repFormVisible,
      repFormSubmitting,
      onRepDelete,
      calendarLoading,
      toggleRepForm,
      submitRepForm,
      calendar,
      calendarAttrs,
      refreshCalendarAttrs,
      habitFormVisible,
      habitFormLoading,
      submitHabit,
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
