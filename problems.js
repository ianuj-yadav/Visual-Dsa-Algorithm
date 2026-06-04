// Complete Problems Database for LeetCode Clone & DSA Visualizer
const PROBLEMS = [
{
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    order: 1,
    problemStatement: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to</em> <code>target</code>.</p><p class='mt-3'>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.<p class='mt-3'>You can return the answer in any order.</p>`,
    examples: [
      {
        id: 0,
        inputText: "nums = [2,7,11,15], target = 9",
        outputText: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        id: 1,
        inputText: "nums = [3,2,4], target = 6",
        outputText: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        id: 2,
        inputText: "nums = [3,3], target = 6",
        outputText: "[0,1]"
      }
    ],
    constraints: `<li class='mt-2'><code>2 ≤ nums.length ≤ 10</code></li> <li class='mt-2'><code>-10 ≤ nums[i] ≤ 10</code></li> <li class='mt-2'><code>-10 ≤ target ≤ 10</code></li><li class='mt-2 text-sm'><strong>Only one valid answer exists.</strong></li>`,
    testCase: {
      input: ["[[2, 7, 11, 15], 9]", "[[3, 2, 4], 6]", "[[3, 3], 6]"],
      output: ["[0, 1]", "[1, 2]", "[0, 1]"]
    },
    videoId: "8-k1C6ehKuw",
    starterCodes: {
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        seen.put(nums[i], i);
    }
    return new int[] {};
}`
    },
    visualization: {
      defaultInput: {
        nums: [2, 7, 11, 15],
        target: 9
      },
      steps: [
        {
          variables: {
            seen: {},
            i: 0,
            complement: 7
          },
          message: "Initialize seen hash map. Loop starts at index 0 (val = 2).",
          line: 2,
          highlight: {
            array: [0]
          }
        },
        {
          variables: {
            seen: {},
            i: 0,
            complement: 7
          },
          message: "Calculate complement: 9 - 2 = 7.",
          line: 4,
          highlight: {
            array: [0]
          }
        },
        {
          variables: {
            seen: {},
            i: 0,
            complement: 7
          },
          message: "Check if complement 7 is in seen map... No.",
          line: 5,
          highlight: {
            array: [0]
          }
        },
        {
          variables: {
            seen: {
              2: 0
            },
            i: 0,
            complement: 7
          },
          message: "Store current number 2 at index 0 in seen map.",
          line: 7,
          highlight: {
            array: [0],
            map: [2]
          }
        },
        {
          variables: {
            seen: {
              2: 0
            },
            i: 1,
            complement: 2
          },
          message: "Move to index 1 (val = 7).",
          line: 2,
          highlight: {
            array: [1]
          }
        },
        {
          variables: {
            seen: {
              2: 0
            },
            i: 1,
            complement: 2
          },
          message: "Calculate complement: 9 - 7 = 2.",
          line: 4,
          highlight: {
            array: [1]
          }
        },
        {
          variables: {
            seen: {
              2: 0
            },
            i: 1,
            complement: 2
          },
          message: "Check if complement 2 is in seen map... Yes, found at index 0!",
          line: 5,
          highlight: {
            array: [1]
          }
        },
        {
          variables: {
            seen: {
              2: 0
            },
            i: 1,
            complement: 2
          },
          message: "Complement found! Return indices [0, 1].",
          line: 6,
          highlight: {
            array: [0, 1],
            map: [2]
          }
        }
      ]
    }
  },
{
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Hard",
    category: "Linked List",
    order: 2,
    problemStatement: `<p class='mt-3'>Given the <code>head</code> of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>`,
    examples: [
      {
        id: 0,
        inputText: "head = [1,2,3,4,5]",
        outputText: "[5,4,3,2,1]"
      },
      {
        id: 1,
        inputText: "head = [1,2,3]",
        outputText: "[3,2,1]"
      },
      {
        id: 2,
        inputText: "head = [1]",
        outputText: "[1]"
      }
    ],
    constraints: `<li class='mt-2'>The number of nodes in the list is the range <code>[0, 5000]</code>.</li><li class='mt-2'><code>-5000 <= Node.val <= 5000</code></li>`,
    testCase: {
      input: ["[2, 7, 11, 15]", "[1,2]", "[0]"],
      output: ["[15, 11, 7, 2]", "[2, 1]", "[0]"]
    },
    videoId: "",
    starterCodes: {
      python: `def reverse_linked_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
      javascript: `function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`
    },
    visualization: {
      defaultInput: {
        head: [1, 2, 3, 4]
      },
      steps: [
        {
          variables: {
            prev: "NULL",
            curr: 1,
            next: "NULL"
          },
          message: "Initialize prev pointer as NULL, curr pointer as head (Node 1).",
          line: 2
        },
        {
          variables: {
            prev: "NULL",
            curr: 1,
            next: 2
          },
          message: "Temporarily store next node: next = curr.next (Node 2).",
          line: 5
        },
        {
          variables: {
            prev: "NULL",
            curr: 1,
            next: 2,
            action: "reverseLink"
          },
          message: "Reverse the link: curr.next = prev (Node 1 now points to NULL).",
          line: 6,
          highlight: {
            reversed: [1]
          }
        },
        {
          variables: {
            prev: 1,
            curr: 1,
            next: 2
          },
          message: "Move prev to current: prev = curr (prev is now Node 1).",
          line: 7,
          highlight: {
            reversed: [1]
          }
        },
        {
          variables: {
            prev: 1,
            curr: 2,
            next: 2
          },
          message: "Move curr to next: curr = next (curr is now Node 2).",
          line: 8,
          highlight: {
            reversed: [1]
          }
        },
        {
          variables: {
            prev: 1,
            curr: 2,
            next: 3
          },
          message: "Store next node: next = curr.next (Node 3).",
          line: 5,
          highlight: {
            reversed: [1]
          }
        },
        {
          variables: {
            prev: 1,
            curr: 2,
            next: 3,
            action: "reverseLink"
          },
          message: "Reverse the link: curr.next = prev (Node 2 now points to Node 1).",
          line: 6,
          highlight: {
            reversed: [1, 2]
          }
        },
        {
          variables: {
            prev: 2,
            curr: 2,
            next: 3
          },
          message: "Move prev to current: prev = Node 2.",
          line: 7,
          highlight: {
            reversed: [1, 2]
          }
        },
        {
          variables: {
            prev: 2,
            curr: 3,
            next: 3
          },
          message: "Move curr to next: curr = Node 3.",
          line: 8,
          highlight: {
            reversed: [1, 2]
          }
        },
        {
          variables: {
            prev: 2,
            curr: 3,
            next: 4
          },
          message: "Store next node: next = Node 4.",
          line: 5,
          highlight: {
            reversed: [1, 2]
          }
        },
        {
          variables: {
            prev: 2,
            curr: 3,
            next: 4,
            action: "reverseLink"
          },
          message: "Reverse the link: curr.next = prev (Node 3 now points to Node 2).",
          line: 6,
          highlight: {
            reversed: [1, 2, 3]
          }
        },
        {
          variables: {
            prev: 3,
            curr: 3,
            next: 4
          },
          message: "Move prev to current: prev = Node 3.",
          line: 7,
          highlight: {
            reversed: [1, 2, 3]
          }
        },
        {
          variables: {
            prev: 3,
            curr: 4,
            next: 4
          },
          message: "Move curr to next: curr = Node 4.",
          line: 8,
          highlight: {
            reversed: [1, 2, 3]
          }
        },
        {
          variables: {
            prev: 3,
            curr: 4,
            next: "NULL"
          },
          message: "Store next node: next = NULL.",
          line: 5,
          highlight: {
            reversed: [1, 2, 3]
          }
        },
        {
          variables: {
            prev: 3,
            curr: 4,
            next: "NULL",
            action: "reverseLink"
          },
          message: "Reverse the link: curr.next = prev (Node 4 now points to Node 3).",
          line: 6,
          highlight: {
            reversed: [1, 2, 3, 4]
          }
        },
        {
          variables: {
            prev: 4,
            curr: 4,
            next: "NULL"
          },
          message: "Move prev to current: prev = Node 4.",
          line: 7,
          highlight: {
            reversed: [1, 2, 3, 4]
          }
        },
        {
          variables: {
            prev: 4,
            curr: "NULL",
            next: "NULL"
          },
          message: "Move curr to next: curr = NULL.",
          line: 8,
          highlight: {
            reversed: [1, 2, 3, 4]
          }
        },
        {
          variables: {
            prev: 4,
            curr: "NULL",
            next: "NULL"
          },
          message: "curr pointer is NULL. Traversal complete. Return new head (prev = Node 4).",
          line: 9,
          highlight: {
            reversed: [1, 2, 3, 4]
          }
        }
      ]
    }
  },
{
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Dynamic Programming",
    order: 3,
    problemStatement: `<p class='mt-3'>You are given an integer array <code>nums</code>. You are initially positioned at the <strong>first index</strong> and each element in the array represents your maximum jump length at that position.</p><p class='mt-3'>Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.</p>`,
    examples: [
      {
        id: 0,
        inputText: "nums = [2,3,1,1,4]",
        outputText: "true",
        explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index."
      },
      {
        id: 1,
        inputText: "nums = [3,2,1,0,4]",
        outputText: "false",
        explanation: `You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.`
      }
    ],
    constraints: `<li class='mt-2'><code>1 <= nums.length <= 10^4</code></li><li class='mt-2'><code>0 <= nums[i] <= 10^5</code></li>`,
    testCase: {
      input: ["[2,3,1,1,4]", "[3,2,1,0,4]"],
      output: ["True", "False"]
    },
    videoId: "",
    starterCodes: {
      python: `def can_jump(nums):
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + jump)
        if max_reach >= len(nums) - 1: return True
    return True`,
      javascript: `function canJump(nums) {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    return true;
}`,
      cpp: `bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.size(); ++i) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
        if (maxReach >= nums.size() - 1) return true;
    }
    return true;
}`,
      java: `public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        if (maxReach >= nums.length - 1) return true;
    }
    return true;
}`
    },
    visualization: {
      defaultInput: {
        nums: [2, 3, 1, 1, 4]
      },
      steps: [
        {
          variables: {
            i: 0,
            max_reach: 0,
            jump: 2
          },
          message: "Initialize max_reach to 0. Start iterating from index 0.",
          line: 2
        },
        {
          variables: {
            i: 0,
            max_reach: 0,
            jump: 2
          },
          message: `Check if current index 0 is unreachable (i > max_reach). No, index 0 is reachable.`,
          line: 4
        },
        {
          variables: {
            i: 0,
            max_reach: 2,
            jump: 2
          },
          message: "Update max_reach: max(0, 0 + nums[0]) = max(0, 2) = 2.",
          line: 5
        },
        {
          variables: {
            i: 0,
            max_reach: 2,
            jump: 2
          },
          message: "Check if max_reach can reach the end (max_reach >= last_index). 2 < 4, not yet.",
          line: 6
        },
        {
          variables: {
            i: 1,
            max_reach: 2,
            jump: 3
          },
          message: "Iterate to index 1 (val = 3).",
          line: 3
        },
        {
          variables: {
            i: 1,
            max_reach: 2,
            jump: 3
          },
          message: "Check if current index 1 is unreachable. No, 1 <= 2.",
          line: 4
        },
        {
          variables: {
            i: 1,
            max_reach: 4,
            jump: 3
          },
          message: "Update max_reach: max(2, 1 + nums[1]) = max(2, 4) = 4.",
          line: 5
        },
        {
          variables: {
            i: 1,
            max_reach: 4,
            jump: 3
          },
          message: "Check if max_reach can reach the end: 4 >= 4. Yes, goal is reachable!",
          line: 6
        },
        {
          variables: {
            i: 1,
            max_reach: 4,
            jump: 3
          },
          message: "Goal is reachable. Return True.",
          line: 7
        }
      ]
    }
  },
{
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    order: 4,
    problemStatement: `<p class='mt-3'>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p> <p class='mt-3'>An input string is valid if:</p> <ul> <li class='mt-2'>Open brackets must be closed by the same type of brackets.</li> <li class='mt-3'>Open brackets must be closed in the correct order.</li><li class='mt-3'>Every close bracket has a corresponding open bracket of the same type. </li></ul>`,
    examples: [
      {
        id: 0,
        inputText: "s = \"()\"",
        outputText: "True"
      },
      {
        id: 1,
        inputText: "s = \"()[]{}\"",
        outputText: "True"
      },
      {
        id: 2,
        inputText: "s = \"(]\"",
        outputText: "False"
      },
      {
        id: 3,
        inputText: "s = \"([)]\"",
        outputText: "False"
      }
    ],
    constraints: `<li class='mt-2'><code>1 <= s.length <= 10<sup>4</sup></code></li><li><code>s</code> consists of parentheses only <code>'()[]{}'</code>.</li>`,
    testCase: {
      input: ["()", "()[]{}", "(]"],
      output: ["True", "True", "False"]
    },
    videoId: "xty7fr-k0TU",
    starterCodes: {
      python: `def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
      javascript: `function isValid(s) {
    const stack = [];
    const mapping = { ')': '(', '}': '{', ']': '[' };
    for (let i = 0; i < s.length; i++) {
        let char = s[i];
        if (mapping[char]) {
            let topElement = stack.length ? stack.pop() : '#';
            if (mapping[char] !== topElement) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> mapping = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (mapping.find(c) != mapping.end()) {
            char topElement = st.empty() ? '#' : st.top();
            if (!st.empty()) st.pop();
            if (mapping[c] != topElement) return false;
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> mapping = new HashMap<>();
    mapping.put(')', '(');
    mapping.put('}', '{');
    mapping.put(']', '[');
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (mapping.containsKey(c)) {
            char topElement = stack.empty() ? '#' : stack.pop();
            if (mapping.get(c) != topElement) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.isEmpty();
}`
    },
    visualization: {
      defaultInput: {
        s: "()[]{}"
      },
      steps: [
        {
          variables: {
            stack: []
          },
          message: "Initialize empty stack. Iterate characters of string.",
          line: 2,
          highlight: {
            charIndex: 0
          }
        },
        {
          variables: {
            stack: ["("]
          },
          message: "Open bracket '(' found. Push to stack.",
          line: 10,
          highlight: {
            charIndex: 0
          }
        },
        {
          variables: {
            stack: ["("]
          },
          message: "Iterate to next character: ')'.",
          line: 4,
          highlight: {
            charIndex: 1
          }
        },
        {
          variables: {
            stack: []
          },
          message: "Close bracket ')' found. Check top of stack. Pop matching open bracket '('.",
          line: 6,
          highlight: {
            charIndex: 1,
            pop: true
          }
        },
        {
          variables: {
            stack: []
          },
          message: "Iterate to next character: '['.",
          line: 4,
          highlight: {
            charIndex: 2
          }
        },
        {
          variables: {
            stack: ["["]
          },
          message: "Push open bracket '[' to stack.",
          line: 10,
          highlight: {
            charIndex: 2
          }
        },
        {
          variables: {
            stack: ["["]
          },
          message: "Iterate to next character: ']'.",
          line: 4,
          highlight: {
            charIndex: 3
          }
        },
        {
          variables: {
            stack: []
          },
          message: "Close bracket ']' found. Pop matching open bracket '[' from stack.",
          line: 6,
          highlight: {
            charIndex: 3,
            pop: true
          }
        },
        {
          variables: {
            stack: []
          },
          message: "Iterate to next character: '{'.",
          line: 4,
          highlight: {
            charIndex: 4
          }
        },
        {
          variables: {
            stack: ["{"]
          },
          message: "Push open bracket '{' to stack.",
          line: 10,
          highlight: {
            charIndex: 4
          }
        },
        {
          variables: {
            stack: ["{"]
          },
          message: "Iterate to next character: '}'.",
          line: 4,
          highlight: {
            charIndex: 5
          }
        },
        {
          variables: {
            stack: []
          },
          message: "Close bracket '}' found. Pop matching open bracket '{' from stack.",
          line: 6,
          highlight: {
            charIndex: 5,
            pop: true
          }
        },
        {
          variables: {
            stack: []
          },
          message: "All characters processed. Stack is empty. Return True.",
          line: 11,
          highlight: {
            charIndex: -1
          }
        }
      ]
    }
  },
{
    id: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Binary Search",
    order: 5,
    problemStatement: `<p class='mt-3'>Write an efficient algorithm that searches for a value in an <code>m x n</code> matrix. This matrix has the following properties:</p><li class='mt-3'>Integers in each row are sorted from left to right.</li><li class='mt-3'>The first integer of each row is greater than the last integer of the previous row.</li><p class='mt-3'>Given <code>matrix</code>, an <code>m x n</code> matrix, and <code>target</code>, return <code>true</code> if <code>target</code> is in the matrix, and <code>false</code> otherwise.</p>`,
    examples: [
      {
        id: 0,
        inputText: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        outputText: "true"
      },
      {
        id: 1,
        inputText: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
        outputText: "false"
      },
      {
        id: 2,
        inputText: "matrix = [[1]], target = 1",
        outputText: "true"
      }
    ],
    constraints: `<li class='mt-2'><code>m == matrix.length</code></li><li class='mt-2'><code>n == matrix[i].length</code></li><li class='mt-2'><code>1 <= m, n <= 100</code></li><li class='mt-2'><code>-10<sup>4</sup> <= matrix[i][j], target <= 10<sup>4</sup></code></li>`,
    testCase: {
      input: ["[[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3]", "[[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13]"],
      output: ["True", "False"]
    },
    videoId: "ZfFl4torNg4",
    starterCodes: {
      python: `def search_matrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    low, high = 0, m * n - 1
    while low <= high:
        mid = (low + high) // 2
        mid_val = matrix[mid // n][mid % n]
        if mid_val == target:
            return True
        elif mid_val < target:
            low = mid + 1
        else:
            high = mid - 1
    return False`,
      javascript: `function searchMatrix(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    let m = matrix.length, n = matrix[0].length;
    let low = 0, high = m * n - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        let midVal = matrix[Math.floor(mid / n)][mid % n];
        if (midVal === target) return true;
        else if (midVal < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}`,
      cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    if (matrix.empty() || matrix[0].empty()) return false;
    int m = matrix.size(), n = matrix[0].size();
    int low = 0, high = m * n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int midVal = matrix[mid / n][mid % n];
        if (midVal == target) return true;
        else if (midVal < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}`,
      java: `public boolean searchMatrix(int[][] matrix, int target) {
    if (matrix.length == 0 || matrix[0].length == 0) return false;
    int m = matrix.length, n = matrix[0].length;
    int low = 0, high = m * n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int midVal = matrix[mid / n][mid % n];
        if (midVal == target) return true;
        else if (midVal < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}`
    },
    visualization: {
      defaultInput: {
        matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]],
        target: 3
      },
      steps: [
        {
          variables: {
            low: 0,
            high: 11,
            mid: -1
          },
          message: "Initialize binary search bounds. low = 0, high = 11 (12 elements).",
          line: 4
        },
        {
          variables: {
            low: 0,
            high: 11,
            mid: 5
          },
          message: "Calculate mid index: (0 + 11) // 2 = 5. Value is matrix[1][1] = 11.",
          line: 6
        },
        {
          variables: {
            low: 0,
            high: 11,
            mid: 5
          },
          message: "Check if matrix[mid] == target (11 == 3). No.",
          line: 7
        },
        {
          variables: {
            low: 0,
            high: 11,
            mid: 5
          },
          message: "Check if matrix[mid] > target (11 > 3). Yes, target is in left half.",
          line: 9
        },
        {
          variables: {
            low: 0,
            high: 4,
            mid: 5
          },
          message: "Update bounds: high = mid - 1 = 4.",
          line: 12
        },
        {
          variables: {
            low: 0,
            high: 4,
            mid: 2
          },
          message: "Calculate mid index: (0 + 4) // 2 = 2. Value is matrix[0][2] = 5.",
          line: 6
        },
        {
          variables: {
            low: 0,
            high: 4,
            mid: 2
          },
          message: "Check if matrix[mid] == target (5 == 3). No.",
          line: 7
        },
        {
          variables: {
            low: 0,
            high: 4,
            mid: 2
          },
          message: "Check if matrix[mid] > target (5 > 3). Yes, target is in left half.",
          line: 9
        },
        {
          variables: {
            low: 0,
            high: 1,
            mid: 2
          },
          message: "Update bounds: high = mid - 1 = 1.",
          line: 12
        },
        {
          variables: {
            low: 0,
            high: 1,
            mid: 0
          },
          message: "Calculate mid index: (0 + 1) // 2 = 0. Value is matrix[0][0] = 1.",
          line: 6
        },
        {
          variables: {
            low: 0,
            high: 1,
            mid: 0
          },
          message: "Check if matrix[mid] == target (1 == 3). No.",
          line: 7
        },
        {
          variables: {
            low: 0,
            high: 1,
            mid: 0
          },
          message: "Check if matrix[mid] > target (1 > 3). No.",
          line: 9
        },
        {
          variables: {
            low: 1,
            high: 1,
            mid: 0
          },
          message: "Update bounds: low = mid + 1 = 1.",
          line: 10
        },
        {
          variables: {
            low: 1,
            high: 1,
            mid: 1
          },
          message: "Calculate mid index: (1 + 1) // 2 = 1. Value is matrix[0][1] = 3.",
          line: 6
        },
        {
          variables: {
            low: 1,
            high: 1,
            mid: 1
          },
          message: "Check if matrix[mid] == target (3 == 3). Yes, found!",
          line: 7
        },
        {
          variables: {
            low: 1,
            high: 1,
            mid: 1
          },
          message: "Target found at index 1. Return True.",
          line: 8
        }
      ]
    }
  },
{
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    order: 6,
    problemStatement: `<p class='mt-3'>You are given an integer array <code>height</code> of length <code>n</code>. There are n vertical lines drawn such that the two endpoints of the <code>ith</code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.<br>Find two lines that together with the x-axis form a container, such that the container contains the most water.<br>Return the maximum amount of water a container can store.<br><b>Notice</b> that you may not slant the container.</p>`,
    examples: [
      {
        id: 0,
        inputText: "height = [1,8,6,2,5,4,8,3,7]",
        explanation: `The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.`,
        outputText: "49"
      },
      {
        id: 1,
        inputText: "height = [1,1]",
        outputText: "1"
      }
    ],
    constraints: `<li class='mt-2'><code>n == height.length</code></li><li class='mt-2'><code>2 <= n <= 10^5</code></li><li class='mt-2'><code>0 <= height[i] <= 10<sup>4</sup></code></li>`,
    testCase: {
      input: ["[1, 8, 6, 2, 5, 4, 8, 3, 7]", "[1,1]"],
      output: ["49", "1"]
    },
    videoId: "",
    starterCodes: {
      python: `def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      javascript: `function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxWater = 0;
    while (left < right) {
        let width = right - left;
        let h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, width * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`,
      cpp: `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxWater = 0;
    while (left < right) {
        int width = right - left;
        int h = min(height[left], height[right]);
        maxWater = max(maxWater, width * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`,
      java: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    while (left < right) {
        int width = right - left;
        int h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, width * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`
    },
    visualization: {
      defaultInput: {
        height: [1, 8, 6, 2, 5, 4, 8, 3, 7]
      },
      steps: [
        {
          variables: {
            left: 0,
            right: 8,
            max_water: 0
          },
          message: "Initialize left pointer at 0, right pointer at 8, max_water at 0.",
          line: 2
        },
        {
          variables: {
            left: 0,
            right: 8,
            max_water: 0,
            width: 8,
            h: 1
          },
          message: "Calculate water: height is min(1, 7) = 1, width is 8. Area = 8.",
          line: 5,
          highlight: {
            fill: [0, 8]
          }
        },
        {
          variables: {
            left: 0,
            right: 8,
            max_water: 8,
            width: 8,
            h: 1
          },
          message: "Update max_water to max(0, 8) = 8.",
          line: 7,
          highlight: {
            fill: [0, 8]
          }
        },
        {
          variables: {
            left: 1,
            right: 8,
            max_water: 8
          },
          message: "Since height[left] < height[right] (1 < 7), increment left pointer.",
          line: 9
        },
        {
          variables: {
            left: 1,
            right: 8,
            max_water: 8,
            width: 7,
            h: 7
          },
          message: "Calculate water: height is min(8, 7) = 7, width is 7. Area = 49.",
          line: 5,
          highlight: {
            fill: [1, 8]
          }
        },
        {
          variables: {
            left: 1,
            right: 8,
            max_water: 49,
            width: 7,
            h: 7
          },
          message: "Update max_water to max(8, 49) = 49.",
          line: 7,
          highlight: {
            fill: [1, 8]
          }
        },
        {
          variables: {
            left: 1,
            right: 7,
            max_water: 49
          },
          message: "Since height[left] >= height[right] (8 >= 7), decrement right pointer.",
          line: 11
        },
        {
          variables: {
            left: 1,
            right: 7,
            max_water: 49,
            width: 6,
            h: 3
          },
          message: "Calculate water: height is min(8, 3) = 3, width is 6. Area = 18.",
          line: 5,
          highlight: {
            fill: [1, 7]
          }
        },
        {
          variables: {
            left: 1,
            right: 7,
            max_water: 49,
            width: 6,
            h: 3
          },
          message: "max_water remains 49.",
          line: 7,
          highlight: {
            fill: [1, 7]
          }
        },
        {
          variables: {
            left: 1,
            right: 6,
            max_water: 49
          },
          message: "Since height[left] >= height[right] (8 >= 3), decrement right pointer.",
          line: 11
        },
        {
          variables: {
            left: 1,
            right: 6,
            max_water: 49,
            width: 5,
            h: 8
          },
          message: "Calculate water: height is min(8, 8) = 8, width is 5. Area = 40.",
          line: 5,
          highlight: {
            fill: [1, 6]
          }
        },
        {
          variables: {
            left: 1,
            right: 6,
            max_water: 49,
            width: 5,
            h: 8
          },
          message: "max_water remains 49.",
          line: 7,
          highlight: {
            fill: [1, 6]
          }
        },
        {
          variables: {
            left: 2,
            right: 6,
            max_water: 49
          },
          message: "Move left pointer.",
          line: 9
        },
        {
          variables: {
            left: 2,
            right: 6,
            max_water: 49,
            width: 4,
            h: 6
          },
          message: "Calculate water: Area = min(6, 8) * 4 = 24.",
          line: 5,
          highlight: {
            fill: [2, 6]
          }
        },
        {
          variables: {
            left: 3,
            right: 6,
            max_water: 49
          },
          message: "Move left pointer since height[left] < height[right].",
          line: 9
        },
        {
          variables: {
            left: 3,
            right: 6,
            max_water: 49,
            width: 3,
            h: 2
          },
          message: "Calculate water: Area = min(2, 8) * 3 = 6.",
          line: 5,
          highlight: {
            fill: [3, 6]
          }
        },
        {
          variables: {
            left: 4,
            right: 6,
            max_water: 49
          },
          message: "Move left pointer.",
          line: 9
        },
        {
          variables: {
            left: 4,
            right: 6,
            max_water: 49,
            width: 2,
            h: 5
          },
          message: "Calculate water: Area = min(5, 8) * 2 = 10.",
          line: 5,
          highlight: {
            fill: [4, 6]
          }
        },
        {
          variables: {
            left: 5,
            right: 6,
            max_water: 49
          },
          message: "Move left pointer.",
          line: 9
        },
        {
          variables: {
            left: 5,
            right: 6,
            max_water: 49,
            width: 1,
            h: 4
          },
          message: "Calculate water: Area = min(4, 8) * 1 = 4.",
          line: 5,
          highlight: {
            fill: [5, 6]
          }
        },
        {
          variables: {
            left: 6,
            right: 6,
            max_water: 49
          },
          message: "Pointers meet. Return max_water = 49.",
          line: 12
        }
      ]
    }
  },
{
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Intervals",
    order: 7,
    problemStatement: `<p class='mt-3'>Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>`,
    examples: [
      {
        id: 0,
        inputText: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
        outputText: "[[1,6],[8,10],[15,18]]"
      },
      {
        id: 1,
        inputText: "intervals = [[1,4],[4,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
        outputText: "[[1,5]]"
      }
    ],
    constraints: `<li class='mt-2'><code>1 <= intervals.length <= 10<sup>4</sup></code></li><li class='mt-2'><code>intervals[i].length == 2</code></li><li class='mt-2'><code>0 <= start<sub>i</sub> <= end<sub>i</sub> <= 10<sup>4</sup></code></li>`,
    testCase: {
      input: ["[[1, 3], [2, 6], [8, 10], [15, 18]]", "[[1, 4], [4, 5]]"],
      output: ["[[1, 6], [8, 10], [15, 18]]", "[[1, 5]]"]
    },
    videoId: "",
    starterCodes: {
      python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    current = intervals[0]
    for next_interval in intervals[1:]:
        if next_interval[0] <= current[1]:
            current[1] = max(current[1], next_interval[1])
        else:
            merged.append(current)
            current = next_interval
    merged.append(current)
    return merged`,
      javascript: `function merge(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [];
    let current = intervals[0];
    for (let i = 1; i < intervals.length; i++) {
        let nextInterval = intervals[i];
        if (nextInterval[0] <= current[1]) {
            current[1] = Math.max(current[1], nextInterval[1]);
        } else {
            merged.push(current);
            current = nextInterval;
        }
    }
    merged.push(current);
    return merged;
}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    vector<int> current = intervals[0];
    for (int i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] <= current[1]) {
            current[1] = max(current[1], intervals[i][1]);
        } else {
            merged.push_back(current);
            current = intervals[i];
        }
    }
    merged.push_back(current);
    return merged;
}`,
      java: `public int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][0];
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    int[] current = intervals[0];
    for (int i = 1; i < intervals.length; i++) {
        int[] nextInterval = intervals[i];
        if (nextInterval[0] <= current[1]) {
            current[1] = Math.max(current[1], nextInterval[1]);
        } else {
            merged.add(current);
            current = nextInterval;
        }
    }
    merged.add(current);
    return merged.toArray(new int[merged.size()][]);
}`
    },
    visualization: {
      defaultInput: {
        intervals: [[1, 3], [2, 6], [8, 10], [15, 18]]
      },
      steps: [
        {
          variables: {
            merged: "[]",
            current: "null"
          },
          message: "Sort intervals by start time. Initialize empty merged list.",
          line: 2
        },
        {
          variables: {
            merged: "[]",
            current: "[1,3]"
          },
          message: "Start with first interval [1, 3].",
          line: 4
        },
        {
          variables: {
            merged: "[]",
            current: "[1,3]"
          },
          message: "Iterate to interval [2, 6].",
          line: 5
        },
        {
          variables: {
            merged: "[]",
            current: "[1,3]"
          },
          message: "Check for overlap between [1, 3] and [2, 6]. 2 <= 3, yes! Overlap found.",
          line: 6,
          highlight: {
            overlap: true
          }
        },
        {
          variables: {
            merged: "[]",
            current: "[1,6]"
          },
          message: "Merge intervals: update end to max(3, 6) = 6. Current interval is now [1, 6].",
          line: 7
        },
        {
          variables: {
            merged: "[]",
            current: "[1,6]"
          },
          message: "Iterate to next interval [8, 10].",
          line: 5
        },
        {
          variables: {
            merged: "[]",
            current: "[1,6]"
          },
          message: "Check for overlap between [1, 6] and [8, 10]. 8 > 6, no overlap.",
          line: 6,
          highlight: {
            overlap: false
          }
        },
        {
          variables: {
            merged: "[[1,6]]",
            current: "[8,10]"
          },
          message: `No overlap. Append current interval [1, 6] to merged list, and set current to [8, 10].`,
          line: 9
        },
        {
          variables: {
            merged: "[[1,6]]",
            current: "[8,10]"
          },
          message: "Iterate to next interval [15, 18].",
          line: 5
        },
        {
          variables: {
            merged: "[[1,6]]",
            current: "[8,10]"
          },
          message: "Check for overlap between [8, 10] and [15, 18]. 15 > 10, no overlap.",
          line: 6,
          highlight: {
            overlap: false
          }
        },
        {
          variables: {
            merged: "[[1,6],[8,10]]",
            current: "[15,18]"
          },
          message: "Append [8, 10] to merged, and set current to [15, 18].",
          line: 9
        },
        {
          variables: {
            merged: "[[1,6],[8,10],[15,18]]",
            current: "null"
          },
          message: "No more intervals. Append the last interval [15, 18] to merged.",
          line: 11
        },
        {
          variables: {
            merged: "[[1,6],[8,10],[15,18]]"
          },
          message: "Return merged list: [[1, 6], [8, 10], [15, 18]].",
          line: 12
        }
      ]
    }
  },
{
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    order: 8,
    problemStatement: `<p class='mt-3'>Given the <code>root</code> of a binary tree, return <i>its maximum depth.</i><br> A binary tree's <b>maximum</b> depth is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>`,
    examples: [
      {
        id: 0,
        inputText: "root = [3,9,20,null,null,15,7]",
        outputText: "3"
      },
      {
        id: 1,
        inputText: "root = [1,null,2]",
        outputText: "2"
      }
    ],
    constraints: `<li class='mt-2'>The number of nodes in the tree is in the range <code>[0, 10<sup>4</sup>]</code></li><li class='mt-2'><code>-100 <= Node.val <= 100</code></li>`,
    testCase: {
      input: ["[3, 9, 20, None, None, 15, 7]", "[1,None,2]"],
      output: ["3", "2"]
    },
    videoId: "4qYTqOiRMoM",
    starterCodes: {
      python: `def max_depth(root):
    if not root:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return max(left_depth, right_depth) + 1`,
      javascript: `function maxDepth(root) {
    if (!root) return 0;
    let leftDepth = maxDepth(root.left);
    let rightDepth = maxDepth(root.right);
    return Math.max(leftDepth, rightDepth) + 1;
}`,
      cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    int leftDepth = maxDepth(root->left);
    int rightDepth = maxDepth(root->right);
    return max(leftDepth, rightDepth) + 1;
}`,
      java: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    int leftDepth = maxDepth(root.left);
    int rightDepth = maxDepth(root.right);
    return Math.max(leftDepth, rightDepth) + 1;
}`
    },
    visualization: {
      defaultInput: {
        root: [3, 9, 20, "null", "null", 15, 7]
      },
      steps: [
        {
          variables: {
            node: 3
          },
          message: "Recursively calculate depth. Current node is 3.",
          line: 2
        },
        {
          variables: {
            node: 9
          },
          message: "Move to left child of 3 (Node 9).",
          line: 4,
          highlight: {
            node: 3,
            path: "left"
          }
        },
        {
          variables: {
            node: "None"
          },
          message: "Move to left child of 9 (NULL). Return depth 0.",
          line: 2,
          highlight: {
            node: 9,
            path: "left"
          }
        },
        {
          variables: {
            node: 9,
            left_depth: 0
          },
          message: "Returned 0 for Node 9 left child.",
          line: 4
        },
        {
          variables: {
            node: "None"
          },
          message: "Move to right child of 9 (NULL). Return depth 0.",
          line: 2,
          highlight: {
            node: 9,
            path: "right"
          }
        },
        {
          variables: {
            node: 9,
            left_depth: 0,
            right_depth: 0
          },
          message: "Returned 0 for Node 9 right child.",
          line: 5
        },
        {
          variables: {
            node: 9,
            left_depth: 0,
            right_depth: 0
          },
          message: "Calculate depth for Node 9: max(0, 0) + 1 = 1. Return 1.",
          line: 6,
          highlight: {
            finalDepth: 1,
            node: 9
          }
        },
        {
          variables: {
            node: 3,
            left_depth: 1
          },
          message: "Returned 1 for Node 3 left child.",
          line: 4
        },
        {
          variables: {
            node: 20
          },
          message: "Move to right child of 3 (Node 20).",
          line: 5,
          highlight: {
            node: 3,
            path: "right"
          }
        },
        {
          variables: {
            node: 15
          },
          message: "Move to left child of 20 (Node 15).",
          line: 4,
          highlight: {
            node: 20,
            path: "left"
          }
        },
        {
          variables: {
            node: 15,
            left_depth: 0,
            right_depth: 0
          },
          message: "Node 15 has no children. Depth is 1. Return 1.",
          line: 6,
          highlight: {
            finalDepth: 1,
            node: 15
          }
        },
        {
          variables: {
            node: 20,
            left_depth: 1
          },
          message: "Returned 1 for Node 20 left child.",
          line: 4
        },
        {
          variables: {
            node: 7
          },
          message: "Move to right child of 20 (Node 7).",
          line: 5,
          highlight: {
            node: 20,
            path: "right"
          }
        },
        {
          variables: {
            node: 7,
            left_depth: 0,
            right_depth: 0
          },
          message: "Node 7 has no children. Depth is 1. Return 1.",
          line: 6,
          highlight: {
            finalDepth: 1,
            node: 7
          }
        },
        {
          variables: {
            node: 20,
            left_depth: 1,
            right_depth: 1
          },
          message: "Returned 1 for Node 20 right child.",
          line: 5
        },
        {
          variables: {
            node: 20,
            left_depth: 1,
            right_depth: 1
          },
          message: "Calculate depth for Node 20: max(1, 1) + 1 = 2. Return 2.",
          line: 6,
          highlight: {
            finalDepth: 2,
            node: 20
          }
        },
        {
          variables: {
            node: 3,
            left_depth: 1,
            right_depth: 2
          },
          message: "Returned 2 for Node 3 right child.",
          line: 5
        },
        {
          variables: {
            node: 3,
            left_depth: 1,
            right_depth: 2
          },
          message: "Calculate final depth for root Node 3: max(1, 2) + 1 = 3. Return 3.",
          line: 6,
          highlight: {
            finalDepth: 3,
            node: 3
          }
        }
      ]
    }
  },
{
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    order: 9,
    problemStatement: `<p class='mt-3'>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.<br>You want to maximize your profit by choosing a <b>single day</b> to buy one stock and choosing a <b>different day in the future</b> to sell that stock.<br>Return <i>the maximum profit you can achieve from this transaction.</i> If you cannot achieve any profit, return <code>0</code>.</p>`,
    examples: [
      {
        id: 0,
        inputText: "prices = [7,1,5,3,6,4]",
        explanation: `Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.`,
        outputText: "5"
      },
      {
        id: 1,
        inputText: "prices = [7,6,4,3,1]",
        explanation: "In this case, no transactions are done and the max profit = 0.",
        outputText: "0"
      }
    ],
    constraints: `<li class='mt-2'><code>1 <= prices.length <= 10<sup>5</sup></code></li><li class='mt-2'><code>0 <= prices[i] <= 10<sup>4</sup></code></li>`,
    testCase: {
      input: ["[7, 1, 5, 3, 6, 4]", "[7,6,4,3,1]"],
      output: ["5", "0"]
    },
    videoId: "",
    starterCodes: {
      python: `def max_profit(prices):
    min_price = prices[0]
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    # End of loop
    return max_profit`,
      javascript: `function maxProfit(prices) {
    if (!prices.length) return 0;
    let minPrice = prices[0];
    let maxProfit = 0;
    for (let i = 0; i < prices.length; i++) {
        minPrice = Math.min(minPrice, prices[i]);
        maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
    return maxProfit;
}`,
      cpp: `int maxProfit(vector<int>& prices) {
    if (prices.empty()) return 0;
    int minPrice = prices[0];
    int maxProfit = 0;
    for (int price : prices) {
        minPrice = min(minPrice, price);
        maxProfit = max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`,
      java: `public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;
    int minPrice = prices[0];
    int maxProfit = 0;
    for (int i = 0; i < prices.length; i++) {
        minPrice = Math.min(minPrice, prices[i]);
        maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
    return maxProfit;
}`
    },
    visualization: {
      defaultInput: {
        prices: [7, 1, 5, 3, 6, 4]
      },
      steps: [
        {
          variables: {
            min_price: 7,
            max_profit: 0
          },
          message: "Initialize min_price to first price (7) and max_profit to 0.",
          line: 2,
          highlight: {
            current_idx: -1,
            min_idx: -1
          }
        },
        {
          variables: {
            min_price: 7,
            max_profit: 0
          },
          message: "Iterate day 1 (price = 7). Update min_price to min(7, 7) = 7.",
          line: 5,
          highlight: {
            current_idx: 0,
            min_idx: 0
          }
        },
        {
          variables: {
            min_price: 7,
            max_profit: 0
          },
          message: "Calculate profit: 7 - 7 = 0. max_profit remains 0.",
          line: 6,
          highlight: {
            current_idx: 0,
            min_idx: 0
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 0
          },
          message: "Iterate day 2 (price = 1). Update min_price to min(7, 1) = 1.",
          line: 5,
          highlight: {
            current_idx: 1,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 0
          },
          message: "Calculate profit: 1 - 1 = 0. max_profit remains 0.",
          line: 6,
          highlight: {
            current_idx: 1,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 0
          },
          message: "Iterate day 3 (price = 5). min_price remains 1.",
          line: 5,
          highlight: {
            current_idx: 2,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 4
          },
          message: "Calculate potential profit: 5 - 1 = 4. Update max_profit to max(0, 4) = 4.",
          line: 6,
          highlight: {
            current_idx: 2,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 4
          },
          message: "Iterate day 4 (price = 3). min_price remains 1.",
          line: 5,
          highlight: {
            current_idx: 3,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 4
          },
          message: "Calculate potential profit: 3 - 1 = 2. max_profit remains 4.",
          line: 6,
          highlight: {
            current_idx: 3,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 4
          },
          message: "Iterate day 5 (price = 6). min_price remains 1.",
          line: 5,
          highlight: {
            current_idx: 4,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 5
          },
          message: "Calculate potential profit: 6 - 1 = 5. Update max_profit to max(4, 5) = 5.",
          line: 6,
          highlight: {
            current_idx: 4,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 5
          },
          message: "Iterate day 6 (price = 4). min_price remains 1.",
          line: 5,
          highlight: {
            current_idx: 5,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 5
          },
          message: "Calculate potential profit: 4 - 1 = 3. max_profit remains 5.",
          line: 6,
          highlight: {
            current_idx: 5,
            min_idx: 1
          }
        },
        {
          variables: {
            min_price: 1,
            max_profit: 5
          },
          message: "Iteration complete. Return max_profit = 5.",
          line: 8,
          highlight: {
            current_idx: -1,
            min_idx: 1
          }
        }
      ]
    }
  },
{
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    order: 10,
    problemStatement: `<p class='mt-3'>Given an integer array nums of unique elements, return <i>all possible <span class='text-sky-400'>subsets</span> (the power set).</i> The solution set <b>must not</b> contain duplicate subsets. Return the solution in <b>any order.</b></p>`,
    examples: [
      {
        id: 0,
        inputText: "nums = [1,2,3]",
        outputText: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"
      },
      {
        id: 1,
        inputText: "nums = [0]",
        outputText: "[[],[0]]"
      }
    ],
    constraints: `<li class='mt-2'><code>1 <= nums.length <= 10</code></li><li class='mt-2'><code>-10 <= nums[i] <= 10</code></li><li class='mt-2'>All the numbers of <code>nums</code> are <b>unique</b>.</li>`,
    testCase: {
      input: ["[1,2,3]", "[0]"],
      output: ["[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]", "[[], [0]]"]
    },
    videoId: "",
    starterCodes: {
      python: `def subsets(nums):
    result = []
    # backtrack function
    def backtrack(start, path):
        result.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    # return
    return result`,
      javascript: `function subsets(nums) {
    const result = [];
    function backtrack(start, path) {
        result.push([...path]);
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    backtrack(0, []);
    return result;
}`,
      cpp: `void backtrack(int start, vector<int>& path, vector<int>& nums, vector<vector<int>>& result) {
    result.push_back(path);
    for (int i = start; i < nums.size(); ++i) {
        path.push_back(nums[i]);
        backtrack(i + 1, path, nums, result);
        path.pop_back();
    }
}
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> path;
    backtrack(0, path, nums, result);
    return result;
}`,
      java: `private void backtrack(int start, List<Integer> path, int[] nums, List<List<Integer>> result) {
    result.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(i + 1, path, nums, result);
        path.remove(path.size() - 1);
    }
}
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(0, new ArrayList<>(), nums, result);
    return result;
}`
    },
    visualization: {
      defaultInput: {
        nums: [1, 2, 3]
      },
      steps: [
        {
          variables: {
            path: [],
            result: "[]"
          },
          message: "Initialize empty subsets list and call backtrack(0, []).",
          line: 2
        },
        {
          variables: {
            path: [],
            result: "[[]]"
          },
          message: "Base step: append copy of path [] to result list.",
          line: 5,
          highlight: {
            added: []
          }
        },
        {
          variables: {
            path: [],
            result: "[[]]"
          },
          message: "Loop from index 0 to 2.",
          line: 6
        },
        {
          variables: {
            path: [1],
            result: "[[]]"
          },
          message: "Choose element at index 0 (val = 1). Push to path.",
          line: 7
        },
        {
          variables: {
            path: [1],
            result: "[[]]"
          },
          message: "Recurse: backtrack(1, [1]).",
          line: 8
        },
        {
          variables: {
            path: [1],
            result: "[[],[1]]"
          },
          message: "Append copy of path [1] to result.",
          line: 5,
          highlight: {
            added: [1]
          }
        },
        {
          variables: {
            path: [1],
            result: "[[],[1]]"
          },
          message: "Loop from index 1 to 2.",
          line: 6
        },
        {
          variables: {
            path: [1, 2],
            result: "[[],[1]]"
          },
          message: "Choose element at index 1 (val = 2). Push to path.",
          line: 7
        },
        {
          variables: {
            path: [1, 2],
            result: "[[],[1]]"
          },
          message: "Recurse: backtrack(2, [1,2]).",
          line: 8
        },
        {
          variables: {
            path: [1, 2],
            result: "[[],[1],[1,2]]"
          },
          message: "Append copy of path [1,2] to result.",
          line: 5,
          highlight: {
            added: [1, 2]
          }
        },
        {
          variables: {
            path: [1, 2],
            result: "[[],[1],[1,2]]"
          },
          message: "Loop from index 2 to 2.",
          line: 6
        },
        {
          variables: {
            path: [1, 2, 3],
            result: "[[],[1],[1,2]]"
          },
          message: "Choose element at index 2 (val = 3). Push to path.",
          line: 7
        },
        {
          variables: {
            path: [1, 2, 3],
            result: "[[],[1],[1,2]]"
          },
          message: "Recurse: backtrack(3, [1,2,3]).",
          line: 8
        },
        {
          variables: {
            path: [1, 2, 3],
            result: "[[],[1],[1,2],[1,2,3]]"
          },
          message: "Append copy of path [1,2,3] to result.",
          line: 5,
          highlight: {
            added: [1, 2, 3]
          }
        },
        {
          variables: {
            path: [1, 2, 3],
            result: "[[],[1],[1,2],[1,2,3]]"
          },
          message: "Loop at index 3. Out of bounds. Backtrack.",
          line: 6
        },
        {
          variables: {
            path: [1, 2],
            result: "[[],[1],[1,2],[1,2,3]]"
          },
          message: "Pop last element from path: backtrack to [1,2].",
          line: 9
        },
        {
          variables: {
            path: [1],
            result: "[[],[1],[1,2],[1,2,3]]"
          },
          message: "Loop at index 2 for backtrack(2) finished. Pop last element: backtrack to [1].",
          line: 9
        },
        {
          variables: {
            path: [1, 3],
            result: "[[],[1],[1,2],[1,2,3]]"
          },
          message: "Choose element at index 2 (val = 3). Push to path.",
          line: 7
        },
        {
          variables: {
            path: [1, 3],
            result: "[[],[1],[1,2],[1,2,3]]"
          },
          message: "Recurse: backtrack(3, [1,3]).",
          line: 8
        },
        {
          variables: {
            path: [1, 3],
            result: "[[],[1],[1,2],[1,2,3],[1,3]]"
          },
          message: "Append copy of path [1,3] to result.",
          line: 5,
          highlight: {
            added: [1, 3]
          }
        },
        {
          variables: {
            path: [1],
            result: "[[],[1],[1,2],[1,2,3],[1,3]]"
          },
          message: "Pop last element: backtrack to [1].",
          line: 9
        },
        {
          variables: {
            path: [],
            result: "[[],[1],[1,2],[1,2,3],[1,3]]"
          },
          message: "Loop at index 0 finished. Pop last element: backtrack to [].",
          line: 9
        },
        {
          variables: {
            path: [2],
            result: "[[],[1],[1,2],[1,2,3],[1,3]]"
          },
          message: "Choose element at index 1 (val = 2). Push to path.",
          line: 7
        },
        {
          variables: {
            path: [2],
            result: "[[],[1],[1,2],[1,2,3],[1,3]]"
          },
          message: "Recurse: backtrack(2, [2]).",
          line: 8
        },
        {
          variables: {
            path: [2],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2]]"
          },
          message: "Append copy of path [2] to result.",
          line: 5,
          highlight: {
            added: [2]
          }
        },
        {
          variables: {
            path: [2, 3],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2]]"
          },
          message: "Choose element at index 2 (val = 3). Push to path.",
          line: 7
        },
        {
          variables: {
            path: [2, 3],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2]]"
          },
          message: "Recurse: backtrack(3, [2,3]).",
          line: 8
        },
        {
          variables: {
            path: [2, 3],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3]]"
          },
          message: "Append copy of path [2,3] to result.",
          line: 5,
          highlight: {
            added: [2, 3]
          }
        },
        {
          variables: {
            path: [],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3]]"
          },
          message: "Pop elements from path back to [].",
          line: 9
        },
        {
          variables: {
            path: [3],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3]]"
          },
          message: "Choose element at index 2 (val = 3). Push to path.",
          line: 7
        },
        {
          variables: {
            path: [3],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3]]"
          },
          message: "Recurse: backtrack(3, [3]).",
          line: 8
        },
        {
          variables: {
            path: [3],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]"
          },
          message: "Append copy of path [3] to result.",
          line: 5,
          highlight: {
            added: [3]
          }
        },
        {
          variables: {
            path: [],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]"
          },
          message: "Pop last element: backtrack to [].",
          line: 9
        },
        {
          variables: {
            path: [],
            result: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3],[1,2]]"
          },
          message: "Return final subsets result list.",
          line: 12
        }
      ]
    }
  },
{
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array",
    order: 16,
    problemStatement: `Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.`,
    examples: [
      {
        id: 1,
        inputText: "nums = [1, 2, 3, 1]",
        outputText: "true"
      },
      {
        id: 2,
        inputText: "nums = [1, 2, 3, 4]",
        outputText: "false"
      }
    ],
    constraints: `<li><code>1 <= nums.length <= 10</code></li><li><code>-10 <= nums[i] <= 10</code></li>`,
    testCase: {
      input: ["[[1, 2, 3, 1]]", "[[1, 2, 3, 4]]"],
      output: ["true", "false"]
    },
    starterCodes: {
      python: `def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
      javascript: `function containsDuplicate(nums) {
    const seen = new Set();
    for (let num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}`,
      cpp: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.find(num) != seen.end()) return true;
        seen.insert(num);
    }
    return false;
}`,
      java: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int num : nums) {
        if (seen.contains(num)) return true;
        seen.add(num);
    }
    return false;
}`
    },
    visualization: {
      defaultInput: {
        nums: [1, 2, 3, 1]
      },
      steps: [
        {
          variables: {
            seen: []
          },
          message: "Initialize empty seen set.",
          line: 2
        },
        {
          variables: {
            seen: [],
            num: 1
          },
          message: "Loop starts at first element (val = 1).",
          line: 3
        },
        {
          variables: {
            seen: [],
            num: 1
          },
          message: "Check if 1 is in seen set... No.",
          line: 4
        },
        {
          variables: {
            seen: [1],
            num: 1
          },
          message: "Add 1 to seen set.",
          line: 6
        },
        {
          variables: {
            seen: [1],
            num: 2
          },
          message: "Move to next element (val = 2).",
          line: 3
        },
        {
          variables: {
            seen: [1],
            num: 2
          },
          message: "Check if 2 is in seen set... No.",
          line: 4
        },
        {
          variables: {
            seen: [1, 2],
            num: 2
          },
          message: "Add 2 to seen set.",
          line: 6
        },
        {
          variables: {
            seen: [1, 2],
            num: 3
          },
          message: "Move to next element (val = 3).",
          line: 3
        },
        {
          variables: {
            seen: [1, 2],
            num: 3
          },
          message: "Check if 3 is in seen set... No.",
          line: 4
        },
        {
          variables: {
            seen: [1, 2, 3],
            num: 3
          },
          message: "Add 3 to seen set.",
          line: 6
        },
        {
          variables: {
            seen: [1, 2, 3],
            num: 1
          },
          message: "Move to next element (val = 1).",
          line: 3
        },
        {
          variables: {
            seen: [1, 2, 3],
            num: 1
          },
          message: "Check if 1 is in seen set... Yes, 1 is already in seen!",
          line: 4
        },
        {
          variables: {
            seen: [1, 2, 3],
            num: 1
          },
          message: "Duplicate found. Return True.",
          line: 5
        }
      ]
    }
  },
{
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Two Pointers",
    order: 17,
    problemStatement: `A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.<p class='mt-3'>Given a string <code>s</code>, return <code>true</code> if it is a <strong>palindrome</strong>, or <code>false</code> otherwise.</p>`,
    examples: [
      {
        id: 1,
        inputText: "s = \"aba\"",
        outputText: "true"
      },
      {
        id: 2,
        inputText: "s = \"racecar\"",
        outputText: "true"
      },
      {
        id: 3,
        inputText: "s = \"hello\"",
        outputText: "false"
      }
    ],
    constraints: "<li><code>1 <= s.length <= 15</code></li>",
    testCase: {
      input: ["[\"aba\"]", "[\"racecar\"]", "[\"hello\"]"],
      output: ["true", "true", "false"]
    },
    starterCodes: {
      python: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
      javascript: `function isPalindrome(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
      cpp: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}`,
      java: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}`
    },
    visualization: {
      defaultInput: {
        s: "racecar"
      },
      steps: [
        {
          variables: {
            left: 0,
            right: 6
          },
          message: "Initialize left pointer at 0, right pointer at 6 (last character).",
          line: 2
        },
        {
          variables: {
            left: 0,
            right: 6
          },
          message: "Compare characters: s[0] = 'r' and s[6] = 'r'. They match.",
          line: 3
        },
        {
          variables: {
            left: 0,
            right: 6
          },
          message: "Check mismatch: s[0] != s[6] is False.",
          line: 4
        },
        {
          variables: {
            left: 1,
            right: 5
          },
          message: "Move left and right pointers closer (left = 1, right = 5).",
          line: 6
        },
        {
          variables: {
            left: 1,
            right: 5
          },
          message: "Compare characters: s[1] = 'a' and s[5] = 'a'. They match.",
          line: 3
        },
        {
          variables: {
            left: 1,
            right: 5
          },
          message: "Check mismatch: s[1] != s[5] is False.",
          line: 4
        },
        {
          variables: {
            left: 2,
            right: 4
          },
          message: "Move pointers closer (left = 2, right = 4).",
          line: 6
        },
        {
          variables: {
            left: 2,
            right: 4
          },
          message: "Compare characters: s[2] = 'c' and s[4] = 'c'. They match.",
          line: 3
        },
        {
          variables: {
            left: 2,
            right: 4
          },
          message: "Check mismatch: s[2] != s[4] is False.",
          line: 4
        },
        {
          variables: {
            left: 3,
            right: 3
          },
          message: "Move pointers closer (left = 3, right = 3).",
          line: 6
        },
        {
          variables: {
            left: 3,
            right: 3
          },
          message: "left is not < right (3 is not < 3). Loop terminates.",
          line: 3
        },
        {
          variables: {
            left: 3,
            right: 3
          },
          message: "String is a valid palindrome. Return True.",
          line: 8
        }
      ]
    }
  },
{
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    order: 18,
    problemStatement: `Given the <code>root</code> of a binary tree, invert the tree, and return <em>its root</em>.`,
    examples: [
      {
        id: 1,
        inputText: "root = [4, 2, 7]",
        outputText: "[4, 7, 2]"
      }
    ],
    constraints: "<li>The number of nodes in the tree is in the range <code>[0, 10]</code>.</li>",
    testCase: {
      input: ["[[4, 2, 7]]", "[]"],
      output: ["[4, 7, 2]", "[]"]
    },
    starterCodes: {
      python: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invert_tree(root.left)
    invert_tree(root.right)
    return root`,
      javascript: `function invertTree(root) {
    if (!root) return null;
    let temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
}`,
      cpp: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* temp = root->left;
    root->left = root->right;
    root->right = temp;
    invertTree(root->left);
    invertTree(root->right);
    return root;
}`,
      java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
}`
    },
    visualization: {
      defaultInput: {
        root: [4, 2, 7]
      },
      steps: [
        {
          variables: {
            node: 4
          },
          message: "Start invert_tree for Root Node 4.",
          line: 2
        },
        {
          variables: {
            node: 4,
            left: 7,
            right: 2
          },
          message: "Swap left (2) and right (7) children of Node 4.",
          line: 4
        },
        {
          variables: {
            node: 7
          },
          message: "Recurse on new left child: Node 7.",
          line: 5
        },
        {
          variables: {
            node: 7
          },
          message: "Node 7 has no children. Base case return.",
          line: 2
        },
        {
          variables: {
            node: 2
          },
          message: "Recurse on new right child: Node 2.",
          line: 6
        },
        {
          variables: {
            node: 2
          },
          message: "Node 2 has no children. Base case return.",
          line: 2
        },
        {
          variables: {
            node: 4,
            left: 7,
            right: 2
          },
          message: "Inversion complete for root Node 4. Return root.",
          line: 7
        }
      ]
    }
  },
{
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    order: 19,
    problemStatement: `Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.`,
    examples: [
      {
        id: 1,
        inputText: "s = \"abcabcbb\"",
        outputText: "3"
      }
    ],
    constraints: "<li><code>0 <= s.length <= 15</code></li>",
    testCase: {
      input: ["[\"abcabcbb\"]", "[\"bbbbb\"]"],
      output: ["3", "1"]
    },
    starterCodes: {
      python: `def length_of_longest_substring(s):
    seen = {}
    left = max_len = 0
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      javascript: `function lengthOfLongestSubstring(s) {
    const seen = new Map();
    let left = 0, maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (seen.has(char) && seen.get(char) >= left) {
            left = seen.get(char) + 1;
        }
        seen.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> seen;
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); ++right) {
        char c = s[right];
        if (seen.find(c) != seen.end() && seen[c] >= left) {
            left = seen[c] + 1;
        }
        seen[c] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      java: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> seen = new HashMap<>();
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (seen.containsKey(c) && seen.get(c) >= left) {
            left = seen.get(c) + 1;
        }
        seen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`
    },
    visualization: {
      defaultInput: {
        s: "abcab"
      },
      steps: [
        {
          variables: {
            seen: {},
            left: 0,
            max_len: 0
          },
          message: "Initialize seen map. Set left = 0, max_len = 0.",
          line: 2
        },
        {
          variables: {
            seen: {},
            left: 0,
            max_len: 0,
            right: 0,
            char: "a"
          },
          message: "Slide right pointer to 0 ('a').",
          line: 4
        },
        {
          variables: {
            seen: {},
            left: 0,
            max_len: 0,
            right: 0,
            char: "a"
          },
          message: "Is 'a' duplicate in current window? No.",
          line: 5
        },
        {
          variables: {
            seen: {
              a: 0
            },
            left: 0,
            max_len: 0,
            right: 0,
            char: "a"
          },
          message: "Add 'a' at index 0 to seen map.",
          line: 7
        },
        {
          variables: {
            seen: {
              a: 0
            },
            left: 0,
            max_len: 1,
            right: 0,
            char: "a"
          },
          message: "Update max_len to max(0, 0 - 0 + 1) = 1.",
          line: 8
        },
        {
          variables: {
            seen: {
              a: 0
            },
            left: 0,
            max_len: 1,
            right: 1,
            char: "b"
          },
          message: "Slide right pointer to 1 ('b').",
          line: 4
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1
            },
            left: 0,
            max_len: 1,
            right: 1,
            char: "b"
          },
          message: "Add 'b' at index 1 to seen map.",
          line: 7
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1
            },
            left: 0,
            max_len: 2,
            right: 1,
            char: "b"
          },
          message: "Update max_len to max(1, 1 - 0 + 1) = 2.",
          line: 8
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1
            },
            left: 0,
            max_len: 2,
            right: 2,
            char: "c"
          },
          message: "Slide right pointer to 2 ('c').",
          line: 4
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1,
              c: 2
            },
            left: 0,
            max_len: 2,
            right: 2,
            char: "c"
          },
          message: "Add 'c' at index 2 to seen map.",
          line: 7
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1,
              c: 2
            },
            left: 0,
            max_len: 3,
            right: 2,
            char: "c"
          },
          message: "Update max_len to max(2, 2 - 0 + 1) = 3.",
          line: 8
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1,
              c: 2
            },
            left: 0,
            max_len: 3,
            right: 3,
            char: "a"
          },
          message: "Slide right pointer to 3 ('a').",
          line: 4
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1,
              c: 2
            },
            left: 0,
            max_len: 3,
            right: 3,
            char: "a"
          },
          message: "Is 'a' duplicate in current window? Yes, seen at index 0.",
          line: 5
        },
        {
          variables: {
            seen: {
              a: 0,
              b: 1,
              c: 2
            },
            left: 1,
            max_len: 3,
            right: 3,
            char: "a"
          },
          message: "Shrink window left pointer to 0 + 1 = 1.",
          line: 6
        },
        {
          variables: {
            seen: {
              a: 3,
              b: 1,
              c: 2
            },
            left: 1,
            max_len: 3,
            right: 3,
            char: "a"
          },
          message: "Update index of 'a' in seen map to 3.",
          line: 7
        },
        {
          variables: {
            seen: {
              a: 3,
              b: 1,
              c: 2
            },
            left: 1,
            max_len: 3,
            right: 3,
            char: "a"
          },
          message: "Update max_len = max(3, 3 - 1 + 1) = 3.",
          line: 8
        },
        {
          variables: {
            seen: {
              a: 3,
              b: 1,
              c: 2
            },
            left: 1,
            max_len: 3
          },
          message: "Return final max_len = 3.",
          line: 9
        }
      ]
    }
  },
{
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    order: 20,
    problemStatement: `Given an <code>m x n</code> 2D binary grid <code>grid</code> which represents a map of <code>'1'</code>s (land) and <code>'0'</code>s (water), return <em>the number of islands</em>.<p class='mt-3'>An <strong>island</strong> is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.</p>`,
    examples: [
      {
        id: 1,
        inputText: "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"0\"]]",
        outputText: "1"
      }
    ],
    constraints: "<li><code>1 <= m, n <= 4</code></li>",
    testCase: {
      input: ["[[[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"0\"]]]"],
      output: ["1"]
    },
    starterCodes: {
      python: `def num_islands(grid):
    if not grid: return 0
    count = 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]) or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      javascript: `function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    let count = 0;
    function dfs(r, c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;
        grid[r][c] = '0';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    return count;
}`,
      cpp: `void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int count = 0;
    for (int r = 0; r < grid.size(); ++r) {
        for (int c = 0; c < grid[0].size(); ++c) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}`,
      java: `private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}`
    },
    visualization: {
      defaultInput: {
        grid: [["1", "1", "0"], ["1", "1", "0"], ["0", "0", "0"]]
      },
      steps: [
        {
          variables: {
            count: 0
          },
          message: "Initialize count = 0.",
          line: 3
        },
        {
          variables: {
            count: 0,
            r: 0,
            c: 0
          },
          message: "Start iterating grid cells. At (0, 0), cell is '1'.",
          line: 12
        },
        {
          variables: {
            count: 1,
            r: 0,
            c: 0
          },
          message: "Found land at (0, 0). Increment count to 1.",
          line: 15
        },
        {
          variables: {
            count: 1,
            r: 0,
            c: 0
          },
          message: "Trigger DFS from (0, 0) to sink the island.",
          line: 16
        },
        {
          variables: {
            count: 1,
            r: 0,
            c: 0
          },
          message: "Sink current cell: set grid[0][0] = '0'.",
          line: 7
        },
        {
          variables: {
            count: 1,
            r: 1,
            c: 0
          },
          message: "Recurse down to grid[1][0] which is land.",
          line: 8
        },
        {
          variables: {
            count: 1,
            r: 1,
            c: 0
          },
          message: "Sink cell: set grid[1][0] = '0'.",
          line: 7
        },
        {
          variables: {
            count: 1,
            r: 1,
            c: 1
          },
          message: "Recurse right to grid[1][1] which is land.",
          line: 10
        },
        {
          variables: {
            count: 1,
            r: 1,
            c: 1
          },
          message: "Sink cell: set grid[1][1] = '0'.",
          line: 7
        },
        {
          variables: {
            count: 1,
            r: 0,
            c: 1
          },
          message: "Recurse up to grid[0][1] which is land.",
          line: 9
        },
        {
          variables: {
            count: 1,
            r: 0,
            c: 1
          },
          message: "Sink cell: set grid[0][1] = '0'.",
          line: 7
        },
        {
          variables: {
            count: 1
          },
          message: "All connected cells of the first island are sunk. DFS complete.",
          line: 17
        }
      ]
    }
  },
{
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    order: 11,
    youtubeLink: "https://www.youtube.com/watch?v=s4DPM8ct1pI",
    solutionExplanation: "Use a two-pointer approach (low and high) to split the search space in half. Compare the mid element with target and adjust boundaries.",
    optimalComplexity: { time: "O(log N)", space: "O(1)" },
    problemStatement: `Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.`,
    examples: [
      { id: 1, inputText: "nums = [-1,0,3,5,9,12], target = 9", outputText: "4", explanation: "9 exists in nums and its index is 4." },
      { id: 2, inputText: "nums = [-1,0,3,5,9,12], target = 2", outputText: "-1", explanation: "2 does not exist in nums so return -1." }
    ],
    constraints: `<li><code>1 <= nums.length <= 10^4</code></li><li><code>-10^4 < nums[i], target < 10^4</code></li><li>All elements in <code>nums</code> are <b>unique</b>.</li>`,
    starterCodes: {
      python: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      javascript: `function binarySearch(nums, target) {
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      cpp: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      java: `public int search(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    },
    testCases: {
      input: ["[-1,0,3,5,9,12], 9", "[-1,0,3,5,9,12], 2"],
      output: ["4", "-1"]
    }
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    order: 12,
    youtubeLink: "https://www.youtube.com/watch?v=gBTe7lFR3vc",
    solutionExplanation: "Floyd's Tortoise and Hare algorithm. Use two pointers, slow moving 1 step and fast moving 2 steps. If there is a cycle, they will eventually meet.",
    optimalComplexity: { time: "O(N)", space: "O(1)" },
    problemStatement: `Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer.`,
    examples: [
      { id: 1, inputText: "head = [3,2,0,-4], pos = 1", outputText: "true", explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)." },
      { id: 2, inputText: "head = [1,2], pos = 0", outputText: "true", explanation: "There is a cycle where the tail connects to the 0th node." }
    ],
    constraints: `<li>The number of nodes in the list is in the range <code>[0, 10^4]</code>.</li><li><code>-10^5 <= Node.val <= 10^5</code></li>`,
    starterCodes: {
      python: `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
      javascript: `function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}`,
      cpp: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      java: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`
    },
    testCases: {
      input: ["head = [3,2,0,-4]", "head = [1]"],
      output: ["true", "false"]
    }
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    order: 13,
    youtubeLink: "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
    solutionExplanation: "This is a Fibonacci sequence problem. The number of ways to reach step N is the sum of ways to reach N-1 and N-2. Optimize space to O(1) by storing only the last two values.",
    optimalComplexity: { time: "O(N)", space: "O(1)" },
    problemStatement: `You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can either climb <code>1</code> or <code>2</code> steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { id: 1, inputText: "n = 2", outputText: "2", explanation: "There are two ways: 1 step + 1 step, or 2 steps." },
      { id: 2, inputText: "n = 3", outputText: "3", explanation: "There are three ways: (1+1+1), (1+2), or (2+1)." }
    ],
    constraints: `<li><code>1 <= n <= 45</code></li>`,
    starterCodes: {
      python: `def climb_stairs(n):
    if n <= 2:
        return n
    one, two = 1, 2
    for _ in range(3, n + 1):
        one, two = two, one + two
    return two`,
      javascript: `function climbStairs(n) {
    if (n <= 2) return n;
    let one = 1, two = 2;
    for (let i = 3; i <= n; i++) {
        let temp = one + two;
        one = two;
        two = temp;
    }
    return two;
}`,
      cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int one = 1, two = 2;
    for (int i = 3; i <= n; ++i) {
        int temp = one + two;
        one = two;
        two = temp;
    }
    return two;
}`,
      java: `public int climbStairs(int n) {
    if (n <= 2) return n;
    int one = 1, two = 2;
    for (int i = 3; i <= n; i++) {
        int temp = one + two;
        one = two;
        two = temp;
    }
    return two;
}`
    },
    testCases: {
      input: ["2", "3"],
      output: ["2", "3"]
    }
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    order: 14,
    youtubeLink: "https://www.youtube.com/watch?v=vzdNOK2oB2E",
    solutionExplanation: "Create a Hash Map where the key is the sorted version of the string (or character count tuple) and the value is a list of anagrams.",
    optimalComplexity: { time: "O(N * K log K)", space: "O(N * K) (where K is max string length)" },
    problemStatement: `Given an array of strings <code>strs</code>, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.`,
    examples: [
      { id: 1, inputText: 'strs = ["eat","tea","tan","ate","nat","bat"]', outputText: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    constraints: `<li><code>1 <= strs.length <= 10^4</code></li><li><code>0 <= strs[i].length <= 100</code></li><li><code>strs[i]</code> consists of lowercase English letters.</li>`,
    starterCodes: {
      python: `def groupAnagrams(strs):
    ans = {}
    for s in strs:
        sorted_s = "".join(sorted(s))
        if sorted_s not in ans:
            ans[sorted_s] = []
        ans[sorted_s].append(s)
    return list(ans.values())`,
      javascript: `function groupAnagrams(strs) {
    const map = new Map();
    for (let s of strs) {
        let sorted = s.split('').sort().join('');
        if (!map.has(sorted)) map.set(sorted, []);
        map.get(sorted).push(s);
    }
    return Array.from(map.values());
}`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> map;
    for (string s : strs) {
        string sorted_s = s;
        sort(sorted_s.begin(), sorted_s.end());
        map[sorted_s].push_back(s);
    }
    vector<vector<string>> ans;
    for (auto p : map) {
        ans.push_back(p.second);
    }
    return ans;
}`,
      java: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String sorted = new String(chars);
        if (!map.containsKey(sorted)) map.put(sorted, new ArrayList<>());
        map.get(sorted).add(s);
    }
    return new ArrayList<>(map.values());
}`
    },
    testCases: {
      input: ['["eat","tea","tan","ate","nat","bat"]'],
      output: ['[["eat","tea","ate"],["tan","nat"],["bat"]]']
    }
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    category: "Design",
    order: 15,
    youtubeLink: "https://www.youtube.com/watch?v=7ABFKpk2hGQ",
    solutionExplanation: "Use a Hash Map for O(1) key lookups combined with a doubly linked list to track element access order in O(1) insertion/deletion. The most recently accessed node is moved to the head, and the least recently used node at the tail is evicted when capacity is exceeded.",
    optimalComplexity: { time: "O(1) (both get and put)", space: "O(capacity)" },
    problemStatement: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: <code>LRUCache(int capacity)</code>, <code>int get(int key)</code>, and <code>void put(int key, int value)</code>.`,
    examples: [
      { id: 1, inputText: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', outputText: '[null, null, null, 1, null, -1, null, -1, 3, 4]', explanation: "Cache operations with capacity 2. Key 2 gets evicted when key 3 is added." }
    ],
    constraints: `<li><code>1 <= capacity <= 3000</code></li><li><code>0 <= key <= 10^4</code></li><li><code>0 <= value <= 10^5</code></li>`,
    starterCodes: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # Key to Node
        # Doubly linked list setup...
        
    def get(self, key: int) -> int:
        if key in self.cache:
            # Move to head
            return self.cache[key].val
        return -1
        
    def put(self, key: int, value: int) -> None:
        pass`,
      javascript: `class LRUCache {
    constructor(capacity) {
        self.capacity = capacity;
        self.map = new Map();
    }
    get(key) {
        if (!this.map.has(key)) return -1;
        const val = this.map.get(key);
        this.map.delete(key);
        this.map.set(key, val);
        return val;
    }
    put(key, value) {
        if (this.map.has(key)) this.map.delete(key);
        this.map.set(key, value);
        if (this.map.size > this.capacity) {
            const firstKey = this.map.keys().next().value;
            this.map.delete(firstKey);
        }
    }
}`,
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) {
        cap = capacity;
    }
    int get(int key) {
        // Implementation
        return -1;
    }
    void put(int key, int value) {
        // Implementation
    }
private:
    int cap;
};`,
      java: `class LRUCache {
    int capacity;
    Map<Integer, Integer> map;
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true);
    }
    public int get(int key) {
        return map.getOrDefault(key, -1);
    }
    public void put(int key, int value) {
        map.put(key, value);
    }
}`
    },
    testCases: {
      input: ["get", "put"],
      output: ["-1", "null"]
    }
  }
];
