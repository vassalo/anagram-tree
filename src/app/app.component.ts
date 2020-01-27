import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  words: { value: string }[];
  multipleWords: string;

  constructor() {
    this.words = [];
    this.multipleWords = '';
  }

  addWord() {
    this.words.push({value: ''});
  }

  getWordsWithoutLetter(letter: string, words: string[]): string[] {
    const res = [];

    for (const word of words) {
      if (word.indexOf(letter) === -1) {
        res.push(word);
      }
    }

    return res;
  }

  private bruteForce(tree: Tree, letters: string[], index: number) {
    if (index === letters.length || tree.wordsRemaining.length === 1) {
      return tree;
    }

    const letter = letters[index];
    const wordsWithoutNewLetter = this.getWordsWithoutLetter(letter, tree.wordsRemaining);
    console.log(letter);

    if (wordsWithoutNewLetter.length > 0) {
      const newTree = new Tree(tree.wordsRemaining.slice(0));
      newTree.anagram = tree.anagram.slice(0);
      newTree.anagram.push({letter, words: wordsWithoutNewLetter});
      newTree.removeWords(wordsWithoutNewLetter);

      console.log(tree.score(), tree.wordsRemaining, tree.anagram);
      console.log(newTree.score(), newTree.wordsRemaining, newTree.anagram);

      return newTree.score() >= tree.score() ? this.bruteForce(newTree, letters, index + 1)
        : this.bruteForce(tree, letters, index + 1);
    } else {
      return this.bruteForce(tree, letters, index + 1);
    }
  }

  submit() {
    const words = this.multipleWords.split('\n');

    const allLetters = [];
    for (const word of words) {
      for (const letter of word) {
        if (allLetters.indexOf(letter) === -1) {
          allLetters.push(letter);
        }
      }
    }

    console.log('words:', words, 'letters', allLetters);
    console.log(this.bruteForce(new Tree(words), allLetters, 0));
  }
}

class Tree {
  public wordsRemaining: string[];
  public anagram: { letter: string, words: string[] }[];

  constructor(wordsRemaining) {
    this.wordsRemaining = wordsRemaining;
    this.anagram = [];
  }

  score() {
    let score = 0;
    for (const node of this.anagram) {
      score += node.words.length;
    }

    return (this.anagram.length === 0 ? -9999 : (score / this.anagram.length)) - this.wordsRemaining.length;
  }

  removeWords(wordsToRemove: string[]) {
    for (const wordToRemove of wordsToRemove) {
      const indexOfWord = this.wordsRemaining.indexOf(wordToRemove);
      if (indexOfWord !== -1) {
        this.wordsRemaining.splice(indexOfWord, 1);
      }
    }
  }
}
