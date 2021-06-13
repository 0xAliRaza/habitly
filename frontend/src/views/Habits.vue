<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 mb-4">
        <div class="d-flex justify-content-end">
          <button
            v-if="!habitFormVisible"
            class="btn btn-dark"
            @click="habitFormVisible = true"
          >
            Create habit
          </button>
          <button
            v-else
            class="btn-close"
            @click="habitFormVisible = false"
          ></button>
        </div>
      </div>
    </div>

    <div v-if="habitFormVisible" class="row justify-content-center habit-form">
      <div class="col-lg-6 mb-5">
        <habit-form
          :habit="beingEditedHabit"
          @onSubmit="onHabitFormSubmit"
          :loading="habitFormLoading"
        ></habit-form>
      </div>
    </div>
    <div class="row">
      <template v-if="habits.length < 1">
        <div class="col-sm-12">
          <div
            class="alert alert-info alert-dismissible fade show"
            role="alert"
          >
            You haven't added any habits yet. Please add some to see them here.
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="text-center mb-3">
            <h3 class="text-success">Good habits</h3>
          </div>
          <div
            v-for="habit in goodHabits"
            :key="habit.id"
            class="habit-wrapper mb-2"
          >
            <habit :habit="habit" @onEdit="onHabitEdit"></habit>
          </div>
        </div>
        <!-- <div class="col-lg-6">
          <div class="text-center mb-3">
            <h3 class="text-danger">Bad habits</h3>
          </div>
          <div
            v-for="habit in badHabits"
            :key="habit.id"
            class="habit-wrapper mb-2"
          >
            <habit :habit="habit"></habit>
          </div>
        </div> -->
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script>
import Habit from '@/components/Habit.vue';
import HabitForm from '@/components/HabitForm.vue';
import { ref, provide, watchEffect, inject, computed } from 'vue';
import { useStore, mapState, mapGetters } from 'vuex';
import 'bootstrap/js/dist/alert';

export default {
  name: 'Habits',
  components: { Habit, HabitForm },
  setup() {
    const store = useStore();
    const habitFormVisible = ref(false);
    const habitFormLoading = ref(false);
    const beingEditedHabit = ref({});
    const onHabitFormSubmit = async (formData) => {
      habitFormLoading.value = true;
      try {
        const res = await store.dispatch('createHabit', formData);
        console.log(
          '%cHabits.vue line:91 data',
          'color: white; background-color: #26bfa5;',
          res
        );
      } catch (error) {
        console.log(
          '%cerror Habits.vue line:94 ',
          'color: red; display: block; width: 100%;',
          error
        );
      } finally {
        habitFormLoading.value = false;
        habitFormVisible.value = false;
      }
    };
    const onHabitEdit = (habit) => {
      beingEditedHabit.value = habit;
      habitFormVisible.value = true;
    };

    return {
      habitFormVisible,
      habitFormLoading,
      beingEditedHabit,
      onHabitFormSubmit,
      onHabitEdit,
      goodHabits: computed(() => store.getters.goodHabits),
      badHabits: computed(() => store.getters.badHabits),
      habits: computed(() => store.state.habits),
    };
  },
};
</script>
