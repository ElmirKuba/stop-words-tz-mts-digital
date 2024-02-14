import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { IStopWord } from './stop-word.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: `app-root`,
  templateUrl: `./app.component.html`,
  styleUrls: [`./app.component.scss`],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptionMessagesUser: Subscription | null = null;
  private userMessages: string[] = [];
  public searchLogin: string = ``;

  stopWords: IStopWord[] = [];

  searchForm = new FormGroup({
    searchInput: new FormControl(``, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
  });

  interactArrayStopWords = new FormGroup({
    newStopWord: new FormControl(``, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
  });

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.stopWords = this.getStopWords();
    this.userMessages = this.getUserMessages();
  }

  ngOnDestroy(): void {
    this.subscriptionMessagesUser?.unsubscribe();
    this.subscriptionMessagesUser = null;
  }

  onSubmit() {
    const userLogin = this.searchForm.value as string;

    this.subscriptionMessagesUser = this.appService
      .getUserMessagesWithUserLogin(userLogin)
      .subscribe({
        next: (messages) => {
          this.setUserMessages(messages);

          this.appService.resetUsedStopWords();

          this.appService.recalculateStopWordStatistics(
            messages,
            this.stopWords
          );

          this.subscriptionMessagesUser?.unsubscribe();
          this.subscriptionMessagesUser = null;

          this.searchLogin = this.searchForm.value.searchInput as string;

          this.searchForm.setValue({ searchInput: `` });
        },
        error: (err: any) => {
          console.log(`error`, err);
          window.alert(err.message);
        },
        complete: () => {},
      });
  }

  getStopWords(): IStopWord[] {
    return this.appService.getStopWords();
  }

  getUserMessages() {
    return this.appService.getUserMessages();
  }

  setUserMessages(messages: string[]) {
    this.userMessages = messages;

    this.appService.setUserMessages(this.userMessages);
  }

  deleteStopWord(stopWord: string) {
    this.appService.deleteStopWord(stopWord);
  }

  addStopWord() {
    const newStopWord = this.interactArrayStopWords.value.newStopWord as string;

    const result: boolean = this.appService.addStopWords(newStopWord);

    if (result) {
      this.appService.resetUsedStopWords();

      this.appService.recalculateStopWordStatistics(
        this.userMessages,
        this.stopWords
      );
    }

    this.interactArrayStopWords.setValue({
      newStopWord: ``,
    });
  }

  restoreSearchInput() {
    this.searchForm.setValue({
      searchInput: this.searchLogin,
    });
  }
}
