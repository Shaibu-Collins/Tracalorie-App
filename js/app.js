class CalorieTracker{
    constructor() {
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    // Public Methods/API //
    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewMeal(meal);
        this._render()

    }

    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewWorkout(workout);
        this._render()
    }

    
    removeMeal(id) {
      const index = this._meals.findIndex((meal) => meal.id === id);

      if(index !== -1) {
          const meal = this._meals[index];
          this._totalCalories -= meal.calories;
          this._meals.splice(index, 1);
          this._render();
      }
   }

   removeWorkout(id) {
      const index = this._meals.findIndex((workout) => workout.id === id);

      if (index !== -1) {
          const workout = this._workouts[index];
          this._totalCalories += workout.calories;
          this._workouts.splice(index, 1);
          this._render();
      }
   }


    // Private Methods //

    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const calorieLImitEl = document.getElementById('calories-limit');
        calorieLImitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);

        caloriesConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress')
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining;

        if (remaining <= 0){
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');

            progressEl.classList.remove('bg-sucess');
            progressEl.classList.add('bg-danger');
        }else{
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');

            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
         }
    }

    _displayCaloriesProgress(){
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`

    }

    _displayNewMeal(meal){
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
         <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meal.name}</h4>
      <div
        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${meal.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
     `;

     mealsEl.appendChild(mealEl)

    }

    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
        `;
    
        workoutsEl.appendChild(workoutEl);
    }
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

class Meal{
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
     }
}

class Workout{
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
     }
}



class App {
    constructor() {
        this._tracker = new CalorieTracker();
    

document.getElementById('meal-form').addEventListener('submit', this._newWItem.bind(this, 'meal'));

document.getElementById('workout-form').addEventListener('submit', this._newWItem.bind(this, 'workout'));

document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));
    }

    _newWItem(type, e){
       e.preventDefault();
        
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validate inputs
        if (name.value ==='' || calories.value === ''){
            alert('Please fill in all fields');
            return;
        };
        if (type === 'meal') {
            // to convert the value as an int
            const meal = new Meal(name.value, +calories.value);

            this._tracker.addMeal(meal);
         }else{
            const workout = new Workout(name.value, +calories.value);

            this._tracker.addWorkout(workout);
         }

       
        name.value = '';
        calories.value = '';
        
        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle:true
        });
    }
      

    _removeItem(type, e) {
        if (
          e.target.classList.contains('delete') ||
          e.target.classList.contains('fa-xmark')
        ) {
          if (confirm('Are you sure?')) {
            const id = e.target.closest('.card').getAttribute('data-id');
    
            type === 'meal'
              ? this._tracker.removeMeal(id)
              : this._tracker.removeWorkout(id);
    
            e.target.closest('.card').remove();
          }
        }
      }
}



const app = new App();