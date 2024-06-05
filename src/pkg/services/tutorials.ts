import { driver, type DriveStep } from 'driver.js'

export class Tutorial {
  public static showTutorial(isRandomMode: boolean = false) {
    const steps: DriveStep[] = [
      {
        element: '#definition-hint',
        popover: {
          title: 'Definition',
          description:
            'This is the partial definition of the word, which only shows the letters that you have guessed with certain conditions.',
        },
      },
      {
        element: '#word-length',
        popover: { title: 'Word Length', description: 'No spaces are included in the letter count' },
      },
      {
        element: '#word-category',
        popover: { title: 'Word Category', description: 'This shows the category of the word after several guesses' },
      },
      {
        element: '#input',
        popover: {
          title: 'Input',
          description: 'Type your guess here and press ENTER to submit.',
        },
      },
      {
        element: '.var-form-details',
        popover: {
          title: 'Length Limit',
          description: 'This indicates the min & max numbers of characters you can input; computed by [word length ± 3]',
        },
      },
      {
        element: '#first-guess-box',
        popover: {
          title: 'Guess Box',
          description:
            'Words you guess will appear in these guess boxes. Green letters are correct in position, yellow letters are included in the word but not at the correct position, and gray letters does not exist in the word.',
        },
      },
    ]

    if (isRandomMode) {
      steps.unshift({ element: '#refresh-btn', popover: { title: 'Refresh Button', description: 'Click this button to get new word(s)' } })
    }

    const tour = driver({ steps: steps, showProgress: true })
    tour.drive(0)
  }
}
