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

    <div
      v-show="habitFormVisible"
      class="row justify-content-center habit-form"
    >
      <div class="col-lg-6 mb-5">
        <habit-form
          title="test"
          type="bad"
          description="tatti is good"
          @onSubmit="habitFormSubmitted"
        ></habit-form>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6 mb-4 mb-lg-0">
        <div class="text-center mb-3">
          <h3 class="text-success">Good habits</h3>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="text-center mb-3">
          <h3 class="text-danger">Bad habits</h3>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
        <div class="habit-wrapper mb-2">
          <habit></habit>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script>
import Habit from '@/components/Habit.vue';
import HabitForm from '@/components/HabitForm.vue';
import { ref } from 'vue';
export default {
  name: 'Habits',
  components: { Habit, HabitForm },
  setup() {
    const habitFormVisible = ref(false);
    const habitFormSubmitted = (e) => {
      console.log('submited:>>>>>>>', e.value);
    };
    return { habitFormVisible, habitFormSubmitted };
  },
};
</script>
