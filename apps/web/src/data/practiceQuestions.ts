import { PracticeQuestion } from '@career-bridge/types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // Aptitude
  {
    id: 'apt-1',
    type: 'aptitude',
    question: 'A train 150m long is running at a speed of 54 km/hr. How much time will it take to pass a platform 120m long?',
    options: ['12 sec', '15 sec', '18 sec', '20 sec'],
    correctAnswer: '18 sec',
    explanation: 'Total distance = 150 + 120 = 270m. Speed = 54 * (5/18) = 15 m/sec. Time = 270 / 15 = 18 sec.',
    difficulty: 'medium'
  },
  {
    id: 'apt-2',
    type: 'aptitude',
    question: 'The average of 5 numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?',
    options: ['24', '28', '20', '30'],
    correctAnswer: '28',
    explanation: 'Sum of 5 numbers = 5 * 20 = 100. Sum of 4 numbers = 4 * 18 = 72. Excluded number = 100 - 72 = 28.',
    difficulty: 'easy'
  },
  {
    id: 'apt-3',
    type: 'aptitude',
    question: 'A sum of money doubles itself in 10 years at simple interest. What is the rate of interest per annum?',
    options: ['5%', '10%', '15%', '20%'],
    correctAnswer: '10%',
    explanation: 'Simple Interest = Principal. Rate = (SI * 100) / (P * T) = (P * 100) / (P * 10) = 10%.',
    difficulty: 'medium'
  },
  // Verbal
  {
    id: 'verb-1',
    type: 'verbal',
    question: 'Choose the synonym for "ABANDON":',
    options: ['Keep', 'Forsake', 'Adopt', 'Retain'],
    correctAnswer: 'Forsake',
    explanation: 'Abandon means to leave or give up completely, which is synonymous with Forsake.',
    difficulty: 'easy'
  },
  {
    id: 'verb-2',
    type: 'verbal',
    question: 'Identify the error in the sentence: "Each of the students have finished their homework."',
    options: ['Each of', 'the students', 'have finished', 'their homework'],
    correctAnswer: 'have finished',
    explanation: '"Each" is singular, so it should be "has finished".',
    difficulty: 'medium'
  },
  {
    id: 'verb-3',
    type: 'verbal',
    question: 'Identify the correctly spelled word:',
    options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accommodat'],
    correctAnswer: 'Accommodate',
    explanation: 'The correct spelling is "Accommodate" with double "c" and double "m".',
    difficulty: 'easy'
  },

  // --- CODING (Multi-language) ---

  // JavaScript
  {
    id: 'code-js-1',
    type: 'coding',
    question: 'Write a JS function to reverse a string.',
    codeSnippet: 'function reverse(str) {\n  // your code here\n}',
    correctAnswer: 'function reverse(str) { return str.split("").reverse().join(""); }',
    explanation: 'Split the string into an array, reverse it, and join it back.',
    difficulty: 'easy',
    language: 'javascript'
  },
  // Python
  {
    id: 'code-py-1',
    type: 'coding',
    question: 'Write a Python function to check if a string is a palindrome.',
    codeSnippet: 'def is_palindrome(s):\n    # your code here',
    correctAnswer: 'def is_palindrome(s):\n    return s == s[::-1]',
    explanation: 'In Python, s[::-1] creates a reversed version of the string.',
    difficulty: 'easy',
    language: 'python'
  },
  // Java
  {
    id: 'code-java-1',
    type: 'coding',
    question: 'Write a Java method to find the maximum element in an array.',
    codeSnippet: 'public int findMax(int[] arr) {\n    // your code here\n}',
    correctAnswer: 'public int findMax(int[] arr) {\n    int max = arr[0];\n    for(int i : arr) if(i > max) max = i;\n    return max;\n}',
    explanation: 'Initialize max with the first element and iterate through the array.',
    difficulty: 'medium',
    language: 'java'
  },
  // C
  {
    id: 'code-c-1',
    type: 'coding',
    question: 'Write a C function to swap two integers using pointers.',
    codeSnippet: 'void swap(int *a, int *b) {\n    // your code here\n}',
    correctAnswer: 'void swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}',
    explanation: 'Use a temporary variable and dereference pointers to swap values.',
    difficulty: 'medium',
    language: 'c'
  },
  // C++
  {
    id: 'code-cpp-1',
    type: 'coding',
    question: 'Write a C++ class with a constructor and a method to display a message.',
    codeSnippet: 'class Greeter {\npublic:\n    // your code here\n};',
    correctAnswer: 'class Greeter {\npublic:\n    Greeter() {}\n    void sayHello() { cout << "Hello"; }\n};',
    explanation: 'Basic class structure with public access specifier.',
    difficulty: 'easy',
    language: 'c++'
  },

  // --- DEBUGGING (Multi-language) ---

  // Python Debugging
  {
    id: 'debug-py-1',
    type: 'debugging',
    question: 'Fix the bug in this Python code that should find the length of a list.',
    codeSnippet: 'def get_length(arr):\n    return arr.size()',
    correctAnswer: 'return len(arr)',
    explanation: 'In Python, use len() function instead of .size() method for lists.',
    difficulty: 'easy',
    language: 'python'
  },
  // Java Debugging
  {
    id: 'debug-java-1',
    type: 'debugging',
    question: 'Identify the logic error in this Java loop.',
    codeSnippet: 'for (int i = 0; i <= arr.length; i++) {\n    System.out.println(arr[i]);\n}',
    correctAnswer: 'i < arr.length',
    explanation: 'The loop goes up to arr.length (inclusive), causing an ArrayIndexOutOfBoundsException.',
    difficulty: 'easy',
    language: 'java'
  },
  // C Debugging
  {
    id: 'debug-c-1',
    type: 'debugging',
    question: 'What is missing in this C program?',
    codeSnippet: '#include <stdio.h>\nint main() {\n    printf("Hello World")\n    return 0;\n}',
    correctAnswer: 'Semicolon after printf statement.',
    explanation: 'Every statement in C must end with a semicolon.',
    difficulty: 'easy',
    language: 'c'
  },
  // JS Debugging
  {
    id: 'debug-js-1',
    type: 'debugging',
    question: 'Fix the "this" context issue in this JS code.',
    codeSnippet: 'const obj = {\n  name: "Niral",\n  greet: function() {\n    setTimeout(function() {\n      console.log(this.name);\n    }, 1000);\n  }\n};',
    correctAnswer: 'Use an arrow function in setTimeout: () => { console.log(this.name); }',
    explanation: 'Regular functions create their own "this" context. Arrow functions inherit it from the scope.',
    difficulty: 'medium',
    language: 'javascript'
  }
];
