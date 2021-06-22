<template>
  <div class="container">
    <div class="row justify-content-center">
      <!-- <div class="col-sm-12">
        <div class="d-flex align-items-center justify-content-end mb-4">
          <toggle
            color="dark"
            btn-text="Create intention"
            @toggle="onFormToggle"
            :visibility="formVisible"
          ></toggle>
        </div>
      </div> -->
      <div v-if="formVisible" class="col-lg-6 mb-5">
        <form @submit.prevent>
          <div class="mb-3">
            <label for="habit" class="form-label">Habit</label>
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
      <div class="col-md-8 col-lg-6 col-xl-5 py-2" v-if="habit">
        <h3 class="text-center mb-2">Repetitions</h3>
        <calendar
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
    let pk = computed(() => {
      const id = route.params.id;
      console.log('pk watch>>>', id);
      return id;
    });
    const habit = ref(null);
    watchEffect(() => {
      if (pk.value) {
        habit.value = store.getters['habits/get'](pk.value);
        console.log('habitt computed>>>>', habit.value);
      }
    });
    const formInitialState = {
      habit: habit.value,
      date: null,
    };
    const form = reactive({ ...formInitialState });
    const formVisible = ref(false);
    const formSubmitting = ref(false);
    const formInvalid = computed(() => !form.date);

    const onFormToggle = () => {
      Object.assign(form, formInitialState);
      formVisible.value = !formVisible.value;
    };

    const onFormSubmit = async () => {
      formSubmitting.value = true;

      try {
        setTimeout(() => {
          return;
        }, 3000);
      } catch (e) {
        console.log('%cIntentions.vue line:112 e', 'color: #007acc;', e);
      } finally {
        onFormToggle();
        formSubmitting.value = false;
      }
    };

    const calendarLoading = ref(null);

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
            attr.highlight = { color: 'green', fillMode: 'solid' };
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
      form,
      formVisible,
      formSubmitting,
      formInvalid,
      onDelete,
      calendarLoading,
      onFormToggle,
      onFormSubmit,
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
