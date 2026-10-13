import { PracticeQuestion } from '@career-bridge/types';

export interface WeeklyAssessmentQuestion extends PracticeQuestion {
  section: 'aptitude' | 'verbal' | 'coding' | 'debugging';
  points: number;
}

export const WEEKLY_ASSESSMENT_QUESTIONS: WeeklyAssessmentQuestion[] = [
  // ─── SECTION 1: QUANTITATIVE APTITUDE (5 Distinct High-Yield Questions) ───
  {
    id: 'week-apt-1',
    section: 'aptitude',
    type: 'aptitude',
    points: 10,
    question: 'The difference between compound interest and simple interest on a certain sum of money at 8% per annum for 2 years is ₹96. Find the principal sum.',
    options: ['₹12,500', '₹15,000', '₹14,200', '₹16,000'],
    correctAnswer: '₹15,000',
    explanation: 'Formula for difference between CI and SI for 2 years: D = P * (R/100)^2. Here, 96 = P * (8/100)^2 => 96 = P * (64 / 10000) => P = (96 * 10000) / 64 = ₹15,000.',
    difficulty: 'hard'
  },
  {
    id: 'week-apt-2',
    section: 'aptitude',
    type: 'aptitude',
    points: 10,
    question: 'A container contains 60 litres of milk. From this, 6 litres of milk was taken out and replaced by water. This process was repeated further two times. How much milk is now contained by the container?',
    options: ['43.74 litres', '45.20 litres', '41.50 litres', '48.60 litres'],
    correctAnswer: '43.74 litres',
    explanation: 'Amount of milk left = Original * (1 - replaced/Original)^n = 60 * (1 - 6/60)^3 = 60 * (9/10)^3 = 60 * 0.729 = 43.74 litres.',
    difficulty: 'hard'
  },
  {
    id: 'week-apt-3',
    section: 'aptitude',
    type: 'aptitude',
    points: 10,
    question: 'Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. What is the ratio of their speeds?',
    options: ['3 : 2', '2 : 3', '4 : 3', '3 : 4'],
    correctAnswer: '3 : 2',
    explanation: 'Let speeds be x and y. Lengths = 27x and 17y. When crossing each other: (27x + 17y) / (x + y) = 23 => 27x + 17y = 23x + 23y => 4x = 6y => x/y = 6/4 = 3/2.',
    difficulty: 'medium'
  },
  {
    id: 'week-apt-4',
    section: 'aptitude',
    type: 'aptitude',
    points: 10,
    question: 'In how many ways can a committee consisting of 4 men and 3 women be selected from a pool of 7 men and 6 women?',
    options: ['700', '650', '720', '800'],
    correctAnswer: '700',
    explanation: 'Ways to choose 4 men from 7 = 7C4 = 35. Ways to choose 3 women from 6 = 6C3 = 20. Total ways = 35 * 20 = 700 ways.',
    difficulty: 'medium'
  },
  {
    id: 'week-apt-5',
    section: 'aptitude',
    type: 'aptitude',
    points: 10,
    question: 'Pipe A can fill a tank in 16 hours, while Pipe B can fill it in 24 hours. A leak at the bottom can empty the full tank in 48 hours. If both pipes and the leak are opened together, in how many hours will the tank be full?',
    options: ['12 hours', '14 hours', '16 hours', '10 hours'],
    correctAnswer: '12 hours',
    explanation: 'Net filling rate per hour = 1/16 + 1/24 - 1/48 = (3 + 2 - 1) / 48 = 4/48 = 1/12. Therefore, the tank fills in 12 hours.',
    difficulty: 'medium'
  },

  // ─── SECTION 2: VERBAL ABILITY (5 Distinct Advanced Questions) ───
  {
    id: 'week-verb-1',
    section: 'verbal',
    type: 'verbal',
    points: 10,
    question: 'Critical Reasoning: "All scalable cloud architectures implement stateless microservices. System X is a scalable cloud architecture. Therefore, System X implements stateless microservices." Which logical deduction is this?',
    options: ['Modus Ponens (Valid deduction)', 'Modus Tollens', 'Affirming the Consequent', 'Faulty Analogy'],
    correctAnswer: 'Modus Ponens (Valid deduction)',
    explanation: 'The argument follows the classical rule of inference: If P then Q; P is true; therefore Q must be true (Modus Ponens).',
    difficulty: 'medium'
  },
  {
    id: 'week-verb-2',
    section: 'verbal',
    type: 'verbal',
    points: 10,
    question: 'Select the sentence that maintains grammatically correct parallel structure:',
    options: [
      'The engineer spent the weekend debugging the API, optimizing queries, and wrote unit tests.',
      'The engineer spent the weekend debugging the API, optimizing queries, and writing unit tests.',
      'The engineer spent the weekend to debug the API, optimizing queries, and write unit tests.',
      'The engineer spent the weekend debugging the API, query optimization, and unit testing.'
    ],
    correctAnswer: 'The engineer spent the weekend debugging the API, optimizing queries, and writing unit tests.',
    explanation: 'Parallel structure requires all verbs in the series to share the same grammatical form (gerunds: debugging, optimizing, writing).',
    difficulty: 'medium'
  },
  {
    id: 'week-verb-3',
    section: 'verbal',
    type: 'verbal',
    points: 10,
    question: 'Analogies: PAUCITY : SURPLUS :: ________ : ________',
    options: [
      'Indolence : Sloth',
      'Ephemeral : Perennial',
      'Magnanimous : Generous',
      'Cacophony : Noise'
    ],
    correctAnswer: 'Ephemeral : Perennial',
    explanation: 'Paucity (scarcity) and Surplus (abundance) are antonyms. Ephemeral (temporary) and Perennial (everlasting) are exact antonyms.',
    difficulty: 'hard'
  },
  {
    id: 'week-verb-4',
    section: 'verbal',
    type: 'verbal',
    points: 10,
    question: 'Choose the word nearest in opposite meaning to "OBFUSCATE":',
    options: ['Confound', 'Elucidate', 'Shroud', 'Mystify'],
    correctAnswer: 'Elucidate',
    explanation: 'Obfuscate means to make unclear or unintelligible. Elucidate means to make clear and explain lucidly.',
    difficulty: 'medium'
  },
  {
    id: 'week-verb-5',
    section: 'verbal',
    type: 'verbal',
    points: 10,
    question: 'Fill in the blank with the appropriate prepositional phrase: "The production deploy failed ______ the sudden network timeout on the database cluster."',
    options: ['owing to', 'in spite of', 'with reference to', 'in addition to'],
    correctAnswer: 'owing to',
    explanation: '"Owing to" denotes "because of", which correctly explains the cause of the deployment failure.',
    difficulty: 'easy'
  },

  // ─── SECTION 3: DATA STRUCTURES & CODING CHALLENGE (Polyglot) ───
  {
    id: 'week-code-js',
    section: 'coding',
    type: 'coding',
    points: 25,
    language: 'javascript',
    question: 'Two Sum Problem: Write a JavaScript function `twoSum(nums, target)` that returns the indices of the two numbers such that they add up to target. Each input has exactly one solution.',
    codeSnippet: 'function twoSum(nums, target) {\n  // Write your O(n) solution here\n}',
    correctAnswer: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    explanation: 'Use a hash map to look up the complement in O(1) time while iterating through the array once in O(n) time.',
    difficulty: 'hard',
    testCases: [
      { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
      { input: '[3, 2, 4], 6', output: '[1, 2]' }
    ]
  },
  {
    id: 'week-code-py',
    section: 'coding',
    type: 'coding',
    points: 25,
    language: 'python',
    question: 'Longest Unique Substring: Write a Python function `length_of_longest_substring(s)` that finds the length of the longest substring without repeating characters.',
    codeSnippet: 'def length_of_longest_substring(s: str) -> int:\n    # Write your sliding window solution here\n    pass',
    correctAnswer: 'def length_of_longest_substring(s: str) -> int:\n    seen = {}\n    left = max_len = 0\n    for right, char in enumerate(s):\n        if char in seen and seen[char] >= left:\n            left = seen[char] + 1\n        seen[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len',
    explanation: 'Employ a sliding window technique with a hash map recording the most recent index of each character.',
    difficulty: 'hard',
    testCases: [
      { input: '"abcabcbb"', output: '3' },
      { input: '"bbbbb"', output: '1' }
    ]
  },

  {
    id: 'week-code-java',
    section: 'coding',
    type: 'coding',
    points: 25,
    language: 'java',
    question: 'Valid Anagram: Implement a Java method `isAnagram(String s, String t)` that determines if t is an anagram of s in O(n) time.',
    codeSnippet: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n    }\n}',
    correctAnswer: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            count[s.charAt(i) - \'a\']++;\n            count[t.charAt(i) - \'a\']--;\n        }\n        for (int c : count) if (c != 0) return false;\n        return true;\n    }\n}',
    explanation: 'Count character frequencies with a fixed 26-element array and verify all counts balance to 0 in O(n) time and O(1) space.',
    difficulty: 'medium',
    testCases: [
      { input: '"anagram", "nagaram"', output: 'true' },
      { input: '"rat", "car"', output: 'false' }
    ]
  },
  {
    id: 'week-code-cpp',
    section: 'coding',
    type: 'coding',
    points: 25,
    language: 'c++',
    question: 'Kadane\'s Algorithm: Implement an optimal C++ function to find the maximum sum contiguous subarray.',
    codeSnippet: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Write your Kadane\'s algorithm solution here\n}',
    correctAnswer: 'int maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        curSum = max(nums[i], curSum + nums[i]);\n        maxSum = max(maxSum, curSum);\n    }\n    return maxSum;\n}',
    explanation: 'Kadane\'s algorithm maintains current running subarray sum and resets to the current element when it drops below zero, achieving O(n) time.',
    difficulty: 'hard',
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
      { input: '[5,4,-1,7,8]', output: '23' }
    ]
  },
  {
    id: 'week-code-c',
    section: 'coding',
    type: 'coding',
    points: 25,
    language: 'c',
    question: 'Reverse String In-Place: Write a C function `void reverseString(char* s)` that reverses a null-terminated string in-place.',
    codeSnippet: '#include <string.h>\nvoid reverseString(char* s) {\n    // Implement two-pointer swap\n}',
    correctAnswer: 'void reverseString(char* s) {\n    int i = 0, j = strlen(s) - 1;\n    while (i < j) {\n        char temp = s[i];\n        s[i] = s[j];\n        s[j] = temp;\n        i++; j--;\n    }\n}',
    explanation: 'Two-pointer approach swapping characters from both ends until pointers meet in the middle.',
    difficulty: 'medium',
    testCases: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"CareerBridge"', output: '"egdirBreeraC"' }
    ]
  },

  // ─── SECTION 4: SYSTEM DEBUGGING (Real-world production bugs) ───
  {
    id: 'week-debug-js',
    section: 'debugging',
    type: 'debugging',
    points: 25,
    language: 'javascript',
    question: 'Debug the Binary Search function below. Fix the off-by-one bug so it returns the correct target index or -1 if not found.',
    codeSnippet: 'function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length; // BUG: Should be arr.length - 1\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
    correctAnswer: 'function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
    explanation: 'When initializing right = arr.length, accessing arr[mid] when mid = arr.length causes an out-of-bounds error or undefined comparison. Setting right = arr.length - 1 ensures proper boundary indexing.',
    difficulty: 'medium',
    testCases: [
      { input: '[1, 3, 5, 7, 9], 5', output: '2' },
      { input: '[1, 3, 5, 7, 9], 8', output: '-1' }
    ]
  },
  {
    id: 'week-debug-py',
    section: 'debugging',
    type: 'debugging',
    points: 25,
    language: 'python',
    question: 'Fix the Python function below that suffers from a mutable default argument leak bug.',
    codeSnippet: 'def append_to_cache(item, cache=[]):\n    # BUG: mutable default list persists across calls\n    cache.append(item)\n    return cache',
    correctAnswer: 'def append_to_cache(item, cache=None):\n    if cache is None:\n        cache = []\n    cache.append(item)\n    return cache',
    explanation: 'Python default arguments are evaluated once when the function is defined, causing a mutable list default to retain state across multiple invocations. Use cache=None as default sentinel.',
    difficulty: 'medium',
    testCases: [
      { input: '1; append_to_cache(2)', output: '[2]' },
      { input: '"test"', output: '["test"]' }
    ]
  },
  {
    id: 'week-debug-java',
    section: 'debugging',
    type: 'debugging',
    points: 25,
    language: 'java',
    question: 'Fix the reference equality bug in Java String comparison where == is mistakenly used instead of .equals().',
    codeSnippet: 'public boolean checkCredentials(String entered, String actual) {\n    // BUG: Reference comparison instead of content equality\n    return entered == actual;\n}',
    correctAnswer: 'public boolean checkCredentials(String entered, String actual) {\n    if (entered == null) return actual == null;\n    return entered.equals(actual);\n}',
    explanation: 'In Java, the `==` operator compares object references in memory, not string content. String content comparison must use `.equals()`.',
    difficulty: 'easy',
    testCases: [
      { input: 'new String("admin"), "admin"', output: 'true' },
      { input: '"guest", "admin"', output: 'false' }
    ]
  },
  {
    id: 'week-debug-cpp',
    section: 'debugging',
    type: 'debugging',
    points: 25,
    language: 'c++',
    question: 'Fix the iterator invalidation bug in C++ while erasing elements from a vector in a loop.',
    codeSnippet: 'void removeEvens(vector<int>& v) {\n    for (auto it = v.begin(); it != v.end(); it++) {\n        if (*it % 2 == 0) {\n            v.erase(it); // BUG: it is invalidated\n        }\n    }\n}',
    correctAnswer: 'void removeEvens(vector<int>& v) {\n    for (auto it = v.begin(); it != v.end(); ) {\n        if (*it % 2 == 0) {\n            it = v.erase(it);\n        } else {\n            ++it;\n        }\n    }\n}',
    explanation: '`vector::erase()` invalidates the iterator pointing to the erased element and returns a new iterator pointing to the subsequent element. Assigning `it = v.erase(it)` prevents UB.',
    difficulty: 'hard',
    testCases: [
      { input: '[1, 2, 3, 4, 5]', output: '[1, 3, 5]' },
      { input: '[2, 4, 6]', output: '[]' }
    ]
  },
  {
    id: 'week-debug-c',
    section: 'debugging',
    type: 'debugging',
    points: 25,
    language: 'c',
    question: 'Fix the buffer overflow off-by-one bug in the C string copy below that omits the null terminator `\\0`.',
    codeSnippet: 'char* duplicateString(const char* src) {\n    int len = strlen(src);\n    char* dest = (char*)malloc(len); // BUG: Missing +1 for null terminator\n    strcpy(dest, src);\n    return dest;\n}',
    correctAnswer: 'char* duplicateString(const char* src) {\n    int len = strlen(src);\n    char* dest = (char*)malloc(len + 1);\n    if (dest == NULL) return NULL;\n    strcpy(dest, src);\n    return dest;\n}',
    explanation: '`strlen()` returns the number of characters excluding the null terminator byte `\\0`. Memory allocation for C strings must allocate `len + 1` bytes.',
    difficulty: 'medium',
    testCases: [
      { input: '"code"', output: '"code"' }
    ]
  }
];
