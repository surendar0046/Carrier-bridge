import { PracticeQuestion } from '@career-bridge/types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // --- APTITUDE (10 Questions) ---
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
  {
    id: 'apt-4',
    type: 'aptitude',
    question: 'A and B together can complete a work in 12 days, while B alone can finish it in 30 days. In how many days can A alone complete the work?',
    options: ['18 days', '20 days', '22 days', '25 days'],
    correctAnswer: '20 days',
    explanation: 'A\'s 1 day work = 1/12 - 1/30 = (5-2)/60 = 3/60 = 1/20. Thus, A alone takes 20 days.',
    difficulty: 'medium'
  },
  {
    id: 'apt-5',
    type: 'aptitude',
    question: 'A shopkeeper sells an item at a profit of 15%. If he had sold it for Rs. 18 more, he would have gained 18%. Find the cost price of the item.',
    options: ['Rs. 500', 'Rs. 600', 'Rs. 450', 'Rs. 700'],
    correctAnswer: 'Rs. 600',
    explanation: 'Difference in profit percentage = 18% - 15% = 3%. So 3% of Cost Price = Rs. 18. Cost Price = 18 / 0.03 = Rs. 600.',
    difficulty: 'medium'
  },
  {
    id: 'apt-6',
    type: 'aptitude',
    question: 'Find the missing number in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['38', '40', '42', '46'],
    correctAnswer: '42',
    explanation: 'The differences between consecutive terms are increasing by 2: 6-2=4, 12-6=6, 20-12=8, 30-20=10. The next difference is 12. So, 30 + 12 = 42.',
    difficulty: 'easy'
  },
  {
    id: 'apt-7',
    type: 'aptitude',
    question: 'If 30% of a number is 120, what is 125% of that number?',
    options: ['400', '500', '450', '600'],
    correctAnswer: '500',
    explanation: 'The number is 120 / 0.30 = 400. 125% of 400 = 400 * 1.25 = 500.',
    difficulty: 'easy'
  },
  {
    id: 'apt-8',
    type: 'aptitude',
    question: 'The ratio of the ages of two persons is 4:7 and the age of one of them is greater than that of the other by 30 years. Find the sum of their ages.',
    options: ['110 years', '100 years', '90 years', '120 years'],
    correctAnswer: '110 years',
    explanation: 'Let their ages be 4x and 7x. 7x - 4x = 30 => 3x = 30 => x = 10. Sum of their ages = 4x + 7x = 11x = 11 * 10 = 110 years.',
    difficulty: 'medium'
  },
  {
    id: 'apt-9',
    type: 'aptitude',
    question: 'In a group of cows and chickens, the number of legs is 14 more than twice the number of heads. How many cows are there?',
    options: ['5', '7', '10', '12'],
    correctAnswer: '7',
    explanation: 'Let cows be C and chickens be H. Legs = 4C + 2H. Heads = C + H. Given: 4C + 2H = 2(C + H) + 14 => 4C + 2H = 2C + 2H + 14 => 2C = 14 => C = 7.',
    difficulty: 'hard'
  },
  {
    id: 'apt-10',
    type: 'aptitude',
    question: 'A card is drawn from a pack of 52 cards. What is the probability that it is a king or a red card?',
    options: ['7/13', '15/26', '6/13', '9/13'],
    correctAnswer: '7/13',
    explanation: 'Number of red cards = 26. Number of kings = 4 (2 are red, 2 are black). Favorable cards = 26 + 2 = 28. Probability = 28/52 = 7/13.',
    difficulty: 'hard'
  },

  // --- VERBAL (10 Questions) ---
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
  {
    id: 'verb-4',
    type: 'verbal',
    question: 'Choose the antonym for "EPHEMERAL":',
    options: ['Transient', 'Eternal', 'Fleeting', 'Short-lived'],
    correctAnswer: 'Eternal',
    explanation: 'Ephemeral means lasting for a very short time. Its opposite is Eternal, meaning lasting forever.',
    difficulty: 'medium'
  },
  {
    id: 'verb-5',
    type: 'verbal',
    question: 'Fill in the blank: "The candidate was so ______ that the interviewers were highly impressed."',
    options: ['articulate', 'diffident', 'hesitant', 'laconic'],
    correctAnswer: 'articulate',
    explanation: '"Articulate" means fluent and coherent in speech, which would impress interviewers.',
    difficulty: 'easy'
  },
  {
    id: 'verb-6',
    type: 'verbal',
    question: 'What is the meaning of the idiom "Spill the beans"?',
    options: ['To drop something', 'To reveal a secret', 'To cook a meal', 'To start a fight'],
    correctAnswer: 'To reveal a secret',
    explanation: '"Spill the beans" is a common idiom that means to disclose secret information prematurely or unintentionally.',
    difficulty: 'medium'
  },
  {
    id: 'verb-7',
    type: 'verbal',
    question: 'Sentence completion: "Despite the bad weather, the flight took off ______ time."',
    options: ['at', 'on', 'in', 'with'],
    correctAnswer: 'on',
    explanation: '"On time" is the correct prepositional phrase meaning at the planned or correct time.',
    difficulty: 'easy'
  },
  {
    id: 'verb-8',
    type: 'verbal',
    question: 'Identify the error in the sentence: "She is more taller than her brother."',
    options: ['She is', 'more taller', 'than', 'her brother'],
    correctAnswer: 'more taller',
    explanation: '"Taller" is already a comparative adjective. Adding "more" creates a double comparative error. It should just be "taller".',
    difficulty: 'easy'
  },
  {
    id: 'verb-9',
    type: 'verbal',
    question: 'Choose the synonym for "METICULOUS":',
    options: ['Careless', 'Scrupulous', 'Hasty', 'Indifferent'],
    correctAnswer: 'Scrupulous',
    explanation: '"Meticulous" means showing great attention to detail; very careful and precise, which matches "Scrupulous".',
    difficulty: 'medium'
  },
  {
    id: 'verb-10',
    type: 'verbal',
    question: 'Identify the correctly spelled word:',
    options: ['Liaison', 'Liason', 'Liaisonne', 'Liasion'],
    correctAnswer: 'Liaison',
    explanation: 'The correct spelling is "Liaison", which refers to communication or cooperation that facilitates a close working relationship.',
    difficulty: 'hard'
  },

  // --- CODING (3 per language) ---

  // Javascript Coding
  {
    id: 'code-js-1',
    type: 'coding',
    question: 'Write a Javascript function to reverse a string.',
    codeSnippet: 'function reverseString(str) {\n  // Write your code here\n}',
    correctAnswer: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
    explanation: 'Split the string into an array of characters, reverse the array, and join it back into a string.',
    difficulty: 'easy',
    language: 'javascript',
    testCases: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"world"', output: '"dlrow"' }
    ]
  },
  {
    id: 'code-js-2',
    type: 'coding',
    question: 'Write a Javascript function to calculate the factorial of a positive integer.',
    codeSnippet: 'function factorial(n) {\n  // Write your code here\n}',
    correctAnswer: 'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
    explanation: 'Using recursion, if n is 0 or 1, return 1. Otherwise, return n multiplied by the factorial of n-1.',
    difficulty: 'medium',
    language: 'javascript',
    testCases: [
      { input: '5', output: '120' },
      { input: '0', output: '1' }
    ]
  },
  {
    id: 'code-js-3',
    type: 'coding',
    question: 'Write a Javascript function that checks if a number is prime.',
    codeSnippet: 'function isPrime(num) {\n  // Write your code here\n}',
    correctAnswer: 'function isPrime(num) {\n  if (num <= 1) return false;\n  for (let i = 2; i <= Math.sqrt(num); i++) {\n    if (num % i === 0) return false;\n  }\n  return true;\n}',
    explanation: 'A prime number is greater than 1 and has no positive divisors other than 1 and itself. Iterate from 2 to the square root of the number to check for divisibility.',
    difficulty: 'medium',
    language: 'javascript',
    testCases: [
      { input: '7', output: 'true' },
      { input: '4', output: 'false' }
    ]
  },

  // Python Coding
  {
    id: 'code-py-1',
    type: 'coding',
    question: 'Write a Python function to check if a string is a palindrome.',
    codeSnippet: 'def is_palindrome(s):\n    # Write your code here\n    pass',
    correctAnswer: 'def is_palindrome(s):\n    return s == s[::-1]',
    explanation: 'Use Python string slicing syntax s[::-1] to reverse the string and compare it with the original.',
    difficulty: 'easy',
    language: 'python',
    testCases: [
      { input: '"radar"', output: 'True' },
      { input: '"hello"', output: 'False' }
    ]
  },
  {
    id: 'code-py-2',
    type: 'coding',
    question: 'Write a Python function to return the n-th Fibonacci number.',
    codeSnippet: 'def fibonacci(n):\n    # Write your code here\n    pass',
    correctAnswer: 'def fibonacci(n):\n    if n <= 0: return 0\n    elif n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b',
    explanation: 'Iteratively calculate the Fibonacci sequence using tuple unpacking to update variables.',
    difficulty: 'medium',
    language: 'python',
    testCases: [
      { input: '6', output: '8' },
      { input: '1', output: '1' }
    ]
  },
  {
    id: 'code-py-3',
    type: 'coding',
    question: 'Write a Python function that takes a list of numbers and returns only the numbers greater than the average.',
    codeSnippet: 'def greater_than_average(nums):\n    # Write your code here\n    pass',
    correctAnswer: 'def greater_than_average(nums):\n    if not nums: return []\n    avg = sum(nums) / len(nums)\n    return [x for x in nums if x > avg]',
    explanation: 'Calculate the average of the numbers and use list comprehension to filter elements greater than the average.',
    difficulty: 'medium',
    language: 'python',
    testCases: [
      { input: '[1, 2, 3, 4, 5]', output: '[4, 5]' },
      { input: '[10, 10, 10]', output: '[]' }
    ]
  },

  // Java Coding
  {
    id: 'code-java-1',
    type: 'coding',
    question: 'Write a Java method to find the maximum element in an array.',
    codeSnippet: 'public int findMax(int[] arr) {\n    // Write your code here\n}',
    correctAnswer: 'public int findMax(int[] arr) {\n    int max = arr[0];\n    for(int i : arr) {\n        if(i > max) max = i;\n    }\n    return max;\n}',
    explanation: 'Initialize the max variable with the first element of the array and iterate through the rest of the array to find any larger value.',
    difficulty: 'easy',
    language: 'java',
    testCases: [
      { input: '[1, 5, 3, 9, 2]', output: '9' },
      { input: '[-1, -5, -3]', output: '-1' }
    ]
  },
  {
    id: 'code-java-2',
    type: 'coding',
    question: 'Write a Java method to reverse an integer array in place.',
    codeSnippet: 'public void reverseArray(int[] arr) {\n    // Write your code here\n}',
    correctAnswer: 'public void reverseArray(int[] arr) {\n    int left = 0, right = arr.length - 1;\n    while(left < right) {\n        int temp = arr[left];\n        arr[left] = arr[right];\n        arr[right] = temp;\n        left++;\n        right--;\n    }\n}',
    explanation: 'Use two pointers, one at the start and one at the end of the array, swapping elements and moving towards the center.',
    difficulty: 'medium',
    language: 'java',
    testCases: [
      { input: '[1, 2, 3, 4]', output: '[4, 3, 2, 1]' },
      { input: '[5]', output: '[5]' }
    ]
  },
  {
    id: 'code-java-3',
    type: 'coding',
    question: 'Write a Java method to count the number of vowels in a string.',
    codeSnippet: 'public int countVowels(String str) {\n    // Write your code here\n}',
    correctAnswer: 'public int countVowels(String str) {\n    int count = 0;\n    String vowels = "aeiouAEIOU";\n    for(char c : str.toCharArray()) {\n        if(vowels.indexOf(c) != -1) count++;\n    }\n    return count;\n}',
    explanation: 'Iterate through the characters of the string and increment the counter if the character is present in the vowels reference string.',
    difficulty: 'medium',
    language: 'java',
    testCases: [
      { input: '"education"', output: '5' },
      { input: '"xyz"', output: '0' }
    ]
  },

  // C Coding
  {
    id: 'code-c-1',
    type: 'coding',
    question: 'Write a C function to swap two integers using pointers.',
    codeSnippet: 'void swap(int *a, int *b) {\n    // Write your code here\n}',
    correctAnswer: 'void swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}',
    explanation: 'Use a temporary variable to store the value of the first pointer, then assign the value of the second pointer to the first, and finally assign the temp value to the second pointer.',
    difficulty: 'easy',
    language: 'c',
    testCases: [
      { input: 'a=5, b=10', output: 'a=10, b=5' },
      { input: 'a=-1, b=3', output: 'a=3, b=-1' }
    ]
  },
  {
    id: 'code-c-2',
    type: 'coding',
    question: 'Write a C function to check if a year is a leap year.',
    codeSnippet: 'int isLeapYear(int year) {\n    // Write your code here\n}',
    correctAnswer: 'int isLeapYear(int year) {\n    if (year % 400 == 0) return 1;\n    if (year % 100 == 0) return 0;\n    if (year % 4 == 0) return 1;\n    return 0;\n}',
    explanation: 'A year is a leap year if it is divisible by 4, except for century years, which must be divisible by 400.',
    difficulty: 'medium',
    language: 'c',
    testCases: [
      { input: '2020', output: '1' },
      { input: '1900', output: '0' }
    ]
  },
  {
    id: 'code-c-3',
    type: 'coding',
    question: 'Write a C function to perform bubble sort on an array.',
    codeSnippet: 'void bubbleSort(int arr[], int n) {\n    // Write your code here\n}',
    correctAnswer: 'void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n        }\n    }\n}',
    explanation: 'Repeatedly swap adjacent elements if they are in the wrong order until the array is sorted.',
    difficulty: 'medium',
    language: 'c',
    testCases: [
      { input: '[3, 1, 4, 2], n=4', output: '[1, 2, 3, 4]' }
    ]
  },

  // C++ Coding
  {
    id: 'code-cpp-1',
    type: 'coding',
    question: 'Write a C++ class with a constructor and a method to display a message.',
    codeSnippet: '#include <iostream>\nusing namespace std;\n\nclass Greeter {\npublic:\n    // Write your code here\n};',
    correctAnswer: '#include <iostream>\nusing namespace std;\n\nclass Greeter {\npublic:\n    Greeter() {}\n    void sayHello() {\n        cout << "Hello World";\n    }\n};',
    explanation: 'Basic class structure in C++ showing public access modifier, constructor, and cout function.',
    difficulty: 'easy',
    language: 'c++',
    testCases: [
      { input: 'greeter.sayHello()', output: '"Hello World"' }
    ]
  },
  {
    id: 'code-cpp-2',
    type: 'coding',
    question: 'Write a C++ function to check if a number is prime.',
    codeSnippet: 'bool isPrime(int n) {\n    // Write your code here\n}',
    correctAnswer: 'bool isPrime(int n) {\n    if (n <= 1) return false;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}',
    explanation: 'Check for divisibility from 2 up to the square root of n.',
    difficulty: 'medium',
    language: 'c++',
    testCases: [
      { input: '11', output: 'true' },
      { input: '15', output: 'false' }
    ]
  },
  {
    id: 'code-cpp-3',
    type: 'coding',
    question: 'Write a C++ function to find the Greatest Common Divisor (GCD) of two numbers.',
    codeSnippet: 'int getGCD(int a, int b) {\n    // Write your code here\n}',
    correctAnswer: 'int getGCD(int a, int b) {\n    while (b != 0) {\n        int temp = b;\n        b = a % b;\n        a = temp;\n    }\n    return a;\n}',
    explanation: 'Use Euclidean algorithm: repeatedly compute remainder of division until b becomes 0.',
    difficulty: 'medium',
    language: 'c++',
    testCases: [
      { input: '12, 18', output: '6' },
      { input: '5, 7', output: '1' }
    ]
  },


  // --- DEBUGGING (Medium Difficulty, 3 per language) ---

  // Javascript Debugging (Medium)
  {
    id: 'debug-js-1',
    type: 'debugging',
    question: 'Fix the "this" context issue in this JS code to correctly log the name.',
    codeSnippet: 'const obj = {\n  name: "Niral",\n  greet: function() {\n    setTimeout(function() {\n      console.log(this.name);\n    }, 1000);\n  }\n};',
    correctAnswer: 'const obj = {\n  name: "Niral",\n  greet: function() {\n    setTimeout(() => {\n      console.log(this.name);\n    }, 1000);\n  }\n};',
    explanation: 'Regular functions create their own "this" context. Arrow functions inherit "this" from the parent context.',
    difficulty: 'medium',
    language: 'javascript'
  },
  {
    id: 'debug-js-2',
    type: 'debugging',
    question: 'Fix the mutation bug. Modifying the copy array also changes the original array.',
    codeSnippet: 'function copyAndAdd(originalList) {\n  const newList = originalList;\n  newList.push("new_item");\n  return newList;\n}',
    correctAnswer: 'function copyAndAdd(originalList) {\n  const newList = [...originalList];\n  newList.push("new_item");\n  return newList;\n}',
    explanation: 'Assigning originalList directly copies the reference, mutating both. Spread operator creates a shallow copy.',
    difficulty: 'medium',
    language: 'javascript'
  },
  {
    id: 'debug-js-3',
    type: 'debugging',
    question: 'Fix this loop so that it logs index values 0, 1, 2 after 100ms instead of 3, 3, 3.',
    codeSnippet: 'for (var i = 0; i < 3; i++) {\n  setTimeout(function() {\n    console.log(i);\n  }, 100);\n}',
    correctAnswer: 'for (let i = 0; i < 3; i++) {\n  setTimeout(function() {\n    console.log(i);\n  }, 100);\n}',
    explanation: 'var is function-scoped and shares a single binding. Changing it to block-scoped "let" binds a new "i" value for each iteration.',
    difficulty: 'medium',
    language: 'javascript'
  },

  // Python Debugging (Medium)
  {
    id: 'debug-py-1',
    type: 'debugging',
    question: 'Fix this Python code which throws an error when modifying a list during iteration.',
    codeSnippet: 'def remove_negatives(numbers):\n    for num in numbers:\n        if num < 0:\n            numbers.remove(num)\n    return numbers',
    correctAnswer: 'def remove_negatives(numbers):\n    return [num for num in numbers if num >= 0]',
    explanation: 'Modifying a list while iterating over it changes index markers, skipping elements. Create a new list or list comprehension.',
    difficulty: 'medium',
    language: 'python'
  },
  {
    id: 'debug-py-2',
    type: 'debugging',
    question: 'Fix the bug where the default list argument persists across multiple function calls.',
    codeSnippet: 'def add_to_list(val, my_list=[]):\n    my_list.append(val)\n    return my_list',
    correctAnswer: 'def add_to_list(val, my_list=None):\n    if my_list is None:\n        my_list = []\n    my_list.append(val)\n    return my_list',
    explanation: 'In Python, default arguments are evaluated once at function definition, making mutable list parameter persist across calls.',
    difficulty: 'medium',
    language: 'python'
  },
  {
    id: 'debug-py-3',
    type: 'debugging',
    question: 'Fix this function which is supposed to merge two dictionaries without overwriting values with same keys, but combining them into a list.',
    codeSnippet: 'def merge_dicts(d1, d2):\n    result = d1.copy()\n    for k, v in d2.items():\n        result[k] = [result[k], v]\n    return result',
    correctAnswer: 'def merge_dicts(d1, d2):\n    result = {}\n    for k in set(d1.keys()) | set(d2.keys()):\n        val1 = d1.get(k)\n        val2 = d2.get(k)\n        if val1 is not None and val2 is not None:\n            result[k] = [val1, val2]\n        elif val1 is not None:\n            result[k] = val1\n        else:\n            result[k] = val2\n    return result',
    explanation: 'Directly referencing result[k] raises a KeyError if key k is not present in d1.',
    difficulty: 'medium',
    language: 'python'
  },

  // Java Debugging (Medium)
  {
    id: 'debug-java-1',
    type: 'debugging',
    question: 'Fix the off-by-one logic error in this Java print loop causing array index exception.',
    codeSnippet: 'for (int i = 0; i <= arr.length; i++) {\n    System.out.println(arr[i]);\n}',
    correctAnswer: 'for (int i = 0; i < arr.length; i++) {\n    System.out.println(arr[i]);\n}',
    explanation: 'Array indices are 0 to length-1. Using <= arr.length causes ArrayIndexOutOfBoundsException.',
    difficulty: 'medium',
    language: 'java'
  },
  {
    id: 'debug-java-2',
    type: 'debugging',
    question: 'Fix the string comparison error in this validation logic.',
    codeSnippet: 'public boolean isValidRole(String input) {\n    return input == "ADMIN";\n}',
    correctAnswer: 'public boolean isValidRole(String input) {\n    return "ADMIN".equals(input);\n}',
    explanation: 'In Java, == compares string object references. Always use .equals() or .equalsIgnoreCase() to compare actual string content.',
    difficulty: 'medium',
    language: 'java'
  },
  {
    id: 'debug-java-3',
    type: 'debugging',
    question: 'Fix the NullPointerException in this array initialization.',
    codeSnippet: 'String[] names = new String[5];\nSystem.out.println(names[0].toUpperCase());',
    correctAnswer: 'String[] names = new String[5];\nnames[0] = "Default";\nSystem.out.println(names[0].toUpperCase());',
    explanation: 'Object arrays are initialized with null references. You must assign a String value to elements before invoking methods on them.',
    difficulty: 'medium',
    language: 'java'
  },

  // C Debugging (Medium)
  {
    id: 'debug-c-1',
    type: 'debugging',
    question: 'Fix this function which is supposed to swap two values but has pointer dereferencing syntax errors.',
    codeSnippet: 'void swap(int *x, int *y) {\n    int temp = x;\n    x = y;\n    y = temp;\n}',
    correctAnswer: 'void swap(int *x, int *y) {\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}',
    explanation: 'To manipulate variables being pointed to, pointers must be dereferenced using the asterisk (*) operator.',
    difficulty: 'medium',
    language: 'c'
  },
  {
    id: 'debug-c-2',
    type: 'debugging',
    question: 'Fix the segmentation fault in this scanf statement.',
    codeSnippet: 'int number;\nprintf("Enter a number: ");\nscanf("%d", number);',
    correctAnswer: 'int number;\nprintf("Enter a number: ");\nscanf("%d", &number);',
    explanation: 'scanf expects the memory address where the value should be stored, so the address-of operator (&) must be used.',
    difficulty: 'medium',
    language: 'c'
  },
  {
    id: 'debug-c-3',
    type: 'debugging',
    question: 'Fix this memory leak in dynamic allocation.',
    codeSnippet: 'int* ptr = (int*)malloc(10 * sizeof(int));\n// ... perform operations\nreturn;',
    correctAnswer: 'int* ptr = (int*)malloc(10 * sizeof(int));\n// ... perform operations\nfree(ptr);\nreturn;',
    explanation: 'Dynamically allocated memory with malloc() in C must be explicitly freed using free() to prevent memory leaks.',
    difficulty: 'medium',
    language: 'c'
  },

  // C++ Debugging (Medium)
  {
    id: 'debug-cpp-1',
    type: 'debugging',
    question: 'Fix the compilation error in this C++ class definition.',
    codeSnippet: 'class Box {\n    double width;\npublic:\n    Box(double w) : width(w) {}\n}',
    correctAnswer: 'class Box {\n    double width;\npublic:\n    Box(double w) : width(w) {}\n};',
    explanation: 'In C++, class declarations must end with a semicolon.',
    difficulty: 'medium',
    language: 'c++'
  },
  {
    id: 'debug-cpp-2',
    type: 'debugging',
    question: 'Fix this C++ code which fails to free base class resources during deletion.',
    codeSnippet: 'class Base {\npublic:\n    ~Base() {}\n};\nclass Derived : public Base {\npublic:\n    ~Derived() { /* clean up */ }\n};',
    correctAnswer: 'class Base {\npublic:\n    virtual ~Base() {}\n};\nclass Derived : public Base {\npublic:\n    virtual ~Derived() { /* clean up */ }\n};',
    explanation: 'A base class destructor should be declared virtual to ensure proper polymorphic cleanup when deleting derived objects through base pointers.',
    difficulty: 'medium',
    language: 'c++'
  },
  {
    id: 'debug-cpp-3',
    type: 'debugging',
    question: 'Fix this code which leads to a compile error when attempting to print a private member variable directly.',
    codeSnippet: 'class Circle {\n    double radius;\npublic:\n    Circle(double r) : radius(r) {}\n};\n\nint main() {\n    Circle c(5);\n    cout << c.radius;\n}',
    correctAnswer: 'class Circle {\n    double radius;\npublic:\n    Circle(double r) : radius(r) {}\n    double getRadius() { return radius; }\n};\n\nint main() {\n    Circle c(5);\n    cout << c.getRadius();\n}',
    explanation: 'Private members are not accessible from outside the class scope. Use a public getter method.',
    difficulty: 'medium',
    language: 'c++'
  }
];
