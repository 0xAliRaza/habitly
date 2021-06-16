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
          <button v-else class="btn-close" @click="onHideHabitForm"></button>
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
      <template v-if="habits.length < 1 && !habitFormVisible">
        <div class="col-sm-12">
          <p class="alert-info fade show d-inline-flex fade show" role="alert">
            You haven't added any habits yet. Please add some to see them
            here...
          </p>
        </div>
      </template>
      <template v-else-if="habits.length > 0">
        <div class="col-lg-6 mb-4 mb-lg-0">
          <div class="text-center mb-3">
            <h5 class="text-success">GOOD</h5>
          </div>
          <div
            v-for="habit in goodHabits"
            :key="habit.id"
            class="habit-wrapper mb-2"
          >
            <habit
              :habit="habit"
              @edit="onHabitEdit"
              @delete="onHabitDelete"
            ></habit>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="text-center mb-3">
            <h5 class="text-danger">BAD</h5>
          </div>
          <div
            v-for="habit in badHabits"
            :key="habit.id"
            class="habit-wrapper mb-2"
          >
            <habit
              :habit="habit"
              @edit="onHabitEdit"
              @delete="onHabitDelete"
            ></habit>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script>
import Habit from '@/components/Habit.vue';
import HabitForm from '@/components/HabitForm.vue';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
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
        let res;
        if (beingEditedHabit.value.id) {
          res = await store.dispatch('habits/update', {
            formData: formData,
            pk: beingEditedHabit.value.id,
          });
        } else {
          res = await store.dispatch('habits/create', {
            formData: formData,
          });
        }
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
        beingEditedHabit.value = {};
      }
    };
    const onHabitEdit = (habit) => {
      beingEditedHabit.value = habit;
      habitFormVisible.value = true;
    };
    const onHabitDelete = async (habitId) => {
      await store.dispatch('habits/delete', { pk: habitId });
    };
    const onHideHabitForm = () => {
      beingEditedHabit.value = {};
      habitFormVisible.value = false;
    };

    return {
      habitFormVisible,
      habitFormLoading,
      beingEditedHabit,
      onHabitFormSubmit,
      onHabitEdit,
      onHabitDelete,
      onHideHabitForm,
      goodHabits: computed(() => store.getters['habits/good']),
      badHabits: computed(() => store.getters['habits/bad']),
      habits: computed(() => {
        console.log('habits>', store.state.habits.models);
        return store.state.habits.models;
      }),
    };
  },
};
</script>
