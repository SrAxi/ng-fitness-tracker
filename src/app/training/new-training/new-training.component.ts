import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  isLoading = true;
  private exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.isLoading = false;
      this.exercises = exercises;
    });
    this.fetchExercises();
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }

  onStartTraining(exerciseForm: NgForm) {
    this.trainingService.startExercise(exerciseForm.value.exercise);
  }

  fetchExercises() {
    this.isLoading = true;
    this.trainingService.fetchAvailableExercises();
  }
}
