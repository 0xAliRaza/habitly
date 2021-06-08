<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6">
        <Habit :id="1" title="first habit"></Habit>
        <Habit :id="2" title="second habit"></Habit>
        <Habit :id="3" title="third habit"></Habit>
      </div>
      <div class="col-sm-6">
        <Habit></Habit>
        <Habit></Habit>
        <Habit></Habit>
        <Habit></Habit>
        <Habit></Habit>
        <Habit></Habit>
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
