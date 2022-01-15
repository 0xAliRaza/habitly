<template>
  <transition name="fade">
    <yayy v-show="yayy"></yayy>
  </transition>
  <div class="container">
    <div class="row justify-content-center">
      <!-- SHOW TODAY'S INTENTIONS -->
      <div class="col-12 col-lg-8 my-3">
        <div
          class="
            d-flex
            flex-column
            align-items-center
            justify-content-center
            p-3
          "
        >
          <div class="d-flex align-items-center justify-content-center mb-2">
            <h2 class="m-0">Intentions for Today</h2>
            <info-tooltip
              title="Intentions that you have planned for today."
              placement="right"
            ></info-tooltip>
          </div>
          <transition name="slide-in">
            <div class="py-4" v-if="todaysIntentions.length < 1">
              <p class="alert alert-info p-2">No intentions for today.</p>
            </div>
            <div class="py-4" v-else>
              <div
                v-for="intention in todaysIntentions"
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
                    type="checkbox"
                    class="
                      form-check-input
                      m-0
                      intention-done-checkbox intention-done-checkbox
                    "
                    @click.prevent="completeIntention(intention)"
                    :checked="intention.done"
                    :disabled="completing"
                    v-if="completing !== intention.id"
                  />
                  <span
                    v-else
                    class="spinner-border spinner-border-sm text-primary"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <!--/ SHOW TODAY'S INTENTIONS -->

      <aside v-if="topRepeated.length > 0 || topStreaked.length > 0" class="my-3 py-3 col-12 col-lg-4">
        <div
          class="d-flex flex-column justify-content-center"
        >
          <!-- TOP FIVE REPEATED HABITS -->
          <transition name="fade">
            <ul class="list-group" v-if="topRepeated.length > 0">
              <div
                class="
                  d-flex
                  align-items-center
                  justify-content-center
                  list-group-item
                  bg-light
                  sidebar-card-header
                "
              >
                <h5 class="text-dark m-0">Top Repeated Habits</h5>
                <info-tooltip
                  title="Habits that have the most repetitions."
                  placement="bottom"
                ></info-tooltip>
              </div>
              <template v-for="(habit, index) in topRepeated" :key="habit.id">
                <router-link
                  v-if="habit.repetitions > 0"
                  :to="`/habits/${habit.id}`"
                  custom
                  v-slot="{ navigate }"
                >
                  <li
                    class="
                      list-group-item list-group-item-action
                      d-flex
                      justify-content-between
                      align-items-start
                      sidebar-list-item
                    "
                    style="cursor: pointer"
                    role="link"
                    @click="navigate"
                  >
                    <div class="me-auto">{{ habit.title }}</div>
                    <span
                      class="badge rounded-pill ms-2"
                      :class="{
                        'bg-success': habit.type == 'G',
                        'bg-danger': habit.type == 'B',
                      }"
                      >{{ habit.repetitions }}</span
                    >
                  </li>
                </router-link>
                <li
                  v-else-if="index == 0"
                  class="list-group-item sidebar-list-item"
                  @click.prevent
                >
                  <p class="m-0 alert alert-info p-2">No streaks found.</p>
                </li>
              </template>
            </ul>
          </transition>
          <!--/ TOP FIVE REPEATED HABITS -->

          <!-- TOP FIVE STREAKED HABITS -->
          <transition name="fade">
            <ul class="list-group mt-3" v-if="topStreaked.length > 0">
              <div
                class="
                  sidebar-card-header
                  d-flex
                  align-items-center
                  justify-content-center
                  list-group-item
                  bg-light
                "
              >
                <h5 class="m-0 text-dark">Top Streaked Habits</h5>
                <info-tooltip
                  title="Habits that have the longeset streak."
                  placement="top"
                ></info-tooltip>
              </div>
              <template v-for="(habit, index) in topStreaked" :key="habit.id">
                <router-link
                  v-if="habit.streak > 0"
                  :to="`/habits/${habit.id}`"
                  custom
                  v-slot="{ navigate }"
                >
                  <li
                    class="
                      list-group-item list-group-item-action
                      d-flex
                      justify-content-between
                      align-items-start
                      sidebar-list-item
                    "
                    style="cursor: pointer"
                    role="link"
                    @click="navigate"
                  >
                    <div class="me-auto">{{ habit.title }}</div>
                    <span
                      class="badge rounded-pill ms-2"
                      :class="{
                        'bg-success': habit.type == 'G',
                        'bg-danger': habit.type == 'B',
                      }"
                      >{{ habit.streak }} days</span
                    >
                  </li>
                </router-link>
                <li
                  v-else-if="index == 0"
                  class="list-group-item sidebar-list-item"
                  @click.prevent
                >
                  <p class="m-0 alert alert-info p-2">No streaks found.</p>
                </li>
              </template>
            </ul>
          </transition>
          <!-- TOP FIVE STREAKED HABITS -->
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watchEffect } from '@vue/runtime-core';
import { DateTime } from 'luxon';
import Yayy from '@/components/Yayy.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';

export default {
  name: 'Home',
  components: {
    Yayy,
    InfoTooltip,
  },
  setup() {
    const store = useStore();
    const topRepeated = computed(() => store.state.habits.topRepeated);
    const topStreaked = computed(() => store.state.habits.topStreaked);

    // Wait for habits to refresh
    watchEffect(() => {
      // Refresh only once
      if (
        store.state.habits.refreshed &&
        !store.state.habits.topRepeatedRefreshed &&
        !store.state.habits.topStreakedRefreshed
      ) {
        store.dispatch('habits/refreshTopRepeated');
        store.dispatch('habits/refreshTopStreaked');
      }
    });

    const todaysIntentions = computed(
      () => store.getters['intentions/getTodays']
    );

    const completing = ref(null);
    const yayy = ref(false);
    const completeIntention = async (intention) => {
      // Don't want any further reactivity bugs so, being careful, derefrence intentions obj 😛
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
      topRepeated,
      topStreaked,
      todaysIntentions,
      completing,
      yayy,
      completeIntention,
      getFormattedDate,
    };
  },
};
</script>
<style lang="scss" scoped>
aside {
  max-width: pxToRem(420);
}
.sidebar-card-header {
  padding: pxToRem(12) !important;
}
.intention-done-checkbox {
  border-color: $gray-400;
  margin: 0;
  cursor: pointer;
}
</style>
