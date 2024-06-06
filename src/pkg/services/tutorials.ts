import { driver, type DriveStep } from 'driver.js'
import { useStore } from '../stores/app'

export class Tutorial {
  public static showTutorial(isRandomMode: boolean, isQuardleMode: boolean) {
    const store = useStore()
    let tmp: string | undefined

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
        onHighlightStarted: () => {
          if (!isQuardleMode) {
            tmp = store.tries[0]
            store.tries[0] = `${store.word?.word.charAt(0)}${store.word?.word.charAt(2)}makes`
            return
          }

          tmp = store.quardleTries![0][0]
          const word = `${store.quardleWords?.[0].word.charAt(0)}${store.quardleWords?.[0].word.charAt(2)}makes`
          store.quardleTries![0][0] = word
          store.quardleTries![1][0] = word
          store.quardleTries![2][0] = word
          store.quardleTries![3][0] = word
        },
        popover: {
          title: 'Guess Box',
          description:
            'Words you guess will appear in these guess boxes and the background color of each letter indicates the status of the guess.',
        },
      },
      {
        element: '.bg-green-400',
        popover: {
          title: 'Green Letter',
          description: 'Meaning that the letter is in the correct position of the respective word.',
        },
      },
      {
        element: '.bg-yellow-400',
        popover: {
          title: 'Yellow Letter',
          description: 'Meaning that the letter is in the word but in the wrong position.',
        },
      },
      {
        element: '.bg-gray-300 ',
        popover: {
          title: 'Gray Letter',
          description: 'Meaning that the letter is not in the word.',
        },
      },
    ]

    if (isRandomMode) {
      steps.unshift({ element: '#refresh-btn', popover: { title: 'Refresh Button', description: 'Click this button to get new word(s)' } })
    }

    const tour = driver({
      steps: steps,
      showProgress: true,
      onDestroyed: () => {
        if (!isQuardleMode) {
          if (tmp == undefined) {
            store.tries = []
          } else {
            store.tries[0] = tmp
          }
          return
        }

        if (tmp == undefined) {
          store.quardleTries = [[], [], [], []]
        } else {
          store.quardleTries![0][0] = tmp
          store.quardleTries![1][0] = tmp
          store.quardleTries![2][0] = tmp
          store.quardleTries![3][0] = tmp
        }
      },
    })
    tour.drive(0)
  }
}
