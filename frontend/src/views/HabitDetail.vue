<template>
  <div class="container">
    <div class="row justify-content-center">
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
                    <tr>
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
      <div class="d-flex justify-content-end align-items-center mb-4 mx-md-5 px-md-5">
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
          @dayclick="onDelete"
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
    const onDelete = async (day) => {
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
      onDelete,
      calendarLoading,
      toggleRepForm,
      submitRepForm,
      calendar,
      calendarAttrs,
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
