// Algorithm Visualizer Engine for LeetCode Clone & DSA Visualizer
class AlgorithmVisualizer {
  constructor(containerId, variablesId, messageId) {
    this.container = document.getElementById(containerId);
    this.variablesContainer = document.getElementById(variablesId);
    this.messageContainer = document.getElementById(messageId);
    this.currentProblem = null;
    this.currentStep = 0;
    this.steps = [];
    this.isPlaying = false;
    this.playbackSpeed = 1000; // ms
    this.timer = null;
    this.onStepChange = null; // Callback for app sync
  }

  loadProblem(problem) {
    this.stop();
    this.currentProblem = problem;
    this.currentStep = 0;
    this.steps = problem.visualization?.steps || [];
    this.isPlaying = false;
    this.render();
  }

  render() {
    if (!this.steps || this.steps.length === 0) {
      this.container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
          <i class="fas fa-project-diagram text-5xl mb-4 text-purple-400 opacity-60"></i>
          <p class="text-lg font-semibold">Visualizer Studio</p>
          <p class="text-sm opacity-80 mt-1">Select a problem from the dashboard to start visualizing the algorithm step-by-step.</p>
        </div>
      `;
      this.variablesContainer.innerHTML = `<span class="text-gray-500 italic">No active variables</span>`;
      this.messageContainer.innerText = "Select a problem and click Play to start.";
      return;
    }

    const step = this.steps[this.currentStep];
    this.renderVisualizerWorkspace(step);
    this.renderVariables(step.variables);
    this.renderMessage(step.message);

    // Call the step change callback (for highlighting code line)
    if (this.onStepChange) {
      this.onStepChange(step.line);
    }
  }

  renderMessage(message) {
    this.messageContainer.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs mt-0.5">${this.currentStep + 1}</span>
        <p class="text-sm text-gray-200 leading-relaxed">${message}</p>
      </div>
    `;
  }

  renderVariables(variables) {
    if (!variables || Object.keys(variables).length === 0) {
      this.variablesContainer.innerHTML = `<span class="text-gray-500 italic">No variables in scope</span>`;
      return;
    }

    let html = `<div class="grid grid-cols-2 gap-2 text-xs font-mono">`;
    for (const [key, val] of Object.entries(variables)) {
      let formattedVal = val;
      if (typeof val === 'object') {
        formattedVal = JSON.stringify(val);
      }
      
      // Highlight specific important variable labels
      let colorClass = "text-gray-300";
      if (key === 'i' || key === 'left' || key === 'low') colorClass = "text-cyan-400";
      else if (key === 'right' || key === 'high') colorClass = "text-purple-400";
      else if (key === 'max_reach' || key === 'max_water' || key === 'max_profit') colorClass = "text-emerald-400";
      else if (key === 'result') colorClass = "text-emerald-400 font-bold";

      html += `
        <div class="flex items-center gap-2 bg-gray-900/50 px-2.5 py-1.5 rounded border border-gray-800">
          <span class="text-gray-500 font-semibold">${key}:</span>
          <span class="${colorClass}">${formattedVal}</span>
        </div>
      `;
    }
    html += `</div>`;
    this.variablesContainer.innerHTML = html;
  }

  renderVisualizerWorkspace(step) {
    const id = this.currentProblem.id;
    this.container.innerHTML = ""; // Clear
    
    // Create base workspace div
    const workspace = document.createElement("div");
    workspace.className = "w-full h-full flex items-center justify-center p-6 relative select-none";
    this.container.appendChild(workspace);

    switch(id) {
      case "two-sum":
        this.renderTwoSumVis(workspace, step);
        break;
      case "reverse-linked-list":
        this.renderReverseLinkedListVis(workspace, step);
        break;
      case "jump-game":
        this.renderJumpGameVis(workspace, step);
        break;
      case "valid-parentheses":
        this.renderValidParenthesesVis(workspace, step);
        break;
      case "search-a-2d-matrix":
        this.renderSearch2DMatrixVis(workspace, step);
        break;
      case "container-with-most-water":
        this.renderContainerWaterVis(workspace, step);
        break;
      case "merge-intervals":
        this.renderMergeIntervalsVis(workspace, step);
        break;
      case "maximum-depth-of-binary-tree":
        this.renderMaxDepthTreeVis(workspace, step);
        break;
      case "best-time-to-buy-and-sell-stock":
        this.renderStockProfitVis(workspace, step);
        break;
      case "subsets":
        this.renderSubsetsVis(workspace, step);
        break;
      default:
        workspace.innerHTML = `<span class="text-gray-400">Visualizer for problem: ${id} coming soon!</span>`;
    }
  }

  // --- TWO SUM VISUALIZER ---
  renderTwoSumVis(workspace, step) {
    const nums = this.currentProblem.visualization.defaultInput.nums;
    const target = this.currentProblem.visualization.defaultInput.target;
    
    const highlight = step.highlight || {};
    const activeIdx = step.variables.i !== undefined ? step.variables.i : -1;
    const seenMap = step.variables.seen || {};
    const complement = step.variables.complement;

    let html = `
      <div class="flex flex-col items-center gap-8 w-full max-w-lg">
        <!-- Target indicator -->
        <div class="text-center">
          <span class="text-xs uppercase tracking-wider text-gray-500">Target Value</span>
          <div class="text-2xl font-bold text-purple-400 bg-purple-950/20 border border-purple-500/30 px-4 py-1 rounded-full glow-purple inline-block mt-1">${target}</div>
        </div>

        <!-- Array list -->
        <div class="flex flex-col w-full">
          <div class="text-xs text-gray-400 font-semibold mb-2 flex items-center justify-between">
            <span>Input Array (nums)</span>
            <span>Index</span>
          </div>
          <div class="flex items-center gap-3 w-full justify-between">
            ${nums.map((num, idx) => {
              const isActive = idx === activeIdx;
              const isComp = num === complement && seenMap[num] !== undefined;
              let borderClass = "border-gray-700";
              let bgClass = "bg-gray-800/40";
              let textClass = "text-gray-300";

              if (isActive) {
                borderClass = "border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]";
                bgClass = "bg-cyan-950/30";
                textClass = "text-cyan-400 font-semibold";
              } else if (isComp) {
                borderClass = "border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]";
                bgClass = "bg-purple-950/30";
                textClass = "text-purple-400 font-semibold";
              } else if (highlight.array && highlight.array.includes(idx)) {
                borderClass = "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                bgClass = "bg-emerald-950/30";
                textClass = "text-emerald-400 font-semibold";
              }

              return `
                <div class="flex-1 flex flex-col items-center relative">
                  <!-- Array cell -->
                  <div class="w-full aspect-square flex items-center justify-center rounded-xl border-2 ${borderClass} ${bgClass} ${textClass} text-lg font-bold transition-all duration-300 vis-element">
                    ${num}
                  </div>
                  <!-- index label -->
                  <span class="text-xs text-gray-500 mt-1 font-mono">${idx}</span>
                  
                  <!-- Pointer arrow -->
                  ${isActive ? `
                    <div class="absolute -bottom-6 text-cyan-400 text-sm animate-bounce vis-pointer">
                      <i class="fas fa-arrow-up"></i> <span class="font-mono text-xs">i</span>
                    </div>
                  ` : ''}
                  ${isComp ? `
                    <div class="absolute -bottom-6 text-purple-400 text-sm animate-bounce vis-pointer">
                      <i class="fas fa-arrow-up"></i> <span class="font-mono text-xs">match</span>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Hashmap representing "seen" -->
        <div class="w-full bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex flex-col">
          <span class="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
            <i class="fas fa-hashtag text-purple-400"></i> Hash Map (seen) [Key: Value]
          </span>
          <div class="flex flex-wrap gap-2.5 min-h-[45px] items-center">
            ${Object.keys(seenMap).length === 0 ? `
              <span class="text-xs text-gray-500 italic">Empty map</span>
            ` : Object.entries(seenMap).map(([key, val]) => {
              const isHighlight = highlight.map && highlight.map.includes(key);
              return `
                <div class="flex items-center gap-1 bg-gray-800 border ${isHighlight ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20' : 'border-gray-700 text-gray-300'} px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-300">
                  <span class="font-semibold text-purple-300">${key}</span>
                  <span class="text-gray-500">:</span>
                  <span class="text-cyan-400 font-bold">${val}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- REVERSE LINKED LIST VISUALIZER ---
  renderReverseLinkedListVis(workspace, step) {
    const list = this.currentProblem.visualization.defaultInput.head;
    const prevVal = step.variables.prev;
    const currVal = step.variables.curr;
    const nextVal = step.variables.next;
    const highlight = step.highlight || {};
    const reversedList = highlight.reversed || [];

    // Let's lay out the 4 nodes
    let html = `
      <div class="flex flex-col items-center gap-10 w-full max-w-xl">
        <!-- Pointer tags top row -->
        <div class="flex items-center justify-around w-full max-w-lg mb-2">
          <div class="flex items-center gap-1.5 px-3 py-1 rounded bg-gray-900 border border-gray-800">
            <span class="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
            <span class="text-xs text-gray-400 font-mono">prev: <strong class="text-pink-400">${prevVal}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1 rounded bg-gray-900 border border-gray-800">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span class="text-xs text-gray-400 font-mono">curr: <strong class="text-cyan-400">${currVal}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1 rounded bg-gray-900 border border-gray-800">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span class="text-xs text-gray-400 font-mono">next: <strong class="text-purple-400">${nextVal}</strong></span>
          </div>
        </div>

        <!-- Node structure layout -->
        <div class="flex items-center gap-1.5 w-full justify-center relative py-6">
          <!-- NULL visual node for prev start -->
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full border border-dashed border-gray-700 bg-gray-950/20 text-gray-600 flex items-center justify-center text-xs font-mono font-bold">
              NULL
            </div>
            <!-- Arrow to Node 1 initially, later none -->
            <div class="w-8 h-2 relative flex items-center">
              <div class="w-full h-0.5 ${prevVal === 1 && step.variables.action === "reverseLink" ? 'bg-purple-500 shadow-[0_0_8px_var(--accent-purple-glow)]' : 'bg-gray-800'}"></div>
              ${prevVal === 1 && step.variables.action === "reverseLink" ? `
                <div class="absolute left-0 border-t-[4px] border-b-[4px] border-r-[6px] border-t-transparent border-b-transparent border-r-purple-500"></div>
              ` : ''}
            </div>
          </div>

          ${list.map((val, idx) => {
            const isCurr = val === currVal;
            const isPrev = val === prevVal;
            const isNext = val === nextVal;
            const isReversed = reversedList.includes(val);

            let borderClass = "border-gray-700";
            let bgClass = "bg-gray-800/40";
            let textClass = "text-gray-300";

            if (isCurr) {
              borderClass = "border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]";
              bgClass = "bg-cyan-950/30";
              textClass = "text-cyan-400 font-bold";
            } else if (isPrev) {
              borderClass = "border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.4)]";
              bgClass = "bg-pink-950/20";
              textClass = "text-pink-400 font-bold";
            } else if (isNext) {
              borderClass = "border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]";
              bgClass = "bg-purple-950/20";
              textClass = "text-purple-400 font-bold";
            }

            // Arrow direction details
            const isArrowReversed = isReversed; // Reversed link
            
            return `
              <div class="flex items-center">
                <!-- Circle Node -->
                <div class="w-14 h-14 rounded-full border-2 ${borderClass} ${bgClass} ${textClass} flex flex-col items-center justify-center text-md font-bold transition-all duration-300 relative z-10">
                  <span>${val}</span>
                </div>

                <!-- Link arrow -->
                ${idx < list.length - 1 ? `
                  <div class="w-12 h-2 relative flex items-center">
                    <div class="w-full h-0.5 transition-all duration-300 ${isArrowReversed ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]' : 'bg-gray-700'}"></div>
                    <!-- Right pointer head -->
                    ${!isArrowReversed ? `
                      <div class="absolute right-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-700"></div>
                    ` : `
                      <!-- Left pointer head representing reverse path -->
                      <div class="absolute left-0 border-t-[4px] border-b-[4px] border-r-[6px] border-t-transparent border-b-transparent border-r-pink-500"></div>
                    `}
                  </div>
                ` : `
                  <!-- Final arrow to null -->
                  <div class="w-10 h-2 relative flex items-center">
                    <div class="w-full h-0.5 ${reversedList.includes(4) ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]' : 'bg-gray-700'}"></div>
                    ${reversedList.includes(4) ? `
                      <div class="absolute left-0 border-t-[4px] border-b-[4px] border-r-[6px] border-t-transparent border-b-transparent border-r-pink-500"></div>
                    ` : `
                      <div class="absolute right-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-700"></div>
                    `}
                  </div>
                  <!-- Null node at the end -->
                  <div class="w-12 h-12 rounded-full border border-dashed border-gray-700 bg-gray-950/20 text-gray-600 flex items-center justify-center text-xs font-mono font-bold">
                    NULL
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- JUMP GAME VISUALIZER ---
  renderJumpGameVis(workspace, step) {
    const nums = this.currentProblem.visualization.defaultInput.nums;
    const activeIdx = step.variables.i !== undefined ? step.variables.i : -1;
    const maxReach = step.variables.max_reach !== undefined ? step.variables.max_reach : 0;
    const jump = step.variables.jump !== undefined ? step.variables.jump : 0;

    let html = `
      <div class="flex flex-col items-center gap-8 w-full max-w-md">
        <!-- Target visual metrics -->
        <div class="flex items-center gap-6">
          <div class="text-center">
            <span class="text-xs uppercase tracking-wider text-gray-500">Max Reach Index</span>
            <div class="text-xl font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 px-4 py-1 rounded-full glow-emerald mt-1">${maxReach}</div>
          </div>
          <div class="text-center">
            <span class="text-xs uppercase tracking-wider text-gray-500">Goal Index</span>
            <div class="text-xl font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-500/30 px-4 py-1 rounded-full glow-cyan mt-1">${nums.length - 1}</div>
          </div>
        </div>

        <!-- Grid of steps -->
        <div class="flex items-end gap-3 w-full justify-between pt-6 border-b border-gray-800 pb-10">
          ${nums.map((val, idx) => {
            const isActive = idx === activeIdx;
            const canBeReached = idx <= maxReach;
            const isGoal = idx === nums.length - 1;

            let borderClass = canBeReached ? "border-emerald-600" : "border-gray-800";
            let bgClass = canBeReached ? "bg-emerald-950/10" : "bg-gray-950/10";
            let textClass = canBeReached ? "text-emerald-400" : "text-gray-600";
            
            if (isActive) {
              borderClass = "border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]";
              bgClass = "bg-cyan-950/20";
              textClass = "text-cyan-400 font-bold";
            }

            // Height representing potential jump size
            const barHeight = 40 + (val * 16);

            return `
              <div class="flex-1 flex flex-col items-center relative">
                <!-- Jump range visual highlight -->
                ${isActive && val > 0 ? `
                  <div class="absolute -top-6 h-6 bg-cyan-500/10 border-l border-r border-dashed border-cyan-500/40 flex items-center justify-center rounded" style="width: ${val * 100}%;">
                    <span class="text-[9px] text-cyan-400">jump: +${val}</span>
                  </div>
                ` : ''}

                <!-- Element Box -->
                <div class="w-full flex flex-col items-center justify-end rounded-lg border-2 ${borderClass} ${bgClass} ${textClass} p-3 font-bold transition-all duration-300 vis-element" style="height: ${barHeight}px;">
                  <span class="text-lg">${val}</span>
                </div>
                
                <!-- label index -->
                <span class="text-xs text-gray-500 mt-2 font-mono">${idx}</span>
                ${isGoal ? `<span class="text-[9px] text-cyan-400 uppercase tracking-widest font-semibold mt-1">Goal</span>` : ''}

                <!-- Active Pointer -->
                ${isActive ? `
                  <div class="absolute -bottom-8 text-cyan-400 text-sm animate-bounce vis-pointer">
                    <i class="fas fa-arrow-up"></i> <span class="font-mono text-xs">i</span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- VALID PARENTHESES VISUALIZER ---
  renderValidParenthesesVis(workspace, step) {
    const s = this.currentProblem.visualization.defaultInput.s;
    const highlight = step.highlight || {};
    const activeCharIdx = highlight.charIndex !== undefined ? highlight.charIndex : -1;
    const stack = step.variables.stack || [];

    let html = `
      <div class="flex items-stretch justify-around w-full max-w-lg h-60">
        <!-- Input String Characters -->
        <div class="flex flex-col justify-center gap-3">
          <span class="text-xs font-semibold text-gray-400">Processing String</span>
          <div class="flex items-center gap-1.5 bg-gray-900 border border-gray-800 p-2.5 rounded-xl">
            ${s.split('').map((char, idx) => {
              const isActive = idx === activeCharIdx;
              const isProcessed = idx < activeCharIdx;
              let borderClass = "border-gray-800";
              let bgClass = "bg-transparent";
              let textClass = isProcessed ? "text-gray-600 line-through" : "text-gray-300";

              if (isActive) {
                borderClass = "border-cyan-500 glow-cyan";
                bgClass = "bg-cyan-950/20";
                textClass = "text-cyan-400 font-bold scale-110";
              }

              return `
                <div class="w-8 h-8 rounded border ${borderClass} ${bgClass} ${textClass} flex items-center justify-center text-sm transition-all duration-200">
                  ${char}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Stack Container visual -->
        <div class="flex flex-col items-center justify-between w-40 relative">
          <span class="text-xs font-semibold text-gray-400 mb-2">Stack memory</span>
          
          <div class="w-full flex-grow border-l-4 border-r-4 border-b-4 border-gray-700 bg-gray-950/20 rounded-b-xl flex flex-col-reverse items-center justify-start p-2 gap-1.5 min-h-[180px]">
            ${stack.length === 0 ? `
              <span class="text-xs text-gray-600 italic mb-4">Stack Empty</span>
            ` : stack.map((element, idx) => {
              const isTop = idx === stack.length - 1;
              const isHighlight = isTop && highlight.pop;
              
              let bg = "bg-purple-950/20 border border-purple-500/40 text-purple-300";
              if (isHighlight) {
                bg = "bg-pink-950/20 border border-pink-500/50 text-pink-400 animate-pulse";
              }
              
              return `
                <div class="w-full py-2.5 px-4 rounded-lg text-center text-sm font-bold font-mono ${bg} vis-stack-item">
                  ${element} ${isTop ? '<span class="text-[9px] text-cyan-400 block tracking-widest uppercase font-mono">top</span>' : ''}
                </div>
              `;
            }).reverse().join('')}
          </div>
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- SEARCH 2D MATRIX VISUALIZER ---
  renderSearch2DMatrixVis(workspace, step) {
    const matrix = this.currentProblem.visualization.defaultInput.matrix;
    const target = this.currentProblem.visualization.defaultInput.target;
    const low = step.variables.low !== undefined ? step.variables.low : -1;
    const high = step.variables.high !== undefined ? step.variables.high : -1;
    const mid = step.variables.mid !== undefined ? step.variables.mid : -1;
    const n = matrix[0].length; // Columns count

    let html = `
      <div class="flex flex-col items-center gap-6 w-full max-w-lg">
        <!-- Target Info -->
        <div class="flex items-center gap-6 text-xs font-mono">
          <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-emerald-500"></span> low: ${low}</div>
          <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-cyan-400 animate-pulse"></span> mid: ${mid}</div>
          <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded bg-purple-500"></span> high: ${high}</div>
          <div class="bg-purple-950/30 px-3 py-1 border border-purple-500/20 rounded font-sans text-xs">Search for Target: <strong class="text-purple-400 text-sm font-sans">${target}</strong></div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-4 gap-2.5 w-full bg-gray-900/40 p-4 rounded-xl border border-gray-800">
          ${matrix.flatMap((row, rIdx) => 
            row.map((val, cIdx) => {
              const flatIdx = rIdx * n + cIdx;
              const isLow = flatIdx === low;
              const isHigh = flatIdx === high;
              const isMid = flatIdx === mid;
              const inRange = flatIdx >= low && flatIdx <= high;

              let borderClass = "border-gray-800";
              let bgClass = "bg-gray-950/30";
              let textClass = "text-gray-500";

              if (inRange) {
                borderClass = "border-gray-700";
                bgClass = "bg-gray-800/40";
                textClass = "text-gray-300";
              }

              if (isMid) {
                borderClass = "border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]";
                bgClass = "bg-cyan-950/20";
                textClass = "text-cyan-400 font-bold";
              } else if (isLow) {
                borderClass = "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                bgClass = "bg-emerald-950/20";
                textClass = "text-emerald-400 font-bold";
              } else if (isHigh) {
                borderClass = "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]";
                bgClass = "bg-purple-950/20";
                textClass = "text-purple-400 font-bold";
              }

              return `
                <div class="relative aspect-[4/3] rounded-lg border-2 ${borderClass} ${bgClass} ${textClass} flex flex-col items-center justify-center font-bold text-md transition-all duration-300">
                  <span>${val}</span>
                  <span class="absolute top-1 left-1.5 text-[8px] font-mono text-gray-600 font-normal">${flatIdx}</span>
                  
                  <!-- Pointer indicators -->
                  <div class="absolute -bottom-1 flex gap-0.5 text-[8px]">
                    ${isLow ? '<span class="px-1 bg-emerald-900 text-emerald-400 rounded border border-emerald-500/20 scale-90">L</span>' : ''}
                    ${isMid ? '<span class="px-1 bg-cyan-900 text-cyan-400 rounded border border-cyan-500/20 scale-90 animate-pulse">M</span>' : ''}
                    ${isHigh ? '<span class="px-1 bg-purple-900 text-purple-400 rounded border border-purple-500/20 scale-90">H</span>' : ''}
                  </div>
                </div>
              `;
            })
          ).join('')}
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- CONTAINER WITH MOST WATER VISUALIZER ---
  renderContainerWaterVis(workspace, step) {
    const heights = this.currentProblem.visualization.defaultInput.height;
    const left = step.variables.left !== undefined ? step.variables.left : 0;
    const right = step.variables.right !== undefined ? step.variables.right : heights.length - 1;
    const maxWater = step.variables.max_water !== undefined ? step.variables.max_water : 0;
    const highlight = step.highlight || {};

    const maxHeight = Math.max(...heights);
    const visHeight = 160; // px height of visualization box

    // Render bar elements
    let html = `
      <div class="flex flex-col items-center gap-6 w-full max-w-lg">
        <!-- Info display -->
        <div class="flex items-center gap-6 justify-between w-full max-w-sm border-b border-gray-800 pb-3">
          <div class="text-center">
            <span class="text-xs text-gray-500 uppercase">Max Area Found</span>
            <div class="text-xl font-bold text-emerald-400 font-sans mt-0.5">${maxWater}</div>
          </div>
          <div class="text-center">
            <span class="text-xs text-gray-500 uppercase">Width × MinHeight</span>
            <div class="text-xl font-bold text-cyan-400 font-sans mt-0.5">
              ${step.variables.width || 0} × ${step.variables.h || 0} = <span class="text-purple-400">${(step.variables.width || 0) * (step.variables.h || 0)}</span>
            </div>
          </div>
        </div>

        <!-- Timeline bars chart -->
        <div class="w-full flex items-end justify-between relative px-2" style="height: ${visHeight + 30}px;">
          
          <!-- Colored blue water area overlay -->
          ${left < right && step.variables.width ? (() => {
            const leftOffset = (left / (heights.length - 1)) * 100;
            const rightOffset = (right / (heights.length - 1)) * 100;
            const widthPct = rightOffset - leftOffset;
            const h = step.variables.h || 0;
            const waterHeight = (h / maxHeight) * visHeight;
            
            return `
              <div class="absolute bottom-6 bg-cyan-500/20 border-t-2 border-dashed border-cyan-400/60 rounded-sm z-0 flex items-center justify-center transition-all duration-300" 
                   style="left: calc(${leftOffset}% + 12px); width: calc(${widthPct}% - 24px); height: ${waterHeight}px;">
                <span class="text-xs font-mono font-bold text-cyan-300 bg-gray-900/80 px-2 py-0.5 rounded border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                  Area: ${(step.variables.width || 0) * h}
                </span>
              </div>
            `;
          })() : ''}

          <!-- Map heights to bars -->
          ${heights.map((h, idx) => {
            const isLeft = idx === left;
            const isRight = idx === right;
            const isBound = isLeft || isRight;
            const isFilling = highlight.fill && idx >= highlight.fill[0] && idx <= highlight.fill[1];

            const barHeightPct = (h / maxHeight) * visHeight;
            
            let bg = "bg-gray-800";
            let border = "border-transparent";
            let textClass = "text-gray-600";

            if (isBound) {
              bg = isLeft ? "bg-cyan-500" : "bg-purple-500";
              border = isLeft ? "border-cyan-400 shadow-[0_0_10px_var(--accent-cyan-glow)]" : "border-purple-400 shadow-[0_0_10px_var(--accent-purple-glow)]";
              textClass = isLeft ? "text-cyan-400 font-bold" : "text-purple-400 font-bold";
            } else if (isFilling) {
              bg = "bg-cyan-950/20";
            }

            return `
              <div class="flex-grow flex flex-col items-center relative z-10" style="width: calc(100% / ${heights.length});">
                <!-- Bar visual element -->
                <div class="w-3 rounded-t border ${border} ${bg} transition-all duration-300" style="height: ${barHeightPct}px;"></div>
                
                <!-- Index values and pointer arrows below -->
                <span class="text-[9px] font-mono mt-1 ${textClass}">${h}</span>
                
                ${isLeft ? `
                  <div class="absolute -bottom-6 text-cyan-400 text-xs font-bold animate-pulse">L</div>
                ` : ''}
                ${isRight ? `
                  <div class="absolute -bottom-6 text-purple-400 text-xs font-bold animate-pulse">R</div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- MERGE INTERVALS VISUALIZER ---
  renderMergeIntervalsVis(workspace, step) {
    const list = this.currentProblem.visualization.defaultInput.intervals;
    const highlight = step.highlight || {};
    const mergedList = step.variables.merged ? JSON.parse(step.variables.merged.replace(/'/g, '"')) : [];
    const current = step.variables.current ? JSON.parse(step.variables.current.replace(/'/g, '"')) : null;

    let html = `
      <div class="flex flex-col items-stretch gap-6 w-full max-w-md">
        <span class="text-xs font-semibold text-gray-400 border-b border-gray-800 pb-1.5">Intervals Pipeline</span>
        
        <div class="flex flex-col gap-3">
          ${list.map((interval, idx) => {
            const isCurrent = current && current[0] === interval[0] && current[1] === interval[1];
            const isMerged = mergedList.some(m => m[0] === interval[0] && m[1] === interval[1]);
            const startsAt = (interval[0] / 20) * 100; // mapped to scale 0-20
            const spanWidth = ((interval[1] - interval[0]) / 20) * 100;
            
            let bg = "bg-gray-800 border-gray-700 text-gray-400";
            if (isCurrent) {
              bg = "bg-cyan-950/20 border-cyan-400 text-cyan-400 glow-cyan font-semibold";
            } else if (isMerged || (highlight.overlap && isCurrent)) {
              bg = "bg-emerald-950/20 border-emerald-500 text-emerald-400 glow-emerald font-semibold";
            }

            return `
              <div class="flex items-center gap-4 text-xs font-mono">
                <span class="w-16">Item ${idx}:</span>
                <!-- Bar timeline box -->
                <div class="flex-grow bg-gray-950/40 border border-gray-900 rounded-lg h-9 relative overflow-hidden flex items-center px-2">
                  <div class="absolute rounded border h-6 px-2 flex items-center justify-center text-[10px] ${bg} transition-all duration-300"
                       style="left: ${startsAt}%; width: ${Math.max(spanWidth, 12)}%;">
                    [${interval[0]}, ${interval[1]}]
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Merged collection list display -->
        <div class="mt-4 bg-gray-900/60 p-4 border border-gray-800 rounded-xl">
          <span class="text-xs font-semibold text-emerald-400 mb-2 block">
            <i class="fas fa-check-double mr-1"></i> Result: merged list
          </span>
          <div class="flex items-center gap-2 text-sm font-mono font-bold text-gray-200">
            [ ${mergedList.map(item => `
              <span class="bg-emerald-950/30 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 rounded-md">
                [${item[0]}, ${item[1]}]
              </span>
            `).join(', ')} ]
          </div>
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- MAXIMUM DEPTH OF BINARY TREE VISUALIZER ---
  renderMaxDepthTreeVis(workspace, step) {
    const nodeVal = step.variables.node;
    const highlight = step.highlight || {};
    const leftDepth = step.variables.left_depth;
    const rightDepth = step.variables.right_depth;
    const finalDepth = step.variables.depth;

    // Hardcode tree graph node locations for rendering
    // Node structure:
    //      3
    //     / \
    //    9  20
    //       / \
    //      15  7
    const nodes = [
      { id: 3, val: "3", x: 150, y: 30, left: 9, right: 20 },
      { id: 9, val: "9", x: 60, y: 100, left: null, right: null },
      { id: 20, val: "20", x: 240, y: 100, left: 15, right: 7 },
      { id: 15, val: "15", x: 190, y: 170, left: null, right: null },
      { id: 7, val: "7", x: 290, y: 170, left: null, right: null }
    ];

    let html = `
      <div class="flex flex-col items-center gap-4 w-full h-full justify-between">
        <!-- Recursion stats header -->
        <div class="text-xs font-mono bg-gray-900 border border-gray-800 p-2.5 rounded-lg w-full max-w-sm flex items-center justify-around">
          <div>active: <span class="text-cyan-400 font-bold">${nodeVal}</span></div>
          <div>leftDepth: <span class="text-gray-400 font-bold">${leftDepth !== undefined ? leftDepth : '-'}</span></div>
          <div>rightDepth: <span class="text-gray-400 font-bold">${rightDepth !== undefined ? rightDepth : '-'}</span></div>
        </div>

        <!-- SVG graphic container -->
        <div class="relative w-[350px] h-[230px] mx-auto">
          <svg class="absolute inset-0 w-full h-full overflow-visible pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <!-- Draw Edges lines -->
            <!-- 3 -> 9 -->
            <line x1="150" y1="45" x2="75" y2="100" stroke="${highlight.node === 3 && highlight.path === 'left' ? '#06b6d4' : '#30363d'}" stroke-width="${highlight.node === 3 && highlight.path === 'left' ? '3' : '2'}" />
            <!-- 3 -> 20 -->
            <line x1="150" y1="45" x2="225" y2="100" stroke="${highlight.node === 3 && highlight.path === 'right' ? '#06b6d4' : '#30363d'}" stroke-width="${highlight.node === 3 && highlight.path === 'right' ? '3' : '2'}" />
            <!-- 20 -> 15 -->
            <line x1="240" y1="115" x2="200" y2="170" stroke="${highlight.node === 20 && highlight.path === 'left' ? '#06b6d4' : '#30363d'}" stroke-width="${highlight.node === 20 && highlight.path === 'left' ? '3' : '2'}" />
            <!-- 20 -> 7 -->
            <line x1="240" y1="115" x2="280" y2="170" stroke="${highlight.node === 20 && highlight.path === 'right' ? '#06b6d4' : '#30363d'}" stroke-width="${highlight.node === 20 && highlight.path === 'right' ? '3' : '2'}" />
          </svg>

          <!-- Render nodes dynamically as absolute positioned divs -->
          ${nodes.map(node => {
            const isActive = String(node.id) === String(nodeVal);
            const isPathActive = highlight.node === node.id;
            
            // Nodes that have recursive depth calculated and completed
            let nodeStatusClass = "";
            let depthTag = "";
            
            if (isActive) {
              nodeStatusClass = "vis-node-active";
            } else if (highlight.finalDepth && highlight.node === node.id) {
              nodeStatusClass = "vis-node-done";
              depthTag = `<span class="absolute -top-6 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">d: ${highlight.finalDepth}</span>`;
            } else if (node.id === 9 && (leftDepth !== undefined || finalDepth !== undefined)) {
              // Node 9 resolved
              nodeStatusClass = "vis-node-done";
              depthTag = `<span class="absolute -top-6 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">d: 1</span>`;
            } else if (node.id === 15 && (rightDepth !== undefined || finalDepth !== undefined)) {
              nodeStatusClass = "vis-node-done";
            } else if (node.id === 7 && (rightDepth !== undefined || finalDepth !== undefined)) {
              nodeStatusClass = "vis-node-done";
            } else if (node.id === 20 && finalDepth !== undefined) {
              nodeStatusClass = "vis-node-done";
              depthTag = `<span class="absolute -top-6 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">d: 2</span>`;
            }

            return `
              <div class="absolute w-11 h-11 rounded-full border-2 border-gray-700 bg-gray-900 text-gray-400 flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${nodeStatusClass}"
                   style="left: ${node.x - 22}px; top: ${node.y - 22}px;">
                ${node.val}
                ${depthTag}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- BEST TIME TO BUY AND SELL STOCK VISUALIZER ---
  renderStockProfitVis(workspace, step) {
    const prices = this.currentProblem.visualization.defaultInput.prices;
    const currentIdx = step.highlight.current_idx !== undefined ? step.highlight.current_idx : -1;
    const minPriceIdx = step.highlight.min_idx !== undefined ? step.highlight.min_idx : -1;
    const maxProfit = step.variables.max_profit !== undefined ? step.variables.max_profit : 0;
    const minPrice = step.variables.min_price !== undefined ? step.variables.min_price : 7;
    const currentPrice = prices[currentIdx];

    const maxChartPrice = Math.max(...prices);
    const visHeight = 160;

    let html = `
      <div class="flex flex-col items-center gap-6 w-full max-w-md">
        <!-- Stock metrics header -->
        <div class="flex items-center gap-5 justify-between w-full max-w-sm border-b border-gray-800 pb-3">
          <div class="text-center">
            <span class="text-xs text-gray-500 uppercase">Min Price (Buy)</span>
            <div class="text-lg font-bold text-emerald-400 font-mono mt-0.5">${minPrice === 7 && currentIdx === -1 ? 'None' : minPrice}</div>
          </div>
          <div class="text-center">
            <span class="text-xs text-gray-500 uppercase font-sans">Current Price</span>
            <div class="text-lg font-bold text-cyan-400 font-mono mt-0.5">${currentIdx !== -1 ? currentPrice : 'None'}</div>
          </div>
          <div class="text-center">
            <span class="text-xs text-gray-500 uppercase">Max Profit</span>
            <div class="text-lg font-bold text-purple-400 font-mono mt-0.5">+${maxProfit}</div>
          </div>
        </div>

        <!-- Prices column heights graph -->
        <div class="w-full flex items-end justify-between px-2 pt-6 pb-6 relative" style="height: ${visHeight}px;">
          ${prices.map((price, idx) => {
            const isMin = idx === minPriceIdx;
            const isCurrent = idx === currentIdx;
            
            const barHeight = (price / maxChartPrice) * 110;
            
            let bg = "bg-gray-800/40 border-gray-800";
            let shadow = "";
            let textStyle = "text-gray-500";

            if (isMin) {
              bg = "bg-emerald-950/20 border-emerald-500";
              shadow = "shadow-[0_0_10px_var(--accent-emerald-glow)]";
              textStyle = "text-emerald-400 font-bold";
            }
            
            if (isCurrent) {
              bg = "bg-cyan-950/20 border-cyan-400";
              shadow = "shadow-[0_0_12px_var(--accent-cyan-glow)]";
              textStyle = "text-cyan-400 font-bold";
            }

            // Profit connection visual line
            const isProfitSpan = isCurrent && currentPrice > minPrice;

            return `
              <div class="flex-grow flex flex-col items-center relative" style="width: calc(100% / ${prices.length});">
                <!-- Bar Chart column -->
                <div class="w-5 rounded border-2 ${bg} ${shadow} transition-all duration-300 flex items-center justify-center" style="height: ${barHeight}px;">
                  <span class="text-[10px] font-mono font-bold ${textStyle}">${price}</span>
                </div>
                
                <!-- Day label -->
                <span class="text-[9px] text-gray-600 mt-2">Day ${idx + 1}</span>

                <!-- Active tags -->
                ${isMin ? `<span class="absolute -bottom-6 text-[8px] bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 px-1 rounded">BUY</span>` : ''}
                ${isCurrent && !isMin ? `<span class="absolute -bottom-6 text-[8px] bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 px-1 rounded animate-pulse">SELL</span>` : ''}

                <!-- Draw dynamic line showing profit -->
                ${isProfitSpan ? `
                  <div class="absolute border-t-2 border-dashed border-purple-500" style="width: ${(idx - minPriceIdx) * 100}%; bottom: 120px; left: -${(idx - minPriceIdx - 0.5) * 50}px;"></div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- SUBSETS BACKTRACKING VISUALIZER ---
  renderSubsetsVis(workspace, step) {
    const path = step.variables.path || [];
    const resultString = step.variables.result || "[]";
    const highlight = step.highlight || {};

    let html = `
      <div class="flex flex-col items-stretch gap-6 w-full max-w-sm">
        <!-- Backtrack Stack variables -->
        <div class="flex flex-col gap-3">
          <span class="text-xs font-semibold text-gray-400 border-b border-gray-800 pb-1">Recursive State Path</span>
          <div class="flex items-center gap-2 bg-gray-900/40 p-3 border border-gray-800 rounded-xl">
            <span class="text-xs text-gray-500 font-mono">Current path:</span>
            <div class="flex items-center gap-1">
              ${path.length === 0 ? `
                <span class="text-xs text-gray-500 italic">[] (Empty Subset)</span>
              ` : path.map((num, idx) => `
                <span class="bg-purple-950/30 text-purple-400 font-mono px-2 py-0.5 border border-purple-500/20 rounded text-xs animate-bounce">
                  ${num}
                </span>
                ${idx < path.length - 1 ? '<i class="fas fa-chevron-right text-gray-600 text-[10px]"></i>' : ''}
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Generated Subsets List container -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-emerald-400 flex items-center justify-between">
            <span>Generated Subsets (Power Set)</span>
            <span class="text-[10px] text-gray-500 font-normal">Count: ${resultString.split('],').length}</span>
          </span>
          <div class="bg-gray-950/40 border border-gray-900 rounded-xl p-3.5 min-h-[90px] flex flex-wrap gap-2 max-h-[140px] overflow-y-auto">
            ${resultString === "[]" ? `
              <span class="text-xs text-gray-600 italic">No subsets generated yet.</span>
            ` : (() => {
              // Parse string representation of array subsets list
              try {
                const subsets = typeof resultString === 'string' ? JSON.parse(resultString.replace(/'/g, '"')) : resultString;
                return subsets.map((subset, idx) => {
                  const isJustAdded = highlight.added && JSON.stringify(subset) === JSON.stringify(highlight.added);
                  const highlightClass = isJustAdded ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 scale-105 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" : "bg-gray-800 border-gray-700 text-gray-300";
                  return `
                    <div class="px-2 py-1 border rounded text-[11px] font-mono transition-all duration-300 ${highlightClass}">
                      [${subset.join(',')}]
                    </div>
                  `;
                }).join('');
              } catch(e) {
                // fallback if parse fails
                return `<span class="text-xs text-gray-300 font-mono">${resultString}</span>`;
              }
            })()}
          </div>
        </div>
      </div>
    `;
    workspace.innerHTML = html;
  }

  // --- PLAYBACK TIMELINE STATE CONTROLLERS ---
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    } else {
      this.stop(); // End of steps
    }
  }

  play() {
    if (this.isPlaying) return;
    if (this.currentStep >= this.steps.length - 1) {
      this.currentStep = 0; // restart
    }
    this.isPlaying = true;
    this.timer = setInterval(() => this.nextStep(), this.playbackSpeed);
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  stop() {
    this.pause();
    this.currentStep = 0;
  }

  setSpeed(speedMs) {
    this.playbackSpeed = speedMs;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }
}
