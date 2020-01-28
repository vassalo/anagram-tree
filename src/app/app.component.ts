import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  multipleWords: string;
  forceLetters: string;

  letters: string[];
  words: string[];
  bestTree: Tree;

  qnt = 0;

  constructor() {
    this.words = [];
    this.multipleWords = '';
  }

  private bruteForce(anagram: string[], visited: any) {
    const currTree = new Tree(anagram, this.words);
    console.log(++this.qnt, anagram, currTree);

    if (!this.bestTree || currTree.getScore() >= this.bestTree.getScore()) {
      this.bestTree = currTree;
    }

    for (const letter of this.letters) {
      if (!visited[letter]) {
        visited[letter] = true;
        this.bruteForce(anagram.concat([letter]), visited);
        visited[letter] = false;
      }
    }
  }

  submit() {
    this.qnt = 0;
    this.words = this.multipleWords.split('\n');

    this.letters = [];

    console.log(this.forceLetters);
    if (!this.forceLetters) {
      // get all letters once
      for (const word of this.words) {
        for (const letter of word) {
          if (this.letters.indexOf(letter) === -1) {
            this.letters.push(letter);
          }
        }
      }

      // only keep letters that do not appear in at least 1 word
      for (let i = 0; i < this.letters.length; i++) {
        let appeared = true;
        for (const word of this.words) {
          if (word.indexOf(this.letters[i]) === -1) {
            appeared = false;
          }
        }

        if (appeared) {
          this.letters.splice(i, 1);
          i--;
        }
      }
    } else {
      this.letters = this.forceLetters.split('\n');
    }

    console.log('words:', this.words, 'letters', this.letters);
    this.bruteForce([], {});
    console.log(this.bestTree);
  }
}

class Tree {
  public wordsRemaining: string[];
  public anagram: { letter: string, words: string[] }[];
  private score: number;

  constructor(anagram: string[], words: string[]) {
    this.anagram = [];
    this.wordsRemaining = words.slice(0);

    for (const letter of anagram) {
      const wordsWithoutLetter = this.getRemainingWordsWithoutLetter(letter);

      if (wordsWithoutLetter.length > 0) {
        this.anagram.push({letter, words: wordsWithoutLetter});
        this.removeWords(wordsWithoutLetter);
      }
    }
  }

  getScore() {
    if (this.score !== undefined) {
      return this.score;
    }

    let score = 0;
    let index = 0;
    for (const node of this.anagram) {
      score += node.words.length === 2 || (index === 0 && node.words.length === 3) ? 1 : -node.words.length;
      index++;
    }

    this.score = (this.anagram.length === 0 ? -9999
      : score - (this.wordsRemaining.length === 1 ? -1 : this.wordsRemaining.length * 2));
    return this.score;
  }

  removeWords(wordsToRemove: string[]) {
    for (const wordToRemove of wordsToRemove) {
      const indexOfWord = this.wordsRemaining.indexOf(wordToRemove);
      if (indexOfWord !== -1) {
        this.wordsRemaining.splice(indexOfWord, 1);
      }
    }
  }

  getRemainingWordsWithoutLetter(letter: string): string[] {
    const res = [];

    for (const word of this.wordsRemaining) {
      if (word.indexOf(letter) === -1) {
        res.push(word);
      }
    }

    return res;
  }
}
