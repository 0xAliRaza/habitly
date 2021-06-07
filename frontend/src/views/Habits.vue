<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6">
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
      </div>
      <div class="col-sm-6">
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
        <Habit class="mb-5"></Habit>
      </div>
    </div>
  </div>
</template>

<script>
import Habit from '@/components/Habit.vue';
export default {
  name: 'Habits',
  components: { Habit },
};
</script>
