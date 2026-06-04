// Curated DSA Tutorial Content
const READ_CONTENT = [
  {
    id: "big-o",
    title: "Big O Notation",
    category: "Concepts",
    icon: "fas fa-chart-line text-purple-400",
    summary: "Analyze the time and space complexity of your algorithms to write optimal code.",
    complexity: "Scale: O(1) < O(log N) < O(N) < O(N log N) < O(N²) < O(2^N)",
    content: `
      <h3 class="text-base font-bold text-white mb-2">What is Big O?</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-4">
        Big O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, it is used to classify algorithms according to how their run time or space requirements grow as the input size ($N$) grows.
      </p>

      <h3 class="text-base font-bold text-white mb-2">Complexity Classes</h3>
      <table class="w-full text-left text-xs text-gray-300 mb-4 border border-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-gray-900 text-gray-400">
            <th class="p-2 border-b border-gray-800">Complexity</th>
            <th class="p-2 border-b border-gray-800">Name</th>
            <th class="p-2 border-b border-gray-800">Example Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2 border-b border-gray-800 font-mono text-cyan-400">O(1)</td>
            <td class="p-2 border-b border-gray-800">Constant Time</td>
            <td class="p-2 border-b border-gray-800">Accessing array by index, HashMap lookups</td>
          </tr>
          <tr class="bg-gray-900/30">
            <td class="p-2 border-b border-gray-800 font-mono text-cyan-400">O(log N)</td>
            <td class="p-2 border-b border-gray-800">Logarithmic Time</td>
            <td class="p-2 border-b border-gray-800">Binary Search, balanced BST search</td>
          </tr>
          <tr>
            <td class="p-2 border-b border-gray-800 font-mono text-cyan-400">O(N)</td>
            <td class="p-2 border-b border-gray-800">Linear Time</td>
            <td class="p-2 border-b border-gray-800">Iterating through a list, linear search</td>
          </tr>
          <tr class="bg-gray-900/30">
            <td class="p-2 border-b border-gray-800 font-mono text-cyan-400">O(N log N)</td>
            <td class="p-2 border-b border-gray-800">Linearithmic Time</td>
            <td class="p-2 border-b border-gray-800">Optimal sorting algorithms (Merge Sort, Heap Sort)</td>
          </tr>
          <tr>
            <td class="p-2 border-b border-gray-800 font-mono text-cyan-400">O(N²)</td>
            <td class="p-2 border-b border-gray-800">Quadratic Time</td>
            <td class="p-2 border-b border-gray-800">Nested loops (Bubble Sort, Insertion Sort)</td>
          </tr>
          <tr class="bg-gray-900/30">
            <td class="p-2 border-b border-gray-800 font-mono text-cyan-400">O(2^N)</td>
            <td class="p-2 border-b border-gray-800">Exponential Time</td>
            <td class="p-2 border-b border-gray-800">Recursive Fibonacci, power set generation</td>
          </tr>
        </tbody>
      </table>

      <h3 class="text-base font-bold text-white mb-2">Key Tips</h3>
      <ul class="list-disc list-inside text-gray-300 text-xs flex flex-col gap-1">
        <li><strong>Drop constants:</strong> $O(2N)$ is simplified to $O(N)$.</li>
        <li><strong>Drop non-dominant terms:</strong> $O(N^2 + N)$ becomes $O(N^2)$.</li>
        <li><strong>Worst-case analysis:</strong> Always evaluate complexities under the worst possible input configuration.</li>
      </ul>
    `,
    codeSnippet: `def constant_time_demo(nums):\n    # O(1) time complexity\n    if len(nums) > 0:\n        return nums[0]\n    return None`,
    relatedProblemId: "search-a-2d-matrix",
    youtubeLink: "https://www.youtube.com/watch?v=V6mKRYt4cZ0"
  },
  {
    id: "arrays",
    title: "Arrays & Hashing",
    category: "Data Structures",
    icon: "fas fa-th text-cyan-400",
    summary: "Contiguous collections of elements and rapid constant-time key-value mapping.",
    complexity: "Access: O(1) | Search: O(N) | HashMap Access: O(1) average",
    content: `
      <h3 class="text-base font-bold text-white mb-2">Static vs. Dynamic Arrays</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-3">
        <strong>Static Arrays</strong> have a fixed size allocated at creation. <strong>Dynamic Arrays</strong> (like ArrayList in Java or lists in Python/JS) resize themselves automatically when they become full, usually by doubling their capacity (costing $O(N)$ amortized insertion).
      </p>

      <h3 class="text-base font-bold text-white mb-2">Hash Tables (HashMaps)</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-4">
        A Hash Table maps keys to values using a hashing function. It allows for average constant time $O(1)$ operations for insertion, deletion, and lookup. However, hash collisions can degrade the performance to $O(N)$ in the worst-case.
      </p>

      <h3 class="text-base font-bold text-white mb-2">Common Hashing Patterns</h3>
      <div class="bg-gray-900/40 border border-gray-800 p-3 rounded-lg text-xs leading-relaxed text-gray-300 mb-4">
        <strong>Frequency Map:</strong> Count characters or numbers to solve anagram or occurrence problems.<br>
        <strong>Complement Lookup:</strong> Store previously seen values to locate differences (like in the <i>Two Sum</i> problem).
      </div>
    `,
    codeSnippet: `def hashmap_frequency_demo(nums):\n    freq = {}\n    for num in nums:\n        freq[num] = freq.get(num, 0) + 1\n    return freq`,
    relatedProblemId: "two-sum",
    youtubeLink: "https://www.youtube.com/watch?v=wBvZ1M7bMho"
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    category: "Data Structures",
    icon: "fas fa-link text-emerald-400",
    summary: "Nodes containing data pointers that form sequential logical connections.",
    complexity: "Access: O(N) | Insertion/Deletion: O(1) at pointers",
    content: `
      <h3 class="text-base font-bold text-white mb-2">Singly vs. Doubly Linked Lists</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-3">
        In a <strong>Singly Linked List</strong>, each node references only the next node. In a <strong>Doubly Linked List</strong>, each node references both the next and the previous node, allowing bidirectional traversal at the expense of extra memory.
      </p>

      <h3 class="text-base font-bold text-white mb-2">Common Operations</h3>
      <ul class="list-disc list-inside text-gray-300 text-xs flex flex-col gap-1.5 mb-4">
        <li><strong>Traversal:</strong> Starting from the <code>head</code> node, sequentially step using <code>node.next</code> until reaching <code>null</code> (Time: $O(N)$).</li>
        <li><strong>Reversing links:</strong> Safely swapping node pointers using temporary values to prevent link detachment.</li>
        <li><strong>Runner Technique (Slow & Fast):</strong> Using two pointers traversing at different speeds to detect cycles or locate the midpoint of a list.</li>
      </ul>
    `,
    codeSnippet: `def traverse_linked_list(head):\n    curr = head\n    while curr:\n        print(curr.val)\n        curr = curr.next`,
    relatedProblemId: "reverse-linked-list",
    youtubeLink: "https://www.youtube.com/watch?v=H5l8JDUM5X0"
  },
  {
    id: "stacks-queues",
    title: "Stacks & Queues",
    category: "Data Structures",
    icon: "fas fa-layer-group text-rose-400",
    summary: "Linear collection structures defined by LIFO and FIFO execution patterns.",
    complexity: "Push/Pop/Enqueue: O(1) | Search: O(N)",
    content: `
      <h3 class="text-base font-bold text-white mb-2">Stack (LIFO - Last In First Out)</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-3">
        Stacks insert and remove elements from the same end (the "top"). Common operations are <code>push</code> (add), <code>pop</code> (remove), and <code>peek</code> (observe top). Ideal for tracking nested sequences, parenthesis matching, and recursion stacks.
      </p>

      <h3 class="text-base font-bold text-white mb-2">Queue (FIFO - First In First Out)</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-4">
        Queues insert elements at one end ("rear") and remove from the opposite end ("front"). Ideal for scheduling buffers, request pipelines, and Breadth-First Searches (BFS).
      </p>
    `,
    codeSnippet: `def stack_parentheses_demo(s):\n    stack = []\n    for char in s:\n        if char == '(':\n            stack.append(char)\n        elif char == ')':\n            if not stack: return False\n            stack.pop()\n    return len(stack) == 0`,
    relatedProblemId: "valid-parentheses",
    youtubeLink: "https://www.youtube.com/watch?v=okr-XE8yTO8"
  },
  {
    id: "trees",
    title: "Trees & BSTs",
    category: "Data Structures",
    icon: "fas fa-tree text-amber-500",
    summary: "Hierarchical parent-child nodes representing acyclic graphs.",
    complexity: "Balanced Search: O(log N) | Unbalanced Search: O(N)",
    content: `
      <h3 class="text-base font-bold text-white mb-2">Binary Trees</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-3">
        A node collection where each node can have at most two child nodes (commonly called <code>left</code> and <code>right</code>).
      </p>

      <h3 class="text-base font-bold text-white mb-2">Binary Search Trees (BST)</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-3">
        A tree with the search property: for any node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater than the node's value. This enables rapid $O(\log N)$ searches.
      </p>

      <h3 class="text-base font-bold text-white mb-2">Tree Traversals</h3>
      <div class="bg-gray-900/40 border border-gray-800 p-3 rounded-lg text-xs leading-relaxed text-gray-300 mb-4">
        <strong>In-Order (L, Node, R):</strong> Traverses BST in ascending sorted order.<br>
        <strong>Pre-Order (Node, L, R):</strong> Ideal for copying trees.<br>
        <strong>Post-Order (L, R, Node):</strong> Ideal for bottom-up updates (like calculating tree height).
      </div>
    `,
    codeSnippet: `def inorder_traversal(root):\n    if not root: return\n    inorder_traversal(root.left)\n    print(root.val)\n    inorder_traversal(root.right)`,
    relatedProblemId: "maximum-depth-of-binary-tree",
    youtubeLink: "https://www.youtube.com/watch?v=qH6yxkw0u78"
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    category: "Algorithms",
    icon: "fas fa-project-diagram text-purple-400",
    summary: "Solve complex problems by breaking them into overlapping subproblems.",
    complexity: "Optimizes from O(2^N) to O(N) or O(N²)",
    content: `
      <h3 class="text-base font-bold text-white mb-2">When to use Dynamic Programming?</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-3">
        Use DP when the problem has:
        <br>1. <strong>Overlapping Subproblems:</strong> The same subproblems are solved repeatedly.
        <br>2. <strong>Optimal Substructure:</strong> The optimal solution to the problem can be constructed from optimal solutions of its subproblems.
      </p>

      <h3 class="text-base font-bold text-white mb-2">Top-Down (Memoization) vs Bottom-Up (Tabulation)</h3>
      <p class="text-gray-300 text-xs leading-relaxed mb-4">
        <strong>Memoization</strong> solves subproblems recursively as they arise, caching results in a Hash Map or array. <strong>Tabulation</strong> solves subproblems iteratively starting from base cases, filling a table (usually bottom-up).
      </p>
    `,
    codeSnippet: `def fibonacci_dp(n, memo={}):\n    if n <= 1: return n\n    if n not in memo:\n        memo[n] = fibonacci_dp(n-1, memo) + fibonacci_dp(n-2, memo)\n    return memo[n]`,
    relatedProblemId: "jump-game",
    youtubeLink: "https://www.youtube.com/watch?v=Hdr64lKQ3e4"
  }
];
