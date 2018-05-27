import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  isLoading$: Observable<boolean>;
  private exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService, private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.store.dispatch(new UI.StopLoading());
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
    this.store.dispatch(new UI.StartLoading());
    this.trainingService.fetchAvailableExercises();
  }
}
