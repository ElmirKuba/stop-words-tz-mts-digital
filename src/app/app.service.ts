import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStopWord } from './stop-word.interface';

@Injectable({
  providedIn: `root`,
})
export class AppService {
  private stopWords: IStopWord[] = [
    { stopWord: `alcatra`, numberUses: 0 },
    { stopWord: `pork`, numberUses: 0 },
    { stopWord: `ham`, numberUses: 0 },
  ];
  private userMessages: string[] = [];

  constructor(private http: HttpClient) {}

  setStopWords(stopWords: string[]): void {
    this.stopWords = [];

    stopWords.forEach((stopWord) => {
      this.stopWords.push({
        stopWord,
        numberUses: 0,
      });
    });
  }

  addStopWords(addStopWord: string): boolean {
    for (const itemStopWord of this.stopWords) {
      if (addStopWord === itemStopWord.stopWord) {
        alert(`Такое стоп-слово уже есть!`);
        return false;
      }
    }

    this.stopWords.push({ stopWord: addStopWord, numberUses: 0 });

    return true;
  }

  getStopWords(): IStopWord[] {
    return this.stopWords;
  }

  deleteStopWord(deleteWord: string): void {
    this.stopWords = this.stopWords.filter((stopWord) => {
      return stopWord.stopWord !== deleteWord;
    });
  }

  resetUsedStopWords(): void {
    this.stopWords.forEach((stopWord) => {
      stopWord.numberUses = 0;
    });
  }

  useStopWord(useWord: string, type: `plus` | `minus`): void {
    this.stopWords.forEach((stopWord) => {
      if (stopWord.stopWord === useWord) {
        if (type === `plus`) stopWord.numberUses++;
        else if (type === `minus`) stopWord.numberUses--;
      }
    });
  }

  getUsedStopWord(useWord: string): number {
    let countUsed: number = 0;

    this.stopWords.forEach((stopWord) => {
      if (stopWord.stopWord === useWord) {
        countUsed = stopWord.numberUses;
      }
    });

    return countUsed;
  }

  setUserMessages(messages: string[]) {
    this.userMessages = messages;
  }

  getUserMessages(): string[] {
    return this.userMessages;
  }

  recalculateStopWordStatistics(messages: string[], stopWords: IStopWord[]) {
    messages.forEach((message, indexMessage, arrayMessages) => {
      const arrayWordsMessage = message.split(` `);

      arrayWordsMessage.forEach((word, indexWord, arrayWord) => {
        stopWords.forEach((stopWord, indexStopWord, arrayStopWords) => {
          const isExist = word.indexOf(stopWord.stopWord, 0);

          if (isExist !== -1) {
            this.useStopWord(stopWord.stopWord, `plus`);
          }
        });
      });

      return arrayWordsMessage;
    });
  }

  ////////////////////////////////

  getUserMessagesWithUserLogin(loginUser: string): Observable<string[]> {
    return this.http.get<string[]>(
      `https://baconipsum.com/api/?type=all-meat&paras=10&user=${loginUser}`
    );
  }
}
