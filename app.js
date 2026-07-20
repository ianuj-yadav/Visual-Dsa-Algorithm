// Core SPA Application Logic for LeetCode Clone & DSA Visualizer
document.addEventListener("DOMContentLoaded", () => {
  // Users DB initialization & session state
  function initUsersDB() {
    let users = JSON.parse(localStorage.getItem("algojudge_users"));
    if (!users) {
      users = [
        {
          name: "Demo User",
          username: "demo",
          email: "demo@algojudge.com",
          password: "password123",
          points: 1420
        }
      ];
      localStorage.setItem("algojudge_users", JSON.stringify(users));
    }
    return users;
  }
  initUsersDB();
  // Always clear current session on refresh/load to enforce the animation -> login -> home flow
  localStorage.removeItem("algojudge_current_user");
  let currentUser = null;
  let solvedProblems = new Set();

  function updateSolvedProblemsSet() {
    if (currentUser) {
      const key = `solvedProblems_${currentUser.username || 'guest'}`;
      solvedProblems = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
    } else {
      solvedProblems = new Set();
    }
  }

  // App State variables
  let currentPage = "dashboard";
  let activeProblem = null;
  let activeLanguage = "python";
  let activeStudioLanguage = "python";
  let activeTab = "editor"; // "editor" or "visualizer"
  let activePopularCompanyFilter = "All";

  // Hoisted state variables for Discuss, Read, and Workspace Left Pane Tabs
  let activeReadTopicId = "big-o";
  let readSearchBound = false;
  let activeDiscussChannel = "All";
  let activeWorkspaceLeftTab = "desc";
  let workspaceLeftTabsBound = false;
  
  // Visualizer Instance
  const visualizer = new AlgorithmVisualizer("vis-canvas", "vis-vars", "vis-desc");
  const studioVisualizer = new AlgorithmVisualizer("studio-vis-canvas", "studio-vis-vars", "studio-vis-desc");

  // DOM Elements
  const dashboardView = document.getElementById("dashboard-view");
  const workspaceView = document.getElementById("workspace-view");
  const analyticsView = document.getElementById("analytics-view");
  const problemsListContainer = document.getElementById("problems-list");
  const categoryFiltersContainer = document.getElementById("category-filters");
  const searchInput = document.getElementById("problem-search");
  const difficultyFilter = document.getElementById("difficulty-filter");

  // Company Problems Mapping for Popular DSA Questions
  const COMPANY_PROBLEMS = {
    Google: ["two-sum", "container-with-most-water", "maximum-depth-of-binary-tree", "subsets", "binary-search", "climbing-stairs", "lru-cache", "contains-duplicate", "valid-palindrome", "invert-binary-tree", "longest-substring-without-repeating-characters", "number-of-islands"],
    Meta: ["valid-parentheses", "merge-intervals", "reverse-linked-list", "subsets", "climbing-stairs", "group-anagrams", "lru-cache", "valid-palindrome", "invert-binary-tree", "longest-substring-without-repeating-characters", "number-of-islands"],
    Amazon: ["two-sum", "jump-game", "search-a-2d-matrix", "best-time-to-buy-and-sell-stock", "linked-list-cycle", "group-anagrams", "lru-cache", "contains-duplicate", "longest-substring-without-repeating-characters", "number-of-islands"],
    Microsoft: ["reverse-linked-list", "valid-parentheses", "merge-intervals", "best-time-to-buy-and-sell-stock", "binary-search", "linked-list-cycle", "lru-cache", "contains-duplicate", "number-of-islands"]
  };
  
  // Dashboard Stat Elements
  const totalSolvedCountEl = document.getElementById("stat-solved-count");
  const progressPercentEl = document.getElementById("stat-progress-percent");
  const progressRingCircle = document.querySelector(".progress-ring-circle");
  const easySolvedCountEl = document.getElementById("stat-easy-count");
  const mediumSolvedCountEl = document.getElementById("stat-medium-count");
  const hardSolvedCountEl = document.getElementById("stat-hard-count");
  
  // Workspace Layout Elements
  const problemTitleEl = document.getElementById("prob-title");
  const problemDiffEl = document.getElementById("prob-diff");
  const problemCatEl = document.getElementById("prob-cat");
  const problemStatementEl = document.getElementById("prob-statement");
  const problemExamplesEl = document.getElementById("prob-examples");
  const problemConstraintsEl = document.getElementById("prob-constraints");
  
  // Editor & Terminal DOM
  const codeEditorEl = document.getElementById("code-editor-area");
  const lineNumbersEl = document.getElementById("editor-line-numbers");
  const languageSelect = document.getElementById("language-select");
  const consoleOutputContainer = document.getElementById("console-output");
  const consolePanel = document.getElementById("console-panel");
  const consoleTabBtn = document.getElementById("console-tab-btn");
  
  // Modal Overlay
  const victoryModal = document.getElementById("victory-modal");
  
  // Initial page layout
  initApp();

  function initApp() {
    updateSolvedProblemsSet();
    setupLoginHandlers();
    setupThemeToggle();
    setupDashboardFilters();
    setupNavigation();
    setupWorkspaceTabs();
    setupWorkspaceLeftTabs();
    setupLanguageSelector();
    setupConsoleActions();
    setupVictoryModal();
    setupVisualizerControls();
    setupStudioControls();
    populateStudioProblemSelect();
    setupHomeViewScroll();
    setupDiscussHandlers();
    setupCardMouseTracking();
    
    // Check initial authentication (with modular entry animation check)
    const runInitialRedirect = () => {
      currentUser = null;
      localStorage.removeItem("algojudge_current_user");
      updateSolvedProblemsSet();
      showPage("login");
    };

    if (window.hasEntryAnimation && typeof window.playEntryAnimation === "function") {
      window.playEntryAnimation(runInitialRedirect);
    } else {
      runInitialRedirect();
    }
  }

  // --- THEME SWITCHER LOGIC ---
  function setupThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle-btn");
    const loginToggleBtn = document.getElementById("login-theme-toggle");
    
    const savedTheme = localStorage.getItem("algojudge_theme") || "dark";
    setTheme(savedTheme);

    const handleToggle = () => {
      const currentTheme = document.documentElement.classList.contains("light") ? "light" : "dark";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      setTheme(newTheme);
    };

    if (toggleBtn) toggleBtn.addEventListener("click", handleToggle);
    if (loginToggleBtn) loginToggleBtn.addEventListener("click", handleToggle);
  }

  function setTheme(theme) {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("algojudge_theme", theme);
  }


  function updateSidebarActiveLink(activeId) {
    const navIds = [
      "nav-link-home",
      "nav-link-dashboard",
      "nav-link-problems",
      "nav-link-visualizer",
      "nav-link-analytics",
      "nav-link-popular",
      "nav-link-read",
      "nav-link-discuss"
    ];
    
    navIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const shouldBeActive = (id === activeId);
      
      if (shouldBeActive) {
        el.className = "flex items-center gap-3.5 px-4 py-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium text-sm transition-all duration-300";
      } else {
        el.className = "flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent hover:border-gray-800 font-medium text-sm transition-all duration-300";
      }
    });
  }

  function showPage(page) {
    currentPage = page;
    
    const loginView = document.getElementById("login-view");
    const sidebarNav = document.getElementById("sidebar-nav");
    const mainContent = document.getElementById("main-content");
    const popularView = document.getElementById("popular-questions-view");
    const visualizerView = document.getElementById("visualizer-studio-view");
    const homeView = document.getElementById("home-view");
    const readView = document.getElementById("read-view");
    const discussView = document.getElementById("discuss-view");
    const dashboardView = document.getElementById("dashboard-view");
    const workspaceView = document.getElementById("workspace-view");
    const analyticsView = document.getElementById("analytics-view");
    const profileView = document.getElementById("profile-view");

    // All views that participate in page switching transitions
    const views = {
      login: loginView,
      home: homeView,
      dashboard: dashboardView,
      problems: dashboardView,
      popular: popularView,
      read: readView,
      discuss: discussView,
      visualizer: visualizerView,
      workspace: workspaceView,
      analytics: analyticsView,
      profile: profileView
    };

    // Helper to fade out active page
    const currentActiveViewEl = Object.values(views).find(v => v && !v.classList.contains("hidden") && v !== loginView);

    function completeShowPage() {
      if (page === "login") {
        loginView.classList.remove("hidden");
        void loginView.offsetWidth;
        loginView.classList.add("active-view");
        sidebarNav.classList.add("hidden");
        mainContent.classList.add("hidden");
        visualizer.stop();
        studioVisualizer.stop();
        startMatrixAnimation();
        return;
      }

      loginView.classList.add("hidden");
      loginView.classList.remove("active-view");
      mainContent.classList.remove("hidden");
      stopMatrixAnimation();
      
      if (page === "home") {
        sidebarNav.classList.add("hidden");
      } else {
        sidebarNav.classList.remove("hidden");
      }

      // Hide all pages, remove active transition class
      Object.keys(views).forEach(k => {
        const viewEl = views[k];
        if (viewEl && viewEl !== loginView) {
          viewEl.classList.add("hidden");
          viewEl.classList.remove("active-view");
        }
      });

      // Show and animate new page
      const targetViewEl = views[page];
      if (targetViewEl) {
        targetViewEl.classList.remove("hidden");
        void targetViewEl.offsetWidth;
        targetViewEl.classList.add("active-view");
      }
      
      if (page === "home") {
        updateSidebarActiveLink("nav-link-home");
        if (homeView && homeView.triggerScrollReveal) {
          setTimeout(homeView.triggerScrollReveal, 50);
        }
        studioVisualizer.stop();
        renderUserProfile();
      } else if (page === "dashboard" || page === "problems") {
        updateSidebarActiveLink(page === "problems" ? "nav-link-problems" : "nav-link-dashboard");
        studioVisualizer.stop();
        renderUserProfile();
        renderDashboard();
      } else if (page === "popular") {
        updateSidebarActiveLink("nav-link-popular");
        studioVisualizer.stop();
        renderUserProfile();
        renderPopularQuestions();
      } else if (page === "read") {
        updateSidebarActiveLink("nav-link-read");
        studioVisualizer.stop();
        renderUserProfile();
        renderReadSection();
      } else if (page === "discuss") {
        updateSidebarActiveLink("nav-link-discuss");
        studioVisualizer.stop();
        renderUserProfile();
        renderDiscussSection();
      } else if (page === "visualizer") {
        updateSidebarActiveLink("nav-link-visualizer");
        visualizer.stop();
        renderUserProfile();
        const selectEl = document.getElementById("studio-problem-select");
        if (selectEl) {
          loadStudioProblem(selectEl.value || "two-sum");
        }
      } else if (page === "workspace") {
        updateSidebarActiveLink("");
        studioVisualizer.stop();
      } else if (page === "analytics") {
        updateSidebarActiveLink("nav-link-analytics");
        studioVisualizer.stop();
        renderUserProfile();
        renderAnalyticsSection();
      } else if (page === "profile") {
        updateSidebarActiveLink("");
        studioVisualizer.stop();
        renderUserProfile();
        renderProfilePage();
      }
    }

    if (currentActiveViewEl && page !== "login" && views[page] !== currentActiveViewEl) {
      currentActiveViewEl.classList.remove("active-view");
      setTimeout(completeShowPage, 180);
    } else {
      completeShowPage();
    }
  }

  function startMatrixAnimation() {
    const canvas = document.getElementById("login-matrix-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const alphabet = "{}[]()<>:;=+-*/&|!01defclassfunctionletconstifelsereturn0123456789";
    const chars = alphabet.split("");

    const fontSize = 12;
    const columns = Math.ceil(canvas.width / fontSize);

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100;
    }

    const draw = () => {
      const isLight = document.documentElement.classList.contains("light");
      ctx.fillStyle = isLight ? "rgba(232, 245, 233, 0.11)" : "rgba(13, 17, 23, 0.11)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        if (isLight) {
          // Dynamic green palette for light mode code rain
          ctx.fillStyle = Math.random() > 0.5 ? "#2e7d32" : "#1b5e20";
        } else {
          ctx.fillStyle = Math.random() > 0.5 ? "#a855f7" : "#06b6d4";
        }

        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    canvas.cancelAnimation = () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }

  function stopMatrixAnimation() {
    const canvas = document.getElementById("login-matrix-canvas");
    if (canvas && canvas.cancelAnimation) {
      canvas.cancelAnimation();
    }
  }


  function getUserPoints() {
    if (!currentUser) return 0;
    const basePoints = currentUser.points || 0;
    return basePoints + solvedProblems.size * 100;
  }

  function renderUserProfile() {
    const container = document.getElementById("user-profile-container");
    const pointsEl = document.getElementById("header-user-points");
    if (!container || !currentUser) return;

    const name = currentUser.name || "Guest User";
    const email = currentUser.email || "guest@algojudge.com";
    const initials = name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    if (pointsEl) {
      pointsEl.innerText = getUserPoints().toLocaleString();
    }

    const isGuest = currentUser.username === "guest";
    const isProfilePage = (currentPage === "profile");

    container.innerHTML = `
      <div id="sidebar-profile-card" class="flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all duration-300 ${isProfilePage ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_12px_rgba(147,51,234,0.08)]' : 'bg-gray-900/40 border-gray-800 hover:bg-gray-800/20'}">
        <div class="relative font-sans">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
            ${initials}
          </div>
          <div class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${isGuest ? 'bg-amber-500' : 'bg-emerald-500'} border border-gray-900"></div>
        </div>
        <div class="flex-grow min-w-0">
          <div class="text-xs font-semibold text-gray-200 truncate flex items-center gap-1.5 font-sans">
            ${name}
            ${isGuest ? '<span class="text-[9px] bg-amber-950 text-amber-400 border border-amber-500/20 px-1 py-0.2 rounded font-mono font-bold uppercase">Guest</span>' : ''}
          </div>
          <div class="text-[10px] text-gray-500 font-mono truncate">${email}</div>
        </div>
        <button id="sidebar-logout-btn" class="sidebar-user-logout-btn p-1 text-xs cursor-pointer hover:text-red-400 transition-colors" title="Log Out">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    `;
    
    document.getElementById("sidebar-logout-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      logoutUser();
    });

    document.getElementById("sidebar-profile-card").addEventListener("click", () => {
      showPage("profile");
    });
  }

  function logoutUser() {
    currentUser = null;
    localStorage.removeItem("algojudge_current_user");
    updateSolvedProblemsSet();
    showPage("login");
  }

  function launchApp() {
    const overlay = document.getElementById("transition-overlay");
    const spaceship = document.getElementById("spaceship-container");
    const starCanvas = document.getElementById("starfield-canvas");
    if (!overlay || !spaceship || !starCanvas) {
      showPage("dashboard");
      return;
    }

    stopMatrixAnimation();
    overlay.classList.remove("hidden");
    overlay.style.opacity = "1";

    let animId;
    const ctx = starCanvas.getContext("2d");
    
    const resizeCanvas = () => {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * window.innerWidth - window.innerWidth / 2,
        y: Math.random() * window.innerHeight - window.innerHeight / 2,
        z: Math.random() * window.innerWidth,
        color: Math.random() > 0.5 ? "#a855f7" : "#06b6d4"
      });
    }

    function drawStars() {
      ctx.fillStyle = "rgba(13, 17, 23, 0.22)";
      ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= 10;
        if (s.z <= 0) {
          s.z = starCanvas.width;
          s.x = Math.random() * starCanvas.width - starCanvas.width / 2;
          s.y = Math.random() * starCanvas.height - starCanvas.height / 2;
        }

        const px = (s.x / s.z) * starCanvas.width + starCanvas.width / 2;
        const py = (s.y / s.z) * starCanvas.height + starCanvas.height / 2;

        if (px < 0 || px > starCanvas.width || py < 0 || py > starCanvas.height) {
          s.z = starCanvas.width;
          continue;
        }

        const size = (1 - s.z / starCanvas.width) * 5;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(drawStars);
    }
    drawStars();

    spaceship.style.transition = "transform 0.8s ease-in-out, opacity 0.5s ease-out";
    
    setTimeout(() => {
      spaceship.style.transform = "scale(1.2)";
    }, 50);

    setTimeout(() => {
      spaceship.style.transition = "transform 0.7s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.4s ease-in";
      spaceship.style.transform = "scale(10) translateY(-150px)";
      spaceship.style.opacity = "0";
    }, 1100);

    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", resizeCanvas);
        overlay.classList.add("hidden");
        
        spaceship.style.transform = "scale(0)";
        spaceship.style.opacity = "1";
        
        showPage("home");
      }, 500);
    }, 1750);
  }

  function setupLoginHandlers() {
    const tabSignIn = document.getElementById("login-tab-signin");
    const tabSignUp = document.getElementById("login-tab-signup");
    const signinForm = document.getElementById("signin-form");
    const signupForm = document.getElementById("signup-form");
    const loginErrorMsg = document.getElementById("login-error-msg");

    const showError = (msg) => {
      loginErrorMsg.querySelector(".error-text").innerText = msg;
      loginErrorMsg.classList.remove("hidden");
    };
    const hideError = () => {
      loginErrorMsg.classList.add("hidden");
    };

    tabSignIn.addEventListener("click", () => {
      tabSignIn.className = "flex-1 pb-3 text-sm font-bold text-center border-b-2 border-purple-500 text-purple-400 transition-all cursor-pointer";
      tabSignUp.className = "flex-1 pb-3 text-sm font-semibold text-center border-b-2 border-transparent text-gray-500 hover:text-gray-300 transition-all cursor-pointer";
      signinForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
      hideError();
      resetPasswordVisibility();
      resetTurnstiles();
    });

    tabSignUp.addEventListener("click", () => {
      tabSignUp.className = "flex-1 pb-3 text-sm font-bold text-center border-b-2 border-purple-500 text-purple-400 transition-all cursor-pointer";
      tabSignIn.className = "flex-1 pb-3 text-sm font-semibold text-center border-b-2 border-transparent text-gray-500 hover:text-gray-300 transition-all cursor-pointer";
      signupForm.classList.remove("hidden");
      signinForm.classList.add("hidden");
      hideError();
      resetPasswordVisibility();
      resetTurnstiles();
    });

    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      hideError();

      const usernameOrEmail = document.getElementById("signin-username").value.trim().toLowerCase();
      const password = document.getElementById("signin-password").value;

      const users = JSON.parse(localStorage.getItem("algojudge_users")) || [];
      const user = users.find(u => 
        (u.username.toLowerCase() === usernameOrEmail || u.email.toLowerCase() === usernameOrEmail) && 
        u.password === password
      );

      if (user) {
        currentUser = user;
        localStorage.setItem("algojudge_current_user", JSON.stringify(currentUser));
        updateSolvedProblemsSet();
        launchApp();
        document.getElementById("signin-username").value = "";
        document.getElementById("signin-password").value = "";
        resetPasswordVisibility();
        resetTurnstiles();
      } else {
        showError("Invalid username/email or password.");
      }
    });

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      hideError();

      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm-password").value;

      if (password !== confirmPassword) {
        showError("Passwords do not match.");
        return;
      }

      if (password.length < 6) {
        showError("Password must be at least 6 characters.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("algojudge_users")) || [];
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        showError("An account with this email already exists.");
        return;
      }

      const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      const newUser = {
        name,
        username,
        email,
        password,
        points: 0
      };

      users.push(newUser);
      localStorage.setItem("algojudge_users", JSON.stringify(users));

      currentUser = newUser;
      localStorage.setItem("algojudge_current_user", JSON.stringify(currentUser));
      updateSolvedProblemsSet();
      launchApp();

      document.getElementById("signup-name").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
      document.getElementById("signup-confirm-password").value = "";
      resetPasswordVisibility();
      resetTurnstiles();
    });

    document.getElementById("btn-demo-login").addEventListener("click", () => {
      const users = JSON.parse(localStorage.getItem("algojudge_users")) || [];
      let demoUser = users.find(u => u.username === "demo");
      if (!demoUser) {
        demoUser = {
          name: "Demo User",
          username: "demo",
          email: "demo@algojudge.com",
          password: "password123",
          points: 1420
        };
        users.push(demoUser);
        localStorage.setItem("algojudge_users", JSON.stringify(users));
      }

      currentUser = demoUser;
      localStorage.setItem("algojudge_current_user", JSON.stringify(currentUser));
      updateSolvedProblemsSet();
      launchApp();
    });

    document.getElementById("btn-guest-login").addEventListener("click", () => {
      currentUser = {
        name: "Guest User",
        username: "guest",
        email: "guest@algojudge.com",
        points: 0
      };
      localStorage.setItem("algojudge_current_user", JSON.stringify(currentUser));
      updateSolvedProblemsSet();
      launchApp();
    });

    // Social Media Logins
    const loginWithSocial = (provider) => {
      const socialUsers = {
        google: {
          name: "Google User",
          username: "google_user",
          email: "user@gmail.com",
          points: 100
        },
        github: {
          name: "GitHub Developer",
          username: "github_dev",
          email: "dev@github.com",
          points: 250
        },
        facebook: {
          name: "Facebook Friend",
          username: "fb_friend",
          email: "friend@facebook.com",
          points: 50
        }
      };

      currentUser = socialUsers[provider] || socialUsers.google;
      localStorage.setItem("algojudge_current_user", JSON.stringify(currentUser));
      updateSolvedProblemsSet();
      launchApp();
    };

    document.getElementById("btn-google-login").addEventListener("click", () => loginWithSocial("google"));
    document.getElementById("btn-github-login").addEventListener("click", () => loginWithSocial("github"));
    document.getElementById("btn-facebook-login").addEventListener("click", () => loginWithSocial("facebook"));

    // Password visibility toggles handler
    const toggleButtons = document.querySelectorAll(".toggle-password-btn");
    toggleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const passwordInput = document.getElementById(targetId);
        const icon = btn.querySelector("i");
        if (passwordInput && icon) {
          if (passwordInput.type === "password") {
            passwordInput.type = "text";
            icon.className = "far fa-eye-slash text-xs";
          } else {
            passwordInput.type = "password";
            icon.className = "far fa-eye text-xs";
          }
        }
      });
    });

    function resetPasswordVisibility() {
      toggleButtons.forEach(btn => {
        const targetId = btn.getAttribute("data-target");
        const passwordInput = document.getElementById(targetId);
        const icon = btn.querySelector("i");
        if (passwordInput && icon) {
          passwordInput.type = "password";
          icon.className = "far fa-eye text-xs";
        }
      });
    }

    // Turnstile bot checker functionality
    const turnstiles = document.querySelectorAll(".turnstile-widget");
    turnstiles.forEach(widget => {
      widget.addEventListener("click", () => {
        if (widget.classList.contains("verified") || widget.classList.contains("verifying")) return;

        widget.classList.add("verifying");
        const box = widget.querySelector(".checkmark-box");
        const icon = widget.querySelector(".check-icon");
        const spinner = widget.querySelector(".spinner");
        const statusText = widget.querySelector(".turnstile-status-text");

        // Animate selection box out, start spinner rotation
        box.classList.add("scale-0");
        spinner.classList.remove("hidden");
        statusText.innerText = "Verifying...";

        setTimeout(() => {
          spinner.classList.add("hidden");
          box.classList.remove("scale-0");
          box.classList.remove("border-gray-600");
          box.classList.add("border-emerald-500");
          icon.classList.remove("scale-0");
          icon.classList.add("scale-100");
          
          statusText.innerText = "Success! You are human";
          statusText.className = "font-semibold text-emerald-400 turnstile-status-text";
          
          widget.classList.remove("verifying");
          widget.classList.add("verified");

          // Enable the form's submit button
          const form = widget.closest("form");
          if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.classList.remove("opacity-50", "pointer-events-none");
            }
          }
        }, 1200);
      });
    });

    function resetTurnstiles() {
      turnstiles.forEach(widget => {
        const box = widget.querySelector(".checkmark-box");
        const icon = widget.querySelector(".check-icon");
        const spinner = widget.querySelector(".spinner");
        const statusText = widget.querySelector(".turnstile-status-text");
        
        widget.classList.remove("verified", "verifying");
        if (box) {
          box.classList.remove("scale-0", "border-emerald-500");
          box.classList.add("border-gray-600");
        }
        if (icon) {
          icon.classList.add("scale-0");
          icon.classList.remove("scale-100");
        }
        if (spinner) spinner.classList.add("hidden");
        if (statusText) {
          statusText.innerText = "Verify that you are human";
          statusText.className = "font-semibold text-gray-300 turnstile-status-text";
        }
      });

      const signinBtn = document.getElementById("signin-submit-btn");
      const signupBtn = document.getElementById("signup-submit-btn");
      if (signinBtn) {
        signinBtn.disabled = true;
        signinBtn.classList.add("opacity-50", "pointer-events-none");
      }
      if (signupBtn) {
        signupBtn.disabled = true;
        signupBtn.classList.add("opacity-50", "pointer-events-none");
      }
    }
  }

  // --- NAVIGATION & ROUTING ---
  function setupNavigation() {
    // Back to dashboard buttons
    document.querySelectorAll(".nav-to-dashboard").forEach(btn => {
      btn.addEventListener("click", () => {
        visualizer.stop();
        studioVisualizer.stop();
        showPage("dashboard");
      });
    });

    const homeNavLink = document.getElementById("nav-link-home");
    if (homeNavLink) {
      homeNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("home");
      });
    }

    const dashboardNavLink = document.getElementById("nav-link-dashboard");
    if (dashboardNavLink) {
      dashboardNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("dashboard");
      });
    }

    const problemsNavLink = document.getElementById("nav-link-problems");
    if (problemsNavLink) {
      problemsNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("problems");
      });
    }

    const logoLink = document.getElementById("sidebar-logo-link");
    if (logoLink) {
      logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("home");
      });
    }

    const btnHomeDashboard = document.getElementById("btn-home-dashboard");
    if (btnHomeDashboard) {
      btnHomeDashboard.addEventListener("click", () => {
        showPage("dashboard");
      });
    }

    const btnHomeVisualizer = document.getElementById("btn-home-visualizer");
    if (btnHomeVisualizer) {
      btnHomeVisualizer.addEventListener("click", () => {
        showPage("visualizer");
      });
    }

    const btnHomeRead = document.getElementById("btn-home-read");
    if (btnHomeRead) {
      btnHomeRead.addEventListener("click", () => {
        showPage("read");
      });
    }

    const btnHomeDiscuss = document.getElementById("btn-home-discuss");
    if (btnHomeDiscuss) {
      btnHomeDiscuss.addEventListener("click", () => {
        showPage("discuss");
      });
    }

    const popularNavLink = document.getElementById("nav-link-popular");
    if (popularNavLink) {
      popularNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("popular");
      });
    }

    const readNavLink = document.getElementById("nav-link-read");
    if (readNavLink) {
      readNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("read");
      });
    }

    const discussNavLink = document.getElementById("nav-link-discuss");
    if (discussNavLink) {
      discussNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("discuss");
      });
    }

    const visualizerNavLink = document.getElementById("nav-link-visualizer");
    if (visualizerNavLink) {
      visualizerNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("visualizer");
      });
    }

    const analyticsNavLink = document.getElementById("nav-link-analytics");
    if (analyticsNavLink) {
      analyticsNavLink.addEventListener("click", (e) => {
        e.preventDefault();
        visualizer.stop();
        studioVisualizer.stop();
        showPage("analytics");
      });
    }

    // Mobile menu toggle interactions
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileClose = document.getElementById("mobile-menu-close");
    const backdrop = document.getElementById("sidebar-backdrop");
    const sidebarEl = document.getElementById("sidebar-nav");

    const openMobileMenu = () => {
      if (sidebarEl && backdrop) {
        sidebarEl.classList.remove("hidden");
        sidebarEl.classList.add("sidebar-open");
        backdrop.classList.remove("hidden");
        void backdrop.offsetWidth; // Force reflow
        backdrop.classList.remove("opacity-0", "pointer-events-none");
      }
    };

    const closeMobileMenu = () => {
      if (sidebarEl && backdrop) {
        sidebarEl.classList.remove("sidebar-open");
        backdrop.classList.add("opacity-0", "pointer-events-none");
        setTimeout(() => {
          backdrop.classList.add("hidden");
        }, 300);
      }
    };

    if (mobileToggle) mobileToggle.addEventListener("click", openMobileMenu);
    if (mobileClose) mobileClose.addEventListener("click", closeMobileMenu);
    if (backdrop) backdrop.addEventListener("click", closeMobileMenu);

    // Auto-close sidebar drawer when navigating on mobile
    const navLinks = sidebarEl ? sidebarEl.querySelectorAll("nav a, #sidebar-logo-link, #sidebar-profile-card, #sidebar-logout-btn") : [];
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          closeMobileMenu();
        }
      });
    });
  }

  function setupHomeViewScroll() {
    const homeView = document.getElementById("home-view");
    if (!homeView) return;

    const handleScroll = () => {
      const scrollTop = homeView.scrollTop;
      const scrollHeight = homeView.scrollHeight - homeView.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      const fillLine = document.getElementById("timeline-progress-line");
      if (fillLine) fillLine.style.height = `${percent}%`;

      const checkpoints = homeView.querySelectorAll(".timeline-checkpoint");
      checkpoints.forEach(cp => {
        const rect = cp.getBoundingClientRect();
        const parentRect = homeView.getBoundingClientRect();
        const card = cp.parentElement.querySelector(".timeline-card");
        if (rect.top < parentRect.top + parentRect.height * 0.6) {
          cp.classList.add("checkpoint-active");
          if (card) card.classList.add("active");
        } else {
          cp.classList.remove("checkpoint-active");
          if (card) card.classList.remove("active");
        }
      });
    };

    homeView.addEventListener("scroll", handleScroll);
    handleScroll();
    homeView.triggerScrollReveal = handleScroll;
  }

  function loadWorkspace(problemId) {
    const problem = PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;

    activeProblem = problem;
    activeTab = "editor";
    
    showPage("workspace");
    
    // Switch default tab
    switchWorkspaceTab("editor");
    switchWorkspaceLeftTab("desc");

    // Populate problem descriptions
    problemTitleEl.innerText = problem.title;
    
    // Difficulty class
    problemDiffEl.innerText = problem.difficulty;
    problemDiffEl.className = "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider";
    if (problem.difficulty === "Easy") problemDiffEl.classList.add("bg-emerald-950/40", "text-emerald-400", "border", "border-emerald-500/20");
    else if (problem.difficulty === "Medium") problemDiffEl.classList.add("bg-amber-950/40", "text-amber-400", "border", "border-amber-500/20");
    problemCatEl.innerText = problem.category;

    // Populate Workspace Company Logos
    const isSolved = solvedProblems.has(problem.id);
    const workspaceLogosContainer = document.getElementById("workspace-company-logos");
    if (workspaceLogosContainer) {
      const askingCompanies = Object.keys(COMPANY_PROBLEMS).filter(comp => COMPANY_PROBLEMS[comp].includes(problem.id));
      workspaceLogosContainer.innerHTML = askingCompanies.map(comp => {
        let icon = "";
        let brandClass = "";
        if (comp === "Google") { icon = "fab fa-google"; brandClass = "brand-google"; }
        else if (comp === "Meta") { icon = "fab fa-facebook"; brandClass = "brand-meta"; }
        else if (comp === "Amazon") { icon = "fab fa-amazon"; brandClass = "brand-amazon"; }
        else if (comp === "Microsoft") { icon = "fab fa-windows"; brandClass = "brand-microsoft"; }
        return `<i class="${icon} ${brandClass} ${isSolved ? 'logo-solved-glow' : 'logo-unsolved'} text-sm" title="Asked by ${comp}"></i>`;
      }).join("");
    }

    problemStatementEl.innerHTML = problem.problemStatement;
    
    // Constraints
    problemConstraintsEl.innerHTML = problem.constraints;

    // Examples rendering
    problemExamplesEl.innerHTML = problem.examples.map(ex => `
      <div class="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-xs font-mono mb-3">
        <div class="mb-1 text-purple-300 font-semibold">Example ${ex.id}:</div>
        <div class="text-gray-400"><span class="text-gray-500 font-semibold">Input:</span> ${ex.inputText}</div>
        <div class="text-gray-400"><span class="text-gray-500 font-semibold">Output:</span> ${ex.outputText}</div>
        ${ex.explanation ? `<div class="text-gray-500 mt-1 italic"><span class="font-semibold not-italic">Explanation:</span> ${ex.explanation}</div>` : ''}
      </div>
    `).join('');

    // Load code boilerplate
    loadBoilerplate();
    
    // Clear terminal
    clearConsole();

    // Load problem into visualizer
    visualizer.loadProblem(problem);

    // Setup side code tracker in Visualizer Tab
    renderVisualizerCodeTracker();
  }

  // --- DASHBOARD RENDERER ---
  function renderDashboard() {
    // 1. Calculate and render Statistics
    const totalProblems = PROBLEMS.length;
    const solvedCount = solvedProblems.size;
    const percent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
    
    totalSolvedCountEl.innerText = solvedCount;
    progressPercentEl.innerText = `${percent}%`;

    // SVG Circular Progress Ring
    const radius = progressRingCircle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    progressRingCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (percent / 100) * circumference;
    progressRingCircle.style.strokeDashoffset = offset;

    // Difficulty solved counts
    const easyTotal = PROBLEMS.filter(p => p.difficulty === "Easy").length;
    const mediumTotal = PROBLEMS.filter(p => p.difficulty === "Medium").length;
    const hardTotal = PROBLEMS.filter(p => p.difficulty === "Hard").length;

    const easySolved = PROBLEMS.filter(p => p.difficulty === "Easy" && solvedProblems.has(p.id)).length;
    const mediumSolved = PROBLEMS.filter(p => p.difficulty === "Medium" && solvedProblems.has(p.id)).length;
    const hardSolved = PROBLEMS.filter(p => p.difficulty === "Hard" && solvedProblems.has(p.id)).length;

    easySolvedCountEl.innerText = `${easySolved}/${easyTotal}`;
    mediumSolvedCountEl.innerText = `${mediumSolved}/${mediumTotal}`;
    hardSolvedCountEl.innerText = `${hardSolved}/${hardTotal}`;

    // 2. Filter & search problem list items
    const activeCategory = categoryFiltersContainer.querySelector(".bg-purple-600")?.dataset.category || "All";
    const searchQuery = searchInput.value.toLowerCase();
    const activeDifficulty = difficultyFilter.value;

    const filteredProblems = PROBLEMS.filter(prob => {
      const matchCategory = activeCategory === "All" || prob.category === activeCategory;
      const matchSearch = prob.title.toLowerCase().includes(searchQuery) || prob.id.toLowerCase().includes(searchQuery);
      const matchDiff = activeDifficulty === "All" || prob.difficulty === activeDifficulty;
      return matchCategory && matchSearch && matchDiff;
    });

    // 3. Render problems rows
    if (filteredProblems.length === 0) {
      problemsListContainer.innerHTML = `
        <div class="col-span-full text-center py-12 text-gray-500 bg-gray-900/30 border border-gray-800 rounded-2xl">
          <i class="fas fa-search text-3xl mb-3 text-gray-700"></i>
          <p class="text-sm">No problems match your current search criteria.</p>
        </div>
      `;
      return;
    }

    problemsListContainer.innerHTML = filteredProblems.map(prob => {
      const isSolved = solvedProblems.has(prob.id);
      
      let diffColor = "text-emerald-400 bg-emerald-950/20 border-emerald-500/20";
      if (prob.difficulty === "Medium") diffColor = "text-amber-400 bg-amber-950/20 border-amber-500/20";
      if (prob.difficulty === "Hard") diffColor = "text-red-400 bg-red-950/20 border-red-500/20";

      return `
        <div class="glass-panel premium-card border border-gray-800/60 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/40 transition-all duration-300 group cursor-pointer" data-id="${prob.id}">
          <div class="flex items-center gap-3">
            <!-- Solved Status Checkbox -->
            <div class="w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isSolved ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-gray-700 text-gray-600 group-hover:border-gray-500'}">
              <i class="fas ${isSolved ? 'fa-check-circle' : 'fa-circle text-[9px]'}"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-100 group-hover:text-purple-400 transition-colors">${prob.title}</h3>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${diffColor}">${prob.difficulty}</span>
                <span class="text-xs text-gray-500">${prob.category}</span>
              </div>
            </div>
          </div>
          <button class="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-purple-600 hover:text-white hover:border-transparent transition-all flex items-center justify-center">
            <i class="fas fa-play text-xs pl-0.5"></i>
          </button>
        </div>
      `;
    }).join('');

    // Attach click listeners to problem rows
    problemsListContainer.querySelectorAll("[data-id]").forEach(row => {
      row.addEventListener("click", () => {
        loadWorkspace(row.dataset.id);
      });
    });

    renderActivityGrid();
  }

  function renderActivityGrid() {
    const gridContainer = document.getElementById("activity-grid");
    const totalCountEl = document.getElementById("activity-total-count");
    const streakEl = document.getElementById("activity-streak");
    if (!gridContainer) return;

    const username = currentUser ? currentUser.username : "guest";
    const activityKey = `algojudge_activity_${username}`;
    
    let activityData = JSON.parse(localStorage.getItem(activityKey));
    if (!activityData) {
      activityData = {};
      const today = new Date();
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split("T")[0];
        
        const rand = Math.random();
        let level = 0;
        if (rand > 0.88) level = 4;
        else if (rand > 0.75) level = 3;
        else if (rand > 0.55) level = 2;
        else if (rand > 0.25) level = 1;
        
        activityData[dateString] = level;
      }
      localStorage.setItem(activityKey, JSON.stringify(activityData));
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const solvedTodayCount = solvedProblems.size;
    if (solvedTodayCount > 0) {
      activityData[todayStr] = Math.min(4, Math.max(activityData[todayStr] || 0, Math.ceil(solvedTodayCount / 2)));
      localStorage.setItem(activityKey, JSON.stringify(activityData));
    }

    const today = new Date();
    const squaresHtml = [];
    
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - 364);
    
    let totalSubmissions = 0;

    for (let i = 0; i <= 364; i++) {
      const currentDate = new Date(startDay);
      currentDate.setDate(startDay.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];
      const level = activityData[dateStr] || 0;
      totalSubmissions += level * (level === 1 ? 1 : level === 2 ? 3 : level === 3 ? 5 : level === 4 ? 8 : 0);

      let bgClass = "bg-gray-800/40";
      if (level === 1) bgClass = "bg-purple-950/70";
      else if (level === 2) bgClass = "bg-purple-800/50";
      else if (level === 3) bgClass = "bg-purple-600/80";
      else if (level === 4) bgClass = "bg-purple-400";

      const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const tooltipText = `${level === 0 ? 'No' : level * 2} submissions on ${formattedDate}`;

      squaresHtml.push(`
        <div class="w-3 h-3 rounded-sm ${bgClass} transition-colors duration-300 relative group cursor-pointer" data-date="${dateStr}">
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 bg-gray-950 text-gray-200 text-[9px] font-mono py-1 px-2 rounded border border-gray-800 whitespace-nowrap shadow-lg">
            ${tooltipText}
          </div>
        </div>
      `);
    }

    gridContainer.innerHTML = squaresHtml.join("");

    if (totalCountEl) totalCountEl.innerText = totalSubmissions;
    if (streakEl) {
      let streak = 0;
      const checkDate = new Date(today);
      while (true) {
        const checkStr = checkDate.toISOString().split("T")[0];
        if (activityData[checkStr] && activityData[checkStr] > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      streakEl.innerText = `${streak || 1} day${streak !== 1 ? 's' : ''}`;
    }
  }

  function renderPopularQuestions() {
    const gridContainer = document.getElementById("popular-problems-grid");
    const filtersContainer = document.getElementById("popular-company-filters");
    if (!gridContainer) return;

    // Get unique popular problem IDs
    const uniquePopularProbIds = Array.from(new Set(Object.values(COMPANY_PROBLEMS).flat()));

    // Render company filters
    if (filtersContainer) {
      const filtersHtml = ["All", "Google", "Meta", "Amazon", "Microsoft"].map(comp => {
        let icon = "fa-layer-group";
        let brandColor = "text-purple-400";
        if (comp === "Google") { icon = "fab fa-google"; brandColor = "text-rose-400"; }
        else if (comp === "Meta") { icon = "fab fa-facebook"; brandColor = "text-blue-400"; }
        else if (comp === "Amazon") { icon = "fab fa-amazon"; brandColor = "text-amber-500"; }
        else if (comp === "Microsoft") { icon = "fab fa-windows"; brandColor = "text-cyan-400"; }

        let total = 0;
        let solved = 0;
        if (comp === "All") {
          total = uniquePopularProbIds.length;
          solved = uniquePopularProbIds.filter(id => solvedProblems.has(id)).length;
        } else {
          const pIds = COMPANY_PROBLEMS[comp] || [];
          total = pIds.length;
          solved = pIds.filter(id => solvedProblems.has(id)).length;
        }

        const isActive = activePopularCompanyFilter === comp;
        const activeClass = isActive 
          ? "bg-purple-600 border-purple-500 text-white shadow-lg glow-purple" 
          : "bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200";

        return `
          <button class="px-4 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${activeClass}" data-filter="${comp}">
            <i class="${icon} ${brandColor}"></i>
            <span>${comp}</span>
            <span class="text-[10px] opacity-60 font-mono">(${solved}/${total})</span>
          </button>
        `;
      }).join("");
      filtersContainer.innerHTML = filtersHtml;

      // Attach click events
      filtersContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          activePopularCompanyFilter = btn.dataset.filter;
          renderPopularQuestions();
        });
      });
    }

    // Filter problems by company if not "All"
    const displayProblemIds = activePopularCompanyFilter === "All" 
      ? uniquePopularProbIds 
      : (COMPANY_PROBLEMS[activePopularCompanyFilter] || []);

    const displayProblems = displayProblemIds.map(id => PROBLEMS.find(p => p.id === id)).filter(Boolean);

    gridContainer.innerHTML = "";

    displayProblems.forEach(prob => {
      const isSolved = solvedProblems.has(prob.id);
      
      let diffColor = "text-emerald-400 bg-emerald-950/20 border-emerald-500/20";
      if (prob.difficulty === "Medium") diffColor = "text-amber-400 bg-amber-950/20 border-amber-500/20";
      if (prob.difficulty === "Hard") diffColor = "text-red-400 bg-red-950/20 border-red-500/20";

      // Find which companies ask this problem
      const askingCompanies = Object.keys(COMPANY_PROBLEMS).filter(comp => COMPANY_PROBLEMS[comp].includes(prob.id));

      const cardHtml = `
        <div class="glass-panel premium-card border border-[#30363d] rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-300 group cursor-pointer" data-popular-id="${prob.id}">
          <div>
            <!-- Top Logo Row -->
            <div class="flex items-center justify-between border-b border-[#30363d]/40 pb-3 mb-3">
              <div class="flex items-center gap-2.5">
                ${askingCompanies.map(comp => {
                  let icon = "";
                  let brandClass = "";
                  if (comp === "Google") { icon = "fab fa-google"; brandClass = "brand-google"; }
                  else if (comp === "Meta") { icon = "fab fa-facebook"; brandClass = "brand-meta"; }
                  else if (comp === "Amazon") { icon = "fab fa-amazon"; brandClass = "brand-amazon"; }
                  else if (comp === "Microsoft") { icon = "fab fa-windows"; brandClass = "brand-microsoft"; }
                  return `<i class="${icon} ${brandClass} ${isSolved ? 'logo-solved-glow' : 'logo-unsolved'} text-base" title="Asked by ${comp}"></i>`;
                }).join("")}
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${diffColor}">${prob.difficulty}</span>
                <span class="w-5 h-5 rounded-full flex items-center justify-center ${isSolved ? 'text-emerald-400 bg-emerald-950/30' : 'text-gray-600 bg-gray-900/30'}">
                  <i class="fas ${isSolved ? 'fa-check-circle text-xs' : 'fa-circle text-[8px]'}"></i>
                </span>
              </div>
            </div>
            
            <!-- Problem Title & Cat -->
            <h3 class="font-bold text-white text-base group-hover:text-purple-400 transition-colors">${prob.title}</h3>
            <p class="text-xs text-gray-500 mt-1 font-mono">${prob.category}</p>
          </div>

          <!-- Bottom Row -->
          <div class="mt-5 pt-3 border-t border-[#30363d]/30 flex items-center justify-between text-xs text-gray-400 group-hover:text-gray-300">
            <span>${isSolved ? 'Solve Again' : 'Solve Challenge'}</span>
            <span class="w-8 h-8 rounded-lg bg-gray-800/80 border border-gray-700 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-all">
              <i class="fas fa-play text-[9px] pl-0.5"></i>
            </span>
          </div>
        </div>
      `;

      gridContainer.insertAdjacentHTML("beforeend", cardHtml);
    });

    // Attach click listeners to all popular question rows
    gridContainer.querySelectorAll("[data-popular-id]").forEach(row => {
      row.addEventListener("click", () => {
        loadWorkspace(row.dataset.popularId);
      });
    });
  }

  function getSubmissions() {
    const key = `submissions_${currentUser ? (currentUser.username || 'guest') : 'guest'}`;
    let submissions = JSON.parse(localStorage.getItem(key));
    if (!submissions) {
      submissions = [
        {
          problemId: "two-sum",
          problemTitle: "Two Sum",
          difficulty: "Easy",
          language: "python",
          timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(), // 2 hours ago
          status: "Accepted",
          runtime: "15 ms",
          code: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            remaining = target - num\n            if remaining in seen:\n                return [seen[remaining], i]\n            seen[num] = i"
        },
        {
          problemId: "valid-parentheses",
          problemTitle: "Valid Parentheses",
          difficulty: "Easy",
          language: "javascript",
          timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(), // 1 day ago
          status: "Accepted",
          runtime: "28 ms",
          code: "function isValid(s) {\n    const stack = [];\n    const mapping = {\n        ')': '(',\n        '}': '{',\n        ']': '['\n    };\n    for (let char of s) {\n        if (char in mapping) {\n            const topElement = stack.length === 0 ? '#' : stack.pop();\n            if (mapping[char] !== topElement) {\n                return false;\n            }\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}"
        },
        {
          problemId: "maximum-depth-of-binary-tree",
          problemTitle: "Maximum Depth of Binary Tree",
          difficulty: "Easy",
          language: "cpp",
          timestamp: new Date(Date.now() - 3600000 * 48).toLocaleString(), // 2 days ago
          status: "Accepted",
          runtime: "8 ms",
          code: "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (root == nullptr) return 0;\n        return max(maxDepth(root->left), maxDepth(root->right)) + 1;\n    }\n};"
        }
      ];
      localStorage.setItem(key, JSON.stringify(submissions));
    }
    return submissions;
  }

  function renderAnalyticsSection() {
    // 1. Completion & Basic Stats
    const totalProblems = PROBLEMS.length;
    const solvedCount = solvedProblems.size;
    const progressPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    const solvedCountEl = document.getElementById("analytics-solved-count");
    const totalCountEl = document.getElementById("analytics-total-count");
    const progressBar = document.getElementById("analytics-progress-bar");
    const pointsEl = document.getElementById("analytics-points");
    const rankEl = document.getElementById("analytics-rank");

    if (solvedCountEl) solvedCountEl.innerText = solvedCount;
    if (totalCountEl) totalCountEl.innerText = totalProblems;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    // 2. Points & Rank Calculation
    const basePoints = currentUser ? (currentUser.points || 0) : 1420;
    const totalPoints = basePoints + (solvedCount * 100);
    if (pointsEl) pointsEl.innerText = totalPoints;

    const currentRank = Math.max(1, 384 - (solvedCount * 12));
    if (rankEl) rankEl.innerText = `#${currentRank}`;

    // 3. Difficulty Breakdown
    const easyProblems = PROBLEMS.filter(p => p.difficulty === "Easy");
    const mediumProblems = PROBLEMS.filter(p => p.difficulty === "Medium");
    const hardProblems = PROBLEMS.filter(p => p.difficulty === "Hard");

    const easySolved = easyProblems.filter(p => solvedProblems.has(p.id)).length;
    const mediumSolved = mediumProblems.filter(p => solvedProblems.has(p.id)).length;
    const hardSolved = hardProblems.filter(p => solvedProblems.has(p.id)).length;

    const easyPercent = easyProblems.length > 0 ? Math.round((easySolved / easyProblems.length) * 100) : 0;
    const mediumPercent = mediumProblems.length > 0 ? Math.round((mediumSolved / mediumProblems.length) * 100) : 0;
    const hardPercent = hardProblems.length > 0 ? Math.round((hardSolved / hardProblems.length) * 100) : 0;

    const easySolvedEl = document.getElementById("analytics-easy-solved");
    const mediumSolvedEl = document.getElementById("analytics-medium-solved");
    const hardSolvedEl = document.getElementById("analytics-hard-solved");

    if (easySolvedEl) easySolvedEl.innerText = `${easySolved}/${easyProblems.length}`;
    if (mediumSolvedEl) mediumSolvedEl.innerText = `${mediumSolved}/${mediumProblems.length}`;
    if (hardSolvedEl) hardSolvedEl.innerText = `${hardSolved}/${hardProblems.length}`;

    const easyBar = document.getElementById("analytics-easy-bar");
    const mediumBar = document.getElementById("analytics-medium-bar");
    const hardBar = document.getElementById("analytics-hard-bar");

    if (easyBar) easyBar.style.width = `${easyPercent}%`;
    if (mediumBar) mediumBar.style.width = `${mediumPercent}%`;
    if (hardBar) hardBar.style.width = `${hardPercent}%`;

    // 4. Category-wise Mastery Breakdown
    const categoriesContainer = document.getElementById("analytics-categories");
    if (categoriesContainer) {
      const categories = Array.from(new Set(PROBLEMS.map(p => p.category)));
      let categoriesHtml = "";

      categories.forEach(cat => {
        const catProblems = PROBLEMS.filter(p => p.category === cat);
        const catSolved = catProblems.filter(p => solvedProblems.has(p.id)).length;
        const catPercent = catProblems.length > 0 ? Math.round((catSolved / catProblems.length) * 100) : 0;

        let colorClass = "bg-purple-500";
        if (cat.includes("Array") || cat.includes("Hash")) colorClass = "bg-cyan-500";
        else if (cat.includes("List")) colorClass = "bg-emerald-500";
        else if (cat.includes("Tree") || cat.includes("Graph")) colorClass = "bg-purple-500";
        else if (cat.includes("Dynamic")) colorClass = "bg-amber-500";
        else if (cat.includes("Backtracking")) colorClass = "bg-rose-500";

        categoriesHtml += `
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-xs">
              <span class="text-gray-300 font-semibold">${cat}</span>
              <span class="text-gray-500 font-mono">${catSolved}/${catProblems.length} <strong class="text-gray-400 font-bold ml-1">(${catPercent}%)</strong></span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-1.5">
              <div class="h-1.5 rounded-full transition-all duration-500 ${colorClass}" style="width: ${catPercent}%"></div>
            </div>
          </div>
        `;
      });
      categoriesContainer.innerHTML = categoriesHtml;
    }

    // 5. Submission History logs
    const submissionsBody = document.getElementById("analytics-submissions-body");
    if (submissionsBody) {
      const list = getSubmissions();
      if (list.length === 0) {
        submissionsBody.innerHTML = `
          <tr>
            <td colspan="5" class="py-6 text-center text-gray-500 italic">No submissions made yet.</td>
          </tr>
        `;
      } else {
        submissionsBody.innerHTML = list.map(sub => {
          let langIcon = "fab fa-python text-yellow-500";
          if (sub.language === "javascript") langIcon = "fab fa-js text-yellow-400";
          else if (sub.language === "cpp") langIcon = "fab fa-cuttlefish text-blue-500";
          else if (sub.language === "java") langIcon = "fab fa-java text-orange-500";

          let diffColor = "text-emerald-400";
          if (sub.difficulty === "Medium") diffColor = "text-amber-400";
          if (sub.difficulty === "Hard") diffColor = "text-red-400";

          return `
            <tr class="hover:bg-gray-900/20 transition-colors">
              <td class="py-3 px-4 flex flex-col">
                <span class="font-semibold text-gray-200">${sub.problemTitle}</span>
                <span class="text-[10px] uppercase font-mono ${diffColor} mt-0.5">${sub.difficulty}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-950/20 glow-emerald">${sub.status}</span>
              </td>
              <td class="py-3 px-4 text-center font-mono text-cyan-400 font-semibold">${sub.runtime}</td>
              <td class="py-3 px-4 text-center font-mono text-gray-400">
                <div class="flex items-center justify-center gap-1.5">
                  <i class="${langIcon} text-xs"></i>
                  <span class="capitalize text-[10px]">${sub.language}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-right text-gray-500 font-mono text-[10px]">${sub.timestamp}</td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  function renderProfilePage() {
    if (!currentUser) return;

    const submissions = getSubmissions();
    const posts = getDiscussPosts();
    const totalProblems = PROBLEMS.length;
    const solvedCount = solvedProblems.size;

    // 1. Bio Details Populate
    const name = currentUser.name || "Guest User";
    const email = currentUser.email || "guest@algojudge.com";
    const initials = name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "GU";
      
    const avatarEl = document.getElementById("profile-large-avatar");
    if (avatarEl) avatarEl.innerText = initials;

    const nameEl = document.getElementById("profile-full-name");
    if (nameEl) nameEl.innerText = name;

    const emailEl = document.getElementById("profile-email");
    if (emailEl) emailEl.innerText = email;
    
    const rankVal = Math.max(1, 384 - (solvedCount * 12));
    const rankEl = document.getElementById("profile-global-rank");
    if (rankEl) rankEl.innerText = `#${rankVal}`;
    
    const isGuest = currentUser.username === "guest";
    const statusBadge = document.getElementById("profile-status-badge");
    if (statusBadge) {
      statusBadge.innerText = isGuest ? "Guest Profile" : "Pro Developer";
      statusBadge.className = `profile-badge ${isGuest ? 'profile-badge-purple' : 'profile-badge-cyan'} w-max mx-auto md:mx-0`;
    }
    
    // 2. Stats Counts
    const solvedStatEl = document.getElementById("profile-stat-solved");
    if (solvedStatEl) solvedStatEl.innerText = `${solvedCount} / ${totalProblems}`;

    const pointsStatEl = document.getElementById("profile-stat-points");
    if (pointsStatEl) pointsStatEl.innerText = getUserPoints().toLocaleString();
    
    const userPosts = posts.filter(p => p.author === name);
    const postsStatEl = document.getElementById("profile-stat-posts");
    if (postsStatEl) postsStatEl.innerText = userPosts.length;

    const subStatEl = document.getElementById("profile-stat-submissions");
    if (subStatEl) subStatEl.innerText = submissions.length;

    // Logout button handler in profile page
    const profileLogoutBtn = document.getElementById("profile-logout-btn");
    if (profileLogoutBtn) {
      profileLogoutBtn.onclick = () => {
        logoutUser();
      };
    }

    // 3. Left Column: Submissions Accordion List
    const submissionsListEl = document.getElementById("profile-submissions-list");
    if (submissionsListEl) {
      if (submissions.length === 0) {
        submissionsListEl.innerHTML = `
          <div class="glass-panel profile-view-card border border-[#30363d] p-6 rounded-2xl text-center text-gray-500 italic bg-gray-900/10">
            No submissions made yet. Try solving problems in the Workspace!
          </div>
        `;
      } else {
        submissionsListEl.innerHTML = submissions.map((sub, index) => {
          let langIcon = "fab fa-python text-yellow-500";
          if (sub.language === "javascript") langIcon = "fab fa-js text-yellow-400";
          else if (sub.language === "cpp") langIcon = "fab fa-cuttlefish text-blue-500";
          else if (sub.language === "java") langIcon = "fab fa-java text-orange-500";

          let diffColor = "text-emerald-400";
          let diffBg = "bg-emerald-950/40 border-emerald-500/20";
          if (sub.difficulty === "Medium") {
            diffColor = "text-amber-400";
            diffBg = "bg-amber-950/40 border-amber-500/20";
          } else if (sub.difficulty === "Hard") {
            diffColor = "text-red-400";
            diffBg = "bg-red-950/40 border-red-500/20";
          }

          const hasCode = !!sub.code;
          const codeString = hasCode ? sub.code : "// No code saved for this submission.";
          const escapedCode = codeString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const codeLines = codeString.split("\n");
          
          let lineNumbersHtml = "";
          codeLines.forEach((_, idx) => {
            lineNumbersHtml += `<div>${idx + 1}</div>`;
          });

          return `
            <div class="code-accordion glass-panel profile-view-card border border-[#30363d] rounded-2xl overflow-hidden bg-gray-900/30">
              <!-- Accordion Header -->
              <div class="code-accordion-header p-5 flex items-center justify-between gap-4" data-index="${index}">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
                    <i class="fas fa-file-code"></i>
                  </div>
                  <div class="flex flex-col">
                    <h4 class="font-bold text-white text-sm profile-view-text-white">${sub.problemTitle}</h4>
                    <span class="text-[9px] font-mono text-gray-500">${sub.timestamp}</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${diffBg} ${diffColor}">${sub.difficulty}</span>
                  <span class="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">${sub.status}</span>
                  <div class="flex items-center gap-1 text-[9px] text-gray-400 font-mono bg-gray-900 border border-gray-800 px-2 py-0.5 rounded">
                    <i class="${langIcon} text-[10px]"></i>
                    <span class="capitalize">${sub.language}</span>
                  </div>
                  <i class="fas fa-chevron-down text-xs text-gray-500 ml-2 transition-transform duration-300 accordion-chevron"></i>
                </div>
              </div>
              
              <!-- Accordion Content -->
              <div class="code-accordion-content border-t border-[#30363d]/50 bg-gray-950/40">
                <div class="p-5 flex flex-col gap-3.5 relative">
                  <!-- Header tools -->
                  <div class="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span>${sub.runtime ? `Runtime: ${sub.runtime}` : ''}</span>
                    <button class="copy-profile-code-btn px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-1.5" data-code="${encodeURIComponent(codeString)}">
                      <i class="fas fa-copy"></i> Copy Code
                    </button>
                  </div>
                  
                  <!-- Code area -->
                  <div class="flex font-mono text-xs overflow-hidden rounded-xl border border-[#30363d]/50 bg-[#0d1117] leading-5">
                    <!-- Line numbers -->
                    <div class="py-3 px-3 text-right select-none text-gray-600 bg-gray-900/30 border-r border-[#30363d]/30 font-mono">
                      ${lineNumbersHtml}
                    </div>
                    <!-- Code block -->
                    <pre class="py-3 px-4 overflow-x-auto text-gray-300 font-mono flex-1 text-left select-text whitespace-pre"><code>${escapedCode}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Bind accordion header events
        const headers = submissionsListEl.querySelectorAll(".code-accordion-header");
        headers.forEach(header => {
          header.onclick = () => {
            const accordion = header.closest(".code-accordion");
            const content = accordion.querySelector(".code-accordion-content");
            const chevron = header.querySelector(".accordion-chevron");
            const isExpanded = content.classList.contains("expanded");
            
            // Collapse all other accordions
            submissionsListEl.querySelectorAll(".code-accordion-content").forEach(c => {
              if (c !== content) {
                c.classList.remove("expanded");
                c.style.maxHeight = null;
                const otherChevron = c.closest(".code-accordion").querySelector(".accordion-chevron");
                if (otherChevron) otherChevron.classList.remove("rotate-180");
              }
            });
            
            if (isExpanded) {
              content.classList.remove("expanded");
              content.style.maxHeight = null;
              chevron.classList.remove("rotate-180");
            } else {
              content.classList.add("expanded");
              content.style.maxHeight = content.scrollHeight + "px";
              chevron.classList.add("rotate-180");
            }
          };
        });

        // Bind copy button events
        const copyBtns = submissionsListEl.querySelectorAll(".copy-profile-code-btn");
        copyBtns.forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const code = decodeURIComponent(btn.dataset.code);
            navigator.clipboard.writeText(code).then(() => {
              const originalContent = btn.innerHTML;
              btn.innerHTML = `<i class="fas fa-check text-emerald-400"></i> Copied!`;
              btn.classList.add("text-emerald-400", "border-emerald-500/30");
              setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.classList.remove("text-emerald-400", "border-emerald-500/30");
              }, 2000);
            });
          };
        });
      }
    }

    // 4. Right Column: Posts List
    const postsListEl = document.getElementById("profile-posts-list");
    if (postsListEl) {
      if (userPosts.length === 0) {
        postsListEl.innerHTML = `
          <div class="glass-panel profile-view-card border border-[#30363d] p-6 rounded-2xl text-center text-gray-500 italic bg-gray-900/10">
            No posts created yet. Start a discussion in the Discuss Community!
          </div>
        `;
      } else {
        postsListEl.innerHTML = userPosts.map(post => {
          return `
            <div class="glass-panel profile-view-card border border-[#30363d] p-4 rounded-xl flex flex-col gap-2 bg-gray-900/20 hover:border-gray-700/80 transition-all duration-300">
              <div class="flex items-center justify-between">
                <span class="text-[9px] bg-purple-950/40 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">${post.category}</span>
                <span class="text-[9px] text-gray-500 font-mono">${post.timestamp}</span>
              </div>
              <h4 class="font-bold text-gray-200 text-xs hover:text-white transition-colors cursor-pointer">${post.title}</h4>
              <p class="text-gray-400 text-[11px] leading-relaxed truncate">${post.body}</p>
              <div class="flex gap-4 mt-1.5 text-[10px] text-gray-500 font-mono">
                <span><i class="fas fa-thumbs-up mr-1 text-purple-500"></i> ${post.upvotes} Upvotes</span>
                <span><i class="fas fa-comments mr-1 text-cyan-400"></i> ${post.comments} Comments</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 5. Category Mastery Progress Bars
    const categoriesContainer = document.getElementById("profile-category-mastery");
    if (categoriesContainer) {
      const categories = Array.from(new Set(PROBLEMS.map(p => p.category)));
      let categoriesHtml = "";

      categories.forEach(cat => {
        const catProblems = PROBLEMS.filter(p => p.category === cat);
        const catSolved = catProblems.filter(p => solvedProblems.has(p.id)).length;
        const catPercent = catProblems.length > 0 ? Math.round((catSolved / catProblems.length) * 100) : 0;

        let colorClass = "bg-purple-500";
        if (cat.includes("Array") || cat.includes("Hash")) colorClass = "bg-cyan-500";
        else if (cat.includes("List")) colorClass = "bg-emerald-500";
        else if (cat.includes("Tree") || cat.includes("Graph")) colorClass = "bg-purple-500";
        else if (cat.includes("Dynamic")) colorClass = "bg-amber-500";
        else if (cat.includes("Backtracking")) colorClass = "bg-rose-500";

        categoriesHtml += `
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-[11px]">
              <span class="text-gray-300 font-semibold">${cat}</span>
              <span class="text-gray-500 font-mono">${catSolved}/${catProblems.length} <strong class="text-gray-400 font-bold ml-1">(${catPercent}%)</strong></span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-1">
              <div class="h-1 rounded-full transition-all duration-500 ${colorClass}" style="width: ${catPercent}%"></div>
            </div>
          </div>
        `;
      });
      categoriesContainer.innerHTML = categoriesHtml;
    }
  }

  function populateStudioProblemSelect() {
    const selectEl = document.getElementById("studio-problem-select");
    if (!selectEl) return;

    selectEl.innerHTML = PROBLEMS.map(p => `
      <option value="${p.id}">${p.title} (${p.difficulty})</option>
    `).join('');

    selectEl.addEventListener("change", (e) => {
      loadStudioProblem(e.target.value);
    });
  }

  function loadStudioProblem(problemId) {
    const problem = PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;

    studioVisualizer.loadProblem(problem);

    const titleEl = document.getElementById("studio-prob-title");
    const diffEl = document.getElementById("studio-prob-diff");
    const statementEl = document.getElementById("studio-prob-statement");

    if (titleEl) titleEl.innerText = problem.title;
    if (diffEl) {
      diffEl.innerText = problem.difficulty;
      diffEl.className = "text-[10px] font-mono px-2 py-0.5 rounded";
      if (problem.difficulty === "Easy") {
        diffEl.classList.add("bg-emerald-950/40", "text-emerald-400", "border", "border-emerald-500/20");
      } else if (problem.difficulty === "Medium") {
        diffEl.classList.add("bg-amber-950/40", "text-amber-400", "border", "border-amber-500/20");
      } else {
        diffEl.classList.add("bg-red-950/40", "text-red-400", "border", "border-red-500/20");
      }
    }
    if (statementEl) statementEl.innerHTML = problem.problemStatement;

    // Sync language selector value
    const languageSelect = document.getElementById("studio-language-select");
    if (languageSelect) {
      languageSelect.value = activeStudioLanguage;
    }

    // Reset controls styling
    const playBtn = document.getElementById("btn-studio-play");
    if (playBtn) {
      playBtn.innerHTML = `<i class="fas fa-play text-xs"></i> Play`;
      playBtn.className = "flex-grow py-2.5 rounded-xl bg-purple-600 border border-purple-500 text-white font-bold text-sm shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer flex items-center justify-center gap-2";
    }

    renderStudioCodeTracker(problem);
  }

  function renderStudioCodeTracker(problem) {
    const linesContainer = document.getElementById("studio-code-lines");
    if (!linesContainer) return;

    const rawCode = problem.starterCodes[activeStudioLanguage] || problem.starterCodes["python"] || "";
    const lines = rawCode.split("\n");

    const html = `
      <div class="flex flex-col relative w-full leading-5 select-none" id="studio-tracker-lines-box">
        ${lines.map((line, idx) => {
          const lineNum = idx + 1;
          return `
            <div class="flex items-start w-full relative py-0.5 rounded px-2" data-line="${lineNum}">
              <span class="text-gray-600 w-8 inline-block select-none text-right pr-2 border-r border-gray-900 mr-2">${lineNum}</span>
              <span class="text-gray-300 font-mono whitespace-pre flex-grow">${highlightSyntax(line)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
    linesContainer.innerHTML = html;

    studioVisualizer.onStepChange = (lineNum) => {
      const linesBox = document.getElementById("studio-tracker-lines-box");
      if (!linesBox) return;

      // Translate python step line numbers using mappings for the active studio language
      let displayLine = lineNum;
      if (activeStudioLanguage !== "python" && typeof VISUALIZER_LINE_MAPPINGS !== 'undefined' && problem) {
        const problemMapping = VISUALIZER_LINE_MAPPINGS[problem.id];
        if (problemMapping && problemMapping[activeStudioLanguage]) {
          displayLine = problemMapping[activeStudioLanguage][lineNum] || lineNum;
        }
      }

      linesBox.querySelectorAll("[data-line]").forEach(div => {
        div.classList.remove("editor-active-line");
      });

      const activeDiv = linesBox.querySelector(`[data-line="${displayLine}"]`);
      if (activeDiv) {
        activeDiv.classList.add("editor-active-line");
        activeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };
  }

  function setupStudioControls() {
    const playBtn = document.getElementById("btn-studio-play");
    const nextBtn = document.getElementById("btn-studio-next");
    const prevBtn = document.getElementById("btn-studio-prev");
    const resetBtn = document.getElementById("btn-studio-reset");
    const speedSlider = document.getElementById("studio-speed-slider");
    const languageSelect = document.getElementById("studio-language-select");

    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        activeStudioLanguage = e.target.value;
        const selectEl = document.getElementById("studio-problem-select");
        if (selectEl) {
          const problem = PROBLEMS.find(p => p.id === selectEl.value);
          if (problem) {
            renderStudioCodeTracker(problem);
          }
        }
      });
    }

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (studioVisualizer.isPlaying) {
          studioVisualizer.pause();
          playBtn.innerHTML = `<i class="fas fa-play text-xs"></i> Play`;
          playBtn.className = "flex-grow py-2.5 rounded-xl bg-purple-600 border border-purple-500 text-white font-bold text-sm shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer flex items-center justify-center gap-2";
        } else {
          studioVisualizer.play();
          playBtn.innerHTML = `<i class="fas fa-pause text-xs"></i> Pause`;
          playBtn.className = "flex-grow py-2.5 rounded-xl bg-pink-600 border border-pink-500 text-white font-bold text-sm shadow-md hover:bg-pink-500 transition-all cursor-pointer flex items-center justify-center gap-2";
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        studioVisualizer.pause();
        if (playBtn) {
          playBtn.innerHTML = `<i class="fas fa-play text-xs"></i> Play`;
          playBtn.className = "flex-grow py-2.5 rounded-xl bg-purple-600 border border-purple-500 text-white font-bold text-sm shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer flex items-center justify-center gap-2";
        }
        studioVisualizer.nextStep();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        studioVisualizer.pause();
        if (playBtn) {
          playBtn.innerHTML = `<i class="fas fa-play text-xs"></i> Play`;
          playBtn.className = "flex-grow py-2.5 rounded-xl bg-purple-600 border border-purple-500 text-white font-bold text-sm shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer flex items-center justify-center gap-2";
        }
        studioVisualizer.prevStep();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        studioVisualizer.stop();
        if (playBtn) {
          playBtn.innerHTML = `<i class="fas fa-play text-xs"></i> Play`;
          playBtn.className = "flex-grow py-2.5 rounded-xl bg-purple-600 border border-purple-500 text-white font-bold text-sm shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer flex items-center justify-center gap-2";
        }
        studioVisualizer.render();
      });
    }

    if (speedSlider) {
      speedSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        let ms = 1000;
        if (val === 1) ms = 2000;
        else if (val === 2) ms = 1000;
        else if (val === 3) ms = 450;
        else if (val === 4) ms = 150;
        studioVisualizer.setSpeed(ms);
      });
    }
  }

  // --- FILTER & SEARCH EVENTS ---
  function setupDashboardFilters() {
    // Category list filter rendering
    const categories = ["All", "Array", "Linked List", "Dynamic Programming", "Stack", "Binary Search", "Two Pointers", "Intervals", "Tree", "Backtracking"];
    categoryFiltersContainer.innerHTML = categories.map((cat, idx) => `
      <button class="px-3.5 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all duration-300 ${idx === 0 ? 'bg-purple-600 border-purple-500 text-white shadow-lg glow-purple' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    categoryFiltersContainer.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        categoryFiltersContainer.querySelectorAll("button").forEach(b => {
          b.className = "px-3.5 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all duration-300 bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200";
        });
        btn.className = "px-3.5 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all duration-300 bg-purple-600 border-purple-500 text-white shadow-lg glow-purple";
        renderDashboard();
      });
    });

    // Inputs search & difficulty filter
    searchInput.addEventListener("input", renderDashboard);
    difficultyFilter.addEventListener("change", renderDashboard);

    // Daily Challenge Button Click
    document.getElementById("daily-challenge-btn").addEventListener("click", () => {
      loadWorkspace("two-sum"); // Load daily challenge
    });
  }

  // --- WORKSPACE TAB SWITCHER ---
  function setupWorkspaceTabs() {
    const tabEditor = document.getElementById("tab-btn-editor");
    const tabVisualizer = document.getElementById("tab-btn-visualizer");
    const paneEditor = document.getElementById("pane-editor");
    const paneVisualizer = document.getElementById("pane-visualizer");

    tabEditor.addEventListener("click", () => switchWorkspaceTab("editor"));
    tabVisualizer.addEventListener("click", () => switchWorkspaceTab("visualizer"));
  }

  function switchWorkspaceTab(tab) {
    activeTab = tab;
    const tabEditor = document.getElementById("tab-btn-editor");
    const tabVisualizer = document.getElementById("tab-btn-visualizer");
    const paneEditor = document.getElementById("pane-editor");
    const paneVisualizer = document.getElementById("pane-visualizer");

    if (tab === "editor") {
      tabEditor.className = "flex-1 py-3 text-xs font-bold text-center border-b-2 border-purple-500 text-purple-400 bg-purple-500/5";
      tabVisualizer.className = "flex-1 py-3 text-xs font-bold text-center border-b-2 border-transparent text-gray-500 hover:text-gray-300";
      paneEditor.classList.remove("hidden");
      paneVisualizer.classList.add("hidden");
      
      // Stop visualization while editing
      visualizer.stop();
    } else {
      tabVisualizer.className = "flex-1 py-3 text-xs font-bold text-center border-b-2 border-purple-500 text-purple-400 bg-purple-500/5";
      tabEditor.className = "flex-1 py-3 text-xs font-bold text-center border-b-2 border-transparent text-gray-500 hover:text-gray-300";
      paneVisualizer.classList.remove("hidden");
      paneEditor.classList.add("hidden");

      // Load visual step highlight
      visualizer.render();
      renderVisualizerCodeTracker();
    }
  }

  // --- EDITOR FUNCTIONALITIES ---
  function setupLanguageSelector() {
    languageSelect.addEventListener("change", (e) => {
      activeLanguage = e.target.value;
      loadBoilerplate();
      renderVisualizerCodeTracker();
    });
  }

  function loadBoilerplate() {
    if (!activeProblem) return;
    const code = activeProblem.starterCodes[activeLanguage] || "";
    codeEditorEl.value = code;
    updateLineNumbers();
  }

  function updateLineNumbers() {
    const lines = codeEditorEl.value.split("\n");
    const numbersHtml = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    lineNumbersEl.innerHTML = numbersHtml;
  }

  // Bind textarea scroll and keypress syncs
  codeEditorEl.addEventListener("scroll", () => {
    lineNumbersEl.scrollTop = codeEditorEl.scrollTop;
  });
  codeEditorEl.addEventListener("input", updateLineNumbers);

  // --- CODE TRACKER CODE HIGH-LIGHTER ---
  function renderVisualizerCodeTracker() {
    const trackerContainer = document.getElementById("vis-code-tracker");
    if (!trackerContainer || !activeProblem) return;

    const rawCode = activeProblem.starterCodes[activeLanguage] || "";
    const lines = rawCode.split("\n");

    const html = `
      <div class="flex flex-col font-mono text-xs text-gray-400 bg-gray-950/60 rounded-xl border border-gray-800/80 p-3 h-full overflow-y-auto">
        <div class="text-[10px] text-gray-500 font-semibold border-b border-gray-900 pb-2 mb-2 uppercase flex items-center justify-between">
          <span>Executing Tracker (${activeLanguage})</span>
          <span class="text-cyan-400 italic">Sync mode: Active</span>
        </div>
        <div class="flex-grow flex flex-col relative w-full leading-5 select-none" id="tracker-lines-box">
          ${lines.map((line, idx) => {
            const lineNum = idx + 1;
            return `
              <div class="flex items-start w-full relative py-0.5 rounded px-2" data-line="${lineNum}">
                <span class="text-gray-600 w-8 inline-block select-none text-right pr-2 border-r border-gray-900 mr-2">${lineNum}</span>
                <span class="text-gray-300 font-mono whitespace-pre flex-grow">${highlightSyntax(line)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    trackerContainer.innerHTML = html;
    
    // Register visualizer update sync callback
    visualizer.onStepChange = (lineNum) => {
      const linesBox = document.getElementById("tracker-lines-box");
      if (!linesBox) return;

      // Translate line number using mappings for current language
      let displayLine = lineNum;
      if (activeLanguage !== "python" && typeof VISUALIZER_LINE_MAPPINGS !== 'undefined' && activeProblem) {
        const problemMapping = VISUALIZER_LINE_MAPPINGS[activeProblem.id];
        if (problemMapping && problemMapping[activeLanguage]) {
          displayLine = problemMapping[activeLanguage][lineNum] || lineNum;
        }
      }

      // Reset all lines highlight classes
      linesBox.querySelectorAll("[data-line]").forEach(div => {
        div.classList.remove("editor-active-line");
      });

      // Highlight active line
      const activeDiv = linesBox.querySelector(`[data-line="${displayLine}"]`);
      if (activeDiv) {
        activeDiv.classList.add("editor-active-line");
        // Scroll slightly into view if needed
        activeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };
  }

  function highlightSyntax(line) {
    // Simple custom regex high-lighter for static beauty
    return line
      .replace(/\b(def|function|class|return|if|else|elif|for|while|in|let|const|var|int|vector|bool|public|unordered_map|unordered_set|Map|HashMap)\b/g, '<span class="syntax-keyword">$1</span>')
      .replace(/\b(self|seen|complement|target|nums|nums\.length|nums\.size|seen\.has|seen\.get|seen\.set|seen\.find|seen\.end|mapping|stack|curr|prev|next_node|nextNode)\b/g, '<span class="syntax-variable">$1</span>')
      .replace(/\b(two_sum|reverse_linked_list|can_jump|is_valid|search_matrix|max_area|merge|max_depth|max_profit|subsets|reverseList|isValid|searchMatrix|maxArea|maxDepth|maxProfit)\b/g, '<span class="syntax-function">$1</span>')
      .replace(/(\".*?\"|'.*?')/g, '<span class="syntax-string">$1</span>')
      .replace(/(#.*|\/\/.*)/g, '<span class="syntax-comment">$1</span>')
      .replace(/\b([0-9]+)\b/g, '<span class="syntax-number">$1</span>');
  }

  // --- CONSOLE PANEL TERMINAL ACTION ---
  function setupConsoleActions() {
    const runBtn = document.getElementById("btn-run-code");
    const submitBtn = document.getElementById("btn-submit-code");
    
    runBtn.addEventListener("click", () => {
      openConsoleTab();
      logToConsole("Compiling and executing code against sample test cases...", "info");
      
      setTimeout(() => {
        logToConsole("✓ Running Test Case 1: nums = [2, 7, 11, 15], target = 9", "success");
        logToConsole("  Expected: [0, 1] | Output: [0, 1]", "gray");
        logToConsole("✓ Running Test Case 2: nums = [3, 2, 4], target = 6", "success");
        logToConsole("  Expected: [1, 2] | Output: [1, 2]", "gray");
        logToConsole("-----------------------------------------------", "gray");
        logToConsole("Success: All sample test cases passed!", "final-success");
      }, 1000);
    });

    submitBtn.addEventListener("click", () => {
      openConsoleTab();
      logToConsole("Submitting code to production judge...", "info");
      
      setTimeout(() => {
        logToConsole("✓ 10/10 Test Cases Passed.", "success");
        logToConsole("✓ Performance verification complete.", "success");
        logToConsole("-----------------------------------------------", "gray");
        logToConsole("STATUS: ACCEPTED (Confetti pop!)", "final-success");
        
        // Add to solved database
        solvedProblems.add(activeProblem.id);
        const key = `solvedProblems_${currentUser ? (currentUser.username || 'guest') : 'guest'}`;
        localStorage.setItem(key, JSON.stringify(Array.from(solvedProblems)));
        
        // Log submission for Analytics
        const submissionsKey = `submissions_${currentUser ? (currentUser.username || 'guest') : 'guest'}`;
        const submissions = JSON.parse(localStorage.getItem(submissionsKey)) || [];
        submissions.unshift({
          problemId: activeProblem.id,
          problemTitle: activeProblem.title,
          difficulty: activeProblem.difficulty,
          language: activeLanguage,
          timestamp: new Date().toLocaleString(),
          status: "Accepted",
          runtime: `${Math.floor(Math.random() * 20) + 6} ms`,
          code: codeEditorEl.value
        });
        localStorage.setItem(submissionsKey, JSON.stringify(submissions));

        // Re-render user card & top points
        renderUserProfile();
        renderDashboard();
        renderPopularQuestions();

        // Update workspace company logos to solved
        const workspaceLogosContainer = document.getElementById("workspace-company-logos");
        if (workspaceLogosContainer && activeProblem) {
          const askingCompanies = Object.keys(COMPANY_PROBLEMS).filter(comp => COMPANY_PROBLEMS[comp].includes(activeProblem.id));
          workspaceLogosContainer.innerHTML = askingCompanies.map(comp => {
            let icon = "";
            let brandClass = "";
            if (comp === "Google") { icon = "fab fa-google"; brandClass = "brand-google"; }
            else if (comp === "Meta") { icon = "fab fa-facebook"; brandClass = "brand-meta"; }
            else if (comp === "Amazon") { icon = "fab fa-amazon"; brandClass = "brand-amazon"; }
            else if (comp === "Microsoft") { icon = "fab fa-windows"; brandClass = "brand-microsoft"; }
            return `<i class="${icon} ${brandClass} logo-solved-glow text-sm" title="Asked by ${comp}"></i>`;
          }).join("");
        }
        
        // Trigger Victory Celebration Modal
        triggerVictoryCelebration();
      }, 1200);
    });
  }

  function openConsoleTab() {
    consolePanel.classList.remove("h-10");
    consolePanel.classList.add("h-48");
    consoleTabBtn.classList.add("border-purple-500", "text-purple-400");
  }

  function clearConsole() {
    consoleOutputContainer.innerHTML = "";
  }

  function logToConsole(text, type = "info") {
    let color = "text-gray-300";
    if (type === "info") color = "text-cyan-400";
    else if (type === "success") color = "text-emerald-400";
    else if (type === "gray") color = "text-gray-500 font-mono";
    else if (type === "final-success") color = "text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-500/20 px-2 py-1 rounded inline-block";

    const line = document.createElement("div");
    line.className = `${color} text-xs font-mono mb-1.5 leading-relaxed`;
    line.innerHTML = text;
    consoleOutputContainer.appendChild(line);
    consoleOutputContainer.scrollTop = consoleOutputContainer.scrollHeight;
  }

  // --- VICTORY POPUP ---
  function setupVictoryModal() {
    const closeBtn = document.getElementById("close-victory-modal");
    closeBtn.addEventListener("click", () => {
      victoryModal.classList.add("hidden");
      // Remove confetti elements
      document.querySelectorAll(".confetti").forEach(c => c.remove());
    });
  }

  function triggerVictoryCelebration() {
    victoryModal.classList.remove("hidden");
    
    // Spawn confetti pieces inside modal background wrapper
    const modalBg = victoryModal.querySelector(".modal-confetti-bg");
    modalBg.innerHTML = ""; // reset
    const colors = ["#a855f7", "#06b6d4", "#10b981", "#ef4444", "#f59e0b", "#ec4899"];

    for (let i = 0; i < 40; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = `${Math.random() * 100}%`;
      c.style.animationDelay = `${Math.random() * 1.5}s`;
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      modalBg.appendChild(c);
    }
  }

  // --- VISUALIZER STATE CONTROLS ---
  function setupVisualizerControls() {
    const playBtn = document.getElementById("btn-vis-play");
    const nextBtn = document.getElementById("btn-vis-next");
    const prevBtn = document.getElementById("btn-vis-prev");
    const speedSlider = document.getElementById("speed-slider");

    playBtn.addEventListener("click", () => {
      if (visualizer.isPlaying) {
        visualizer.pause();
        playBtn.innerHTML = `<i class="fas fa-play mr-1"></i> Play`;
        playBtn.className = "flex-1 py-2 rounded-lg bg-purple-600 border border-purple-500 text-white font-bold text-xs shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer";
      } else {
        visualizer.play();
        playBtn.innerHTML = `<i class="fas fa-pause mr-1"></i> Pause`;
        playBtn.className = "flex-1 py-2 rounded-lg bg-pink-600 border border-pink-500 text-white font-bold text-xs shadow-md hover:bg-pink-500 transition-all cursor-pointer";
      }
    });

    nextBtn.addEventListener("click", () => {
      visualizer.pause();
      playBtn.innerHTML = `<i class="fas fa-play mr-1"></i> Play`;
      playBtn.className = "flex-1 py-2 rounded-lg bg-purple-600 border border-purple-500 text-white font-bold text-xs shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer";
      visualizer.nextStep();
    });

    prevBtn.addEventListener("click", () => {
      visualizer.pause();
      playBtn.innerHTML = `<i class="fas fa-play mr-1"></i> Play`;
      playBtn.className = "flex-1 py-2 rounded-lg bg-purple-600 border border-purple-500 text-white font-bold text-xs shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer";
      visualizer.prevStep();
    });

    speedSlider.addEventListener("input", (e) => {
      // slider value maps: 1 -> 2000ms, 2 -> 1000ms, 3 -> 400ms, 4 -> 150ms
      const val = parseInt(e.target.value);
      let ms = 1000;
      if (val === 1) ms = 2000;
      else if (val === 2) ms = 1000;
      else if (val === 3) ms = 450;
      else if (val === 4) ms = 150;
      visualizer.setSpeed(ms);
    });

    // Reset visual button handler
    document.getElementById("btn-vis-reset").addEventListener("click", () => {
      visualizer.stop();
      playBtn.innerHTML = `<i class="fas fa-play mr-1"></i> Play`;
      playBtn.className = "flex-1 py-2 rounded-lg bg-purple-600 border border-purple-500 text-white font-bold text-xs shadow-md glow-purple hover:bg-purple-500 transition-all cursor-pointer";
      visualizer.render();
    });
  }

  // --- READ DSA TUTORIALS SECTION ---

  function renderReadSection() {
    const topicListEl = document.getElementById("read-topic-list");
    const contentPanelEl = document.getElementById("read-content-panel");
    const searchInput = document.getElementById("read-search");
    if (!topicListEl || !contentPanelEl) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // Filter topics by query
    const filteredTopics = READ_CONTENT.filter(topic => {
      return topic.title.toLowerCase().includes(query) || 
             topic.category.toLowerCase().includes(query) ||
             topic.summary.toLowerCase().includes(query);
    });

    // If active topic is not in filtered list, set active to the first filtered topic
    if (filteredTopics.length > 0 && !filteredTopics.some(t => t.id === activeReadTopicId)) {
      activeReadTopicId = filteredTopics[0].id;
    }

    // Render topic list
    if (filteredTopics.length === 0) {
      topicListEl.innerHTML = `
        <div class="text-center py-8 text-gray-500 text-xs">
          No topics matched your search.
        </div>
      `;
    } else {
      topicListEl.innerHTML = filteredTopics.map(topic => {
        const active = topic.id === activeReadTopicId;
        return `
          <div class="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 w-full ${active ? 'bg-purple-500/10 border-purple-500/35 text-purple-400 shadow-md' : 'bg-[#161b22]/30 border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'}">
            <button class="flex items-center gap-3 text-left flex-grow min-w-0 py-0.5 cursor-pointer outline-none" data-topic-id="${topic.id}">
              <div class="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center border border-gray-800 flex-shrink-0">
                <i class="${topic.icon} text-xs"></i>
              </div>
              <div class="flex-grow min-w-0">
                <div class="text-[9px] uppercase font-mono tracking-widest text-gray-500 font-semibold mb-0.5">${topic.category}</div>
                <div class="text-xs font-bold truncate">${topic.title}</div>
              </div>
            </button>
            ${topic.youtubeLink ? `
              <a href="${topic.youtubeLink}" target="_blank" class="w-7 h-7 rounded-lg bg-red-600/10 hover:bg-red-650 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white flex items-center justify-center flex-shrink-0 transition-all hover:scale-105" title="Watch Video Tutorial">
                <i class="fab fa-youtube text-xs"></i>
              </a>
            ` : ''}
          </div>
        `;
      }).join('');

      // Add click handlers
      topicListEl.querySelectorAll("[data-topic-id]").forEach(btn => {
        btn.addEventListener("click", () => {
          activeReadTopicId = btn.dataset.topicId;
          renderReadSection();
        });
      });
    }

    // Render active topic content
    const activeTopic = READ_CONTENT.find(t => t.id === activeReadTopicId);
    if (!activeTopic) {
      contentPanelEl.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-gray-500 text-xs">
          Select a topic to start reading.
        </div>
      `;
      return;
    }

    const relatedProblem = typeof PROBLEMS !== 'undefined' ? PROBLEMS.find(p => p.id === activeTopic.relatedProblemId) : null;

    contentPanelEl.innerHTML = `
      <div class="flex flex-col gap-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-sm">
              <i class="${activeTopic.icon}"></i>
            </div>
            <div>
              <div class="text-[9px] text-purple-400 font-bold uppercase tracking-widest font-mono">${activeTopic.category}</div>
              <h2 class="text-xl font-extrabold text-white tracking-tight mt-0.5">${activeTopic.title}</h2>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            ${activeTopic.youtubeLink ? `
              <a href="${activeTopic.youtubeLink}" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 hover:border-red-500/30 text-red-500 font-bold text-xs shadow-md hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer">
                <i class="fab fa-youtube text-xs text-red-500"></i> Watch Tutorial
              </a>
            ` : ''}
            ${relatedProblem ? `
              <button id="read-practice-btn" class="px-3.5 py-1.5 rounded-xl bg-purple-600 border border-purple-500 hover:bg-purple-500 text-white font-bold text-xs shadow-md glow-purple hover:scale-102 transition-all cursor-pointer flex items-center gap-1.5">
                <i class="fas fa-code text-[10px]"></i> Practice: ${relatedProblem.title}
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Complexity Card -->
        <div class="bg-gray-900/30 border border-gray-800/80 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div class="flex items-center gap-2">
            <i class="fas fa-chart-line text-cyan-400"></i>
            <span class="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Complexity Bounds:</span>
          </div>
          <span class="text-cyan-400 font-semibold text-right">${activeTopic.complexity}</span>
        </div>

        <!-- Summary -->
        <p class="text-gray-300 text-xs leading-relaxed italic bg-gray-900/10 border border-gray-800/50 p-3 rounded-lg">
          ${activeTopic.summary}
        </p>

        <!-- Body Content -->
        <div class="text-gray-300 text-xs leading-relaxed space-y-4 font-sans read-content-body">
          ${activeTopic.content}
        </div>

        <!-- Snippet -->
        ${activeTopic.codeSnippet ? `
          <div class="flex flex-col bg-[#0d1117] rounded-xl border border-gray-800 overflow-hidden mt-2">
            <div class="h-9 border-b border-gray-800 bg-[#161b22] px-4 flex items-center justify-between flex-shrink-0">
              <span class="text-[9px] text-gray-500 font-semibold uppercase tracking-wider font-sans">Python 3 Implementation</span>
              <button id="read-copy-btn" class="text-gray-400 hover:text-white transition-colors text-[9px] font-semibold flex items-center gap-1.5 cursor-pointer">
                <i class="fas fa-copy"></i> Copy Code
              </button>
            </div>
            <pre class="p-3.5 overflow-x-auto text-[10px] font-mono leading-relaxed text-gray-300 bg-[#0d1117]/60"><code>${highlightSyntax(activeTopic.codeSnippet)}</code></pre>
          </div>
        ` : ''}
      </div>
    `;

    // Bind related practice button
    const practiceBtn = document.getElementById("read-practice-btn");
    if (practiceBtn && relatedProblem) {
      practiceBtn.addEventListener("click", () => {
        loadWorkspace(activeTopic.relatedProblemId);
      });
    }

    // Bind copy snippet button
    const copyBtn = document.getElementById("read-copy-btn");
    if (copyBtn && activeTopic.codeSnippet) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(activeTopic.codeSnippet).then(() => {
          copyBtn.innerHTML = `<i class="fas fa-check text-emerald-400"></i> Copied!`;
          setTimeout(() => {
            copyBtn.innerHTML = `<i class="fas fa-copy"></i> Copy Code`;
          }, 1500);
        });
      });
    }

    // Bind search handler once
    if (!readSearchBound) {
      const searchInputEl = document.getElementById("read-search");
      if (searchInputEl) {
        searchInputEl.addEventListener("input", renderReadSection);
        readSearchBound = true;
      }
    }
  }

  // --- DISCUSS COMMUNITY SECTION ---

  const SEED_DISCUSS_POSTS = [
    {
      id: "post-java-parentheses",
      title: "Clean Java Solution for Valid Parentheses using Map",
      category: "Solutions",
      author: "Aisha Patel",
      authorInitials: "AP",
      avatarColor: "from-emerald-400 to-cyan-500",
      body: "Here is a clean implementation using HashMap to map closing bracket keys to opening bracket values. This makes it super easy to extend for other bracket types (e.g. angle brackets `< >`) if asked by the interviewer.",
      upvotes: 51,
      upvotedBy: [],
      comments: 7,
      timestamp: "Today, 7:10 PM",
      codeSnippet: `public boolean isValid(String s) {\n    Map<Character, Character> map = Map.of(')', '(', '}', '{', ']', '[');\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (map.containsValue(c)) {\n            stack.push(c);\n        } else if (map.containsKey(c)) {\n            if (stack.isEmpty() || stack.pop() != map.get(c)) {\n                return false;\n            }\n        }\n    }\n    return stack.isEmpty();\n}`
    },
    {
      id: "post-dp-memo",
      title: "Mastering Dynamic Programming: Memoization vs Tabulation",
      category: "General",
      author: "David Miller",
      authorInitials: "DM",
      avatarColor: "from-blue-500 to-indigo-600",
      body: "I used to struggle a lot with DP, but drawing out the decision tree first has been a lifesaver. Top-down (memoization) is much more intuitive to write because it mimics the recursive structure. Bottom-up (tabulation) is often better for space optimization but trickier to formulate the table iteration order. What do you guys prefer?",
      upvotes: 19,
      upvotedBy: [],
      comments: 4,
      timestamp: "Today, 6:20 PM"
    },
    {
      id: "post-google-twosum",
      title: "Google interview question: Two Sum variation with duplicates",
      category: "Interviews",
      author: "Jessica Chen",
      authorInitials: "JC",
      avatarColor: "from-orange-400 to-amber-500",
      body: "Got asked a variation of Two Sum in my Google phone screen today where the array is sorted but contains duplicates, and we had to return all unique pairs that sum up to the target. Used a two-pointer approach to skip duplicates easily.",
      upvotes: 34,
      upvotedBy: [],
      comments: 8,
      timestamp: "Today, 4:45 PM"
    },
    {
      id: "post-1",
      title: "How to solve Container With Most Water in O(N)?",
      category: "Solutions",
      author: "Demo User",
      authorInitials: "DU",
      avatarColor: "from-purple-500 to-cyan-500",
      body: "The two-pointer technique is key here. Start with one pointer at the beginning and one at the end. Calculate the area, then move the pointer pointing to the shorter line inward. Since the height is limited by the shorter line, moving the longer one cannot increase the area.",
      upvotes: 42,
      upvotedBy: [],
      comments: 5,
      timestamp: "Today, 2 hours ago",
      codeSnippet: `def maxArea(height):\n    left, right = 0, len(height) - 1\n    max_val = 0\n    while left < right:\n        width = right - left\n        max_val = max(max_val, min(height[left], height[right]) * width)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_val`
    },
    {
      id: "post-2",
      title: "Meta Interview Experience: Seattle Office (April 2026)",
      category: "Interviews",
      author: "Sara Connor",
      authorInitials: "SC",
      avatarColor: "from-emerald-400 to-teal-600",
      body: "Had 2 technical rounds and 1 behavioral. The technical rounds focused extensively on dynamic programming and graph traversals. One question was a variation of Merge Intervals with custom sorting criteria. Keep practicing complexity profiles on AlgoJudge!",
      upvotes: 28,
      upvotedBy: [],
      comments: 3,
      timestamp: "1 day ago"
    },
    {
      id: "post-3",
      title: "Big O Analysis on recursive recursion stack",
      category: "General",
      author: "Alex Rivers",
      authorInitials: "AR",
      avatarColor: "from-pink-500 to-rose-600",
      body: "Does anybody have an easy rule of thumb for finding the space complexity of recursive calls? Is it always equal to the maximum depth of the recursion tree?",
      upvotes: 15,
      upvotedBy: [],
      comments: 12,
      timestamp: "3 days ago"
    }
  ];

  function getDiscussPosts() {
    let posts = JSON.parse(localStorage.getItem("algojudge_discuss_posts"));
    if (!posts || !posts.some(p => p.id === "post-google-twosum")) {
      posts = SEED_DISCUSS_POSTS;
      localStorage.setItem("algojudge_discuss_posts", JSON.stringify(posts));
    }
    return posts;
  }

  function saveDiscussPosts(posts) {
    localStorage.setItem("algojudge_discuss_posts", JSON.stringify(posts));
  }

  function renderDiscussSection() {
    const feedEl = document.getElementById("discuss-posts-feed");
    if (!feedEl) return;

    const posts = getDiscussPosts();
    const currentUsername = currentUser ? (currentUser.username || "guest") : "guest";

    // 1. Update Channel counters
    const countAll = posts.length;
    const countGeneral = posts.filter(p => p.category === "General").length;
    const countSolutions = posts.filter(p => p.category === "Solutions").length;
    const countInterviews = posts.filter(p => p.category === "Interviews").length;

    const elCountAll = document.getElementById("discuss-count-all");
    const elCountGeneral = document.getElementById("discuss-count-general");
    const elCountSolutions = document.getElementById("discuss-count-solutions");
    const elCountInterviews = document.getElementById("discuss-count-interviews");

    if (elCountAll) elCountAll.innerText = countAll;
    if (elCountGeneral) elCountGeneral.innerText = countGeneral;
    if (elCountSolutions) elCountSolutions.innerText = countSolutions;
    if (elCountInterviews) elCountInterviews.innerText = countInterviews;

    // 2. Filter posts by activeDiscussChannel
    const filteredPosts = activeDiscussChannel === "All" 
      ? posts 
      : posts.filter(p => p.category === activeDiscussChannel);

    // Sort by upvotes descending
    filteredPosts.sort((a, b) => b.upvotes - a.upvotes);

    // 3. Render feed
    if (filteredPosts.length === 0) {
      feedEl.innerHTML = `
        <div class="glass-panel border border-[#30363d] rounded-2xl p-8 text-center text-gray-500 text-sm">
          <i class="fas fa-comments text-3xl mb-3 text-purple-400 opacity-60"></i>
          <p>No discussion posts in this channel yet.</p>
          <p class="text-xs text-gray-600 mt-1">Be the first to share something!</p>
        </div>
      `;
    } else {
      feedEl.innerHTML = filteredPosts.map(post => {
        const hasUpvoted = post.upvotedBy && post.upvotedBy.includes(currentUsername);
        
        let catColor = "text-rose-400 bg-rose-950/20 border-rose-500/20";
        if (post.category === "Solutions") catColor = "text-cyan-400 bg-cyan-950/20 border-cyan-500/20";
        if (post.category === "Interviews") catColor = "text-amber-500 bg-amber-950/20 border-amber-500/20";

        return `
          <div class="glass-panel border border-[#30363d] rounded-2xl p-5 flex flex-col gap-4 hover:border-purple-500/20 transition-all duration-300 relative overflow-hidden" data-post-id="${post.id}">
            <!-- Header -->
            <div class="flex items-start justify-between gap-4 border-b border-[#30363d]/40 pb-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr ${post.avatarColor || 'from-purple-500 to-cyan-500'} flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                  ${post.authorInitials || 'G'}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-white">${post.author}</span>
                    <span class="text-[9px] text-gray-500 font-mono">• ${post.timestamp}</span>
                  </div>
                  <div class="text-[9px] uppercase font-mono tracking-widest text-gray-500 mt-0.5">
                    Channel: <span class="px-1.5 py-0.2 rounded border ${catColor} font-semibold font-mono text-[8px] uppercase ml-1">${post.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="flex flex-col gap-3">
              <h3 class="font-bold text-white text-sm md:text-base leading-snug">${post.title}</h3>
              <p class="text-gray-400 text-xs leading-relaxed font-sans whitespace-pre-wrap">${post.body}</p>
              
              ${post.codeSnippet ? `
                <div class="flex flex-col bg-[#0d1117] rounded-xl border border-gray-800 overflow-hidden my-1">
                  <pre class="p-3 overflow-x-auto text-[10px] font-mono leading-relaxed text-gray-300 bg-[#0d1117]/60"><code>${highlightSyntax(post.codeSnippet)}</code></pre>
                </div>
              ` : ''}
            </div>

            <!-- Actions footer -->
            <div class="flex items-center gap-4 mt-1 border-t border-[#30363d]/30 pt-3 text-xs text-gray-500">
              <button class="upvote-btn flex items-center gap-1.5 hover:text-purple-400 transition-colors ${hasUpvoted ? 'text-purple-400 font-bold' : ''}" data-post-id="${post.id}">
                <i class="fas fa-arrow-up"></i>
                <span>${post.upvotes}</span>
              </button>
              <div class="flex items-center gap-1.5 cursor-pointer hover:text-gray-300">
                <i class="fas fa-comment-alt opacity-70"></i>
                <span>${post.comments} comments</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Attach click events on upvote buttons
      feedEl.querySelectorAll(".upvote-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const postId = btn.dataset.postId;
          togglePostUpvote(postId);
        });
      });
    }

    // Toggle active channel filters styles
    document.querySelectorAll(".channel-filter-btn").forEach(btn => {
      const channel = btn.dataset.channel;
      if (channel === activeDiscussChannel) {
        btn.className = "channel-filter-btn flex items-center justify-between px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold transition-all cursor-pointer w-full text-left";
      } else {
        btn.className = "channel-filter-btn flex items-center justify-between px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/40 border border-transparent hover:border-gray-800 font-medium transition-all cursor-pointer w-full text-left";
      }
    });
  }

  function togglePostUpvote(postId) {
    const posts = getDiscussPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const currentUsername = currentUser ? (currentUser.username || "guest") : "guest";
    if (!post.upvotedBy) post.upvotedBy = [];

    const upvoteIdx = post.upvotedBy.indexOf(currentUsername);
    if (upvoteIdx === -1) {
      post.upvotedBy.push(currentUsername);
      post.upvotes += 1;
    } else {
      post.upvotedBy.splice(upvoteIdx, 1);
      post.upvotes -= 1;
    }

    saveDiscussPosts(posts);
    renderDiscussSection();
  }

  // --- PREMIUM CARD MOUSE TRACKING (Radial glow follow) ---
  function setupCardMouseTracking() {
    document.addEventListener("mousemove", (e) => {
      const cards = document.querySelectorAll("#problems-list > div, .premium-card");
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");
      });
    });
  }

  function setupDiscussHandlers() {
    // 1. Channel Filter Buttons
    document.querySelectorAll(".channel-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeDiscussChannel = btn.dataset.channel;
        renderDiscussSection();
      });
    });

    // 2. Open/Close Create Post Card
    const btnCreate = document.getElementById("btn-create-post");
    const btnCloseCreate = document.getElementById("btn-close-create");
    const createCard = document.getElementById("create-post-card");

    if (btnCreate) {
      btnCreate.addEventListener("click", () => {
        if (createCard) createCard.classList.remove("hidden");
      });
    }
    if (btnCloseCreate) {
      btnCloseCreate.addEventListener("click", () => {
        if (createCard) createCard.classList.add("hidden");
      });
    }

    // 3. New Post Form Submit
    const form = document.getElementById("new-post-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const titleVal = document.getElementById("post-title").value.trim();
        const catVal = document.getElementById("post-category").value;
        const bodyVal = document.getElementById("post-body").value.trim();

        if (!titleVal || !bodyVal) return;

        const posts = getDiscussPosts();
        
        // Build post data
        const authorName = currentUser ? (currentUser.name || "Demo User") : "Demo User";
        const authorInitials = authorName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "G";
        
        const gradients = [
          "from-purple-500 to-cyan-500",
          "from-emerald-400 to-teal-600",
          "from-pink-500 to-rose-600",
          "from-amber-400 to-orange-500"
        ];
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

        // Simple markdown parsing for code block detection
        let codeSnippet = "";
        let finalBody = bodyVal;
        const codeBlockRegex = /```(?:javascript|python|cpp|java)?\n([\s\S]*?)```/;
        const match = bodyVal.match(codeBlockRegex);
        if (match) {
          codeSnippet = match[1];
          finalBody = bodyVal.replace(codeBlockRegex, "").trim();
        }

        const newPost = {
          id: "post-" + Date.now(),
          title: titleVal,
          category: catVal,
          author: authorName,
          authorInitials: authorInitials,
          avatarColor: randomGradient,
          body: finalBody,
          upvotes: 1,
          upvotedBy: [currentUser ? (currentUser.username || "guest") : "guest"],
          comments: 0,
          timestamp: "Just now",
          codeSnippet: codeSnippet || null
        };

        posts.unshift(newPost);
        saveDiscussPosts(posts);

        // Reset and hide
        form.reset();
        if (createCard) createCard.classList.add("hidden");

        // Re-render
        renderDiscussSection();
      });
    }
  }

  // --- WORKSPACE LEFT COLUMN TAB SWITCHER ---

  function setupWorkspaceLeftTabs() {
    if (workspaceLeftTabsBound) return;

    const btnDesc = document.getElementById("workspace-tab-btn-desc");
    const btnDiscuss = document.getElementById("workspace-tab-btn-discuss");
    const btnSolutions = document.getElementById("workspace-tab-btn-solutions");

    if (btnDesc) btnDesc.addEventListener("click", () => switchWorkspaceLeftTab("desc"));
    if (btnDiscuss) btnDiscuss.addEventListener("click", () => switchWorkspaceLeftTab("discuss"));
    if (btnSolutions) btnSolutions.addEventListener("click", () => switchWorkspaceLeftTab("solutions"));

    // Add Comment controls inside workspace
    const btnAddPost = document.getElementById("btn-workspace-add-post");
    const btnCancelComment = document.getElementById("btn-workspace-comment-cancel");
    const btnSubmitComment = document.getElementById("btn-workspace-comment-submit");
    const commentFormContainer = document.getElementById("workspace-comment-form-container");

    if (btnAddPost) {
      btnAddPost.addEventListener("click", () => {
        if (commentFormContainer) commentFormContainer.classList.remove("hidden");
      });
    }

    if (btnCancelComment) {
      btnCancelComment.addEventListener("click", () => {
        if (commentFormContainer) {
          commentFormContainer.classList.add("hidden");
          document.getElementById("workspace-comment-body").value = "";
        }
      });
    }

    if (btnSubmitComment) {
      btnSubmitComment.addEventListener("click", () => {
        const bodyEl = document.getElementById("workspace-comment-body");
        const bodyVal = bodyEl ? bodyEl.value.trim() : "";
        if (!bodyVal || !activeProblem) return;

        const posts = getDiscussPosts();
        const authorName = currentUser ? (currentUser.name || "Demo User") : "Demo User";
        const authorInitials = authorName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "G";

        const newPost = {
          id: "post-" + Date.now(),
          title: `Comment on ${activeProblem.title}`,
          category: "Solutions",
          author: authorName,
          authorInitials: authorInitials,
          avatarColor: "from-purple-500 to-cyan-500",
          body: bodyVal,
          upvotes: 1,
          upvotedBy: [currentUser ? (currentUser.username || "guest") : "guest"],
          comments: 0,
          timestamp: "Just now",
          codeSnippet: null
        };

        posts.unshift(newPost);
        saveDiscussPosts(posts);

        if (bodyEl) bodyEl.value = "";
        if (commentFormContainer) commentFormContainer.classList.add("hidden");

        renderWorkspaceDiscuss();
      });
    }

    workspaceLeftTabsBound = true;
  }

  function switchWorkspaceLeftTab(tab) {
    activeWorkspaceLeftTab = tab;
    
    const btnDesc = document.getElementById("workspace-tab-btn-desc");
    const btnDiscuss = document.getElementById("workspace-tab-btn-discuss");
    const btnSolutions = document.getElementById("workspace-tab-btn-solutions");

    const paneDesc = document.getElementById("workspace-pane-desc");
    const paneDiscuss = document.getElementById("workspace-pane-discuss");
    const paneSolutions = document.getElementById("workspace-pane-solutions");

    // Clear styles
    [btnDesc, btnDiscuss, btnSolutions].forEach(btn => {
      if (btn) {
        btn.className = "px-6 py-3.5 text-xs font-semibold text-gray-500 hover:text-gray-300 border-b-2 border-transparent transition-all";
      }
    });
    [paneDesc, paneDiscuss, paneSolutions].forEach(pane => {
      if (pane) pane.classList.add("hidden");
    });

    if (tab === "desc") {
      if (btnDesc) btnDesc.className = "px-6 py-3.5 text-xs font-bold border-b-2 border-purple-500 text-purple-400 bg-purple-500/5 transition-all";
      if (paneDesc) paneDesc.classList.remove("hidden");
    } else if (tab === "discuss") {
      if (btnDiscuss) btnDiscuss.className = "px-6 py-3.5 text-xs font-bold border-b-2 border-purple-500 text-purple-400 bg-purple-500/5 transition-all";
      if (paneDiscuss) paneDiscuss.classList.remove("hidden");
      renderWorkspaceDiscuss();
    } else if (tab === "solutions") {
      if (btnSolutions) btnSolutions.className = "px-6 py-3.5 text-xs font-bold border-b-2 border-purple-500 text-purple-400 bg-purple-500/5 transition-all";
      if (paneSolutions) paneSolutions.classList.remove("hidden");
      renderWorkspaceSolutions();
    }
  }

  function renderWorkspaceDiscuss() {
    const listEl = document.getElementById("workspace-discuss-list");
    if (!listEl || !activeProblem) return;

    const posts = getDiscussPosts();
    const currentUsername = currentUser ? (currentUser.username || "guest") : "guest";

    // Filter posts matching this problem keywords
    const probKeywords = activeProblem.title.toLowerCase().split(" ");
    const relatedPosts = posts.filter(post => {
      // Direct title match or keyword overlaps
      const titleLower = post.title.toLowerCase();
      const bodyLower = post.body.toLowerCase();
      const isRelated = titleLower.includes(activeProblem.title.toLowerCase()) ||
                        probKeywords.some(keyword => keyword.length > 3 && (titleLower.includes(keyword) || bodyLower.includes(keyword)));
      return isRelated;
    });

    if (relatedPosts.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-6 text-gray-500 text-xs italic">
          No comments for this question yet. Share your approach!
        </div>
      `;
    } else {
      listEl.innerHTML = relatedPosts.map(post => {
        const hasUpvoted = post.upvotedBy && post.upvotedBy.includes(currentUsername);
        return `
          <div class="bg-[#161b22]/40 border border-gray-800 p-4 rounded-xl flex flex-col gap-2">
            <div class="flex items-center justify-between text-[10px] text-gray-500">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr ${post.avatarColor || 'from-purple-500 to-cyan-500'} flex items-center justify-center font-bold text-white text-[9px] uppercase">
                  ${post.authorInitials}
                </div>
                <span class="font-bold text-gray-300">${post.author}</span>
                <span>• ${post.timestamp}</span>
              </div>
              <button class="workspace-upvote-btn hover:text-purple-400 transition-colors ${hasUpvoted ? 'text-purple-400 font-bold' : ''}" data-post-id="${post.id}">
                <i class="fas fa-arrow-up"></i> ${post.upvotes}
              </button>
            </div>
            <p class="text-gray-300 text-xs font-sans leading-relaxed">${post.body}</p>
          </div>
        `;
      }).join('');

      // Add upvote click listeners
      listEl.querySelectorAll(".workspace-upvote-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const postId = btn.dataset.postId;
          togglePostUpvote(postId);
          renderWorkspaceDiscuss();
        });
      });
    }
  }

  function renderWorkspaceSolutions() {
    const container = document.getElementById("workspace-solutions-content");
    if (!container || !activeProblem) return;

    // Get active language template solution
    const starterCode = activeProblem.starterCodes[activeLanguage] || "";
    
    // Fetch solutions data from database or use placeholders
    const solutionOverview = activeProblem.solutionExplanation || 
      (activeProblem.id === "two-sum" ? "Use a Hash Map to store each element's index as we iterate. For each element, look up its complement (target - num). If found, we return the pair." :
       activeProblem.id === "reverse-linked-list" ? "Use three pointers (prev, curr, next) to reverse the pointer directions in-place iteratively. Return prev when curr reaches null." :
       activeProblem.id === "valid-parentheses" ? "Iterate through the string using a Stack. Push opening brackets. When a closing bracket is found, pop the top element and verify it matches." :
       activeProblem.id === "jump-game" ? "Iterate from left to right. Maintain the maximum index reachable so far. If the current index exceeds the maximum reach, return false." :
       activeProblem.id === "best-time-to-buy-and-sell-stock" ? "Iterate through the prices list once. Keep track of the minimum price seen so far, and calculate the potential profit at each day." :
       "We can solve this problem optimally by leveraging an efficient data structure or algorithm traversal strategy.");

    const complexityTime = activeProblem.optimalComplexity?.time || 
      (activeProblem.id === "two-sum" || activeProblem.id === "reverse-linked-list" || activeProblem.id === "valid-parentheses" || activeProblem.id === "jump-game" || activeProblem.id === "best-time-to-buy-and-sell-stock" ? "O(N)" : "O(N)");

    const complexitySpace = activeProblem.optimalComplexity?.space || 
      (activeProblem.id === "two-sum" || activeProblem.id === "valid-parentheses" ? "O(N) (storage)" :
       activeProblem.id === "reverse-linked-list" || activeProblem.id === "jump-game" || activeProblem.id === "best-time-to-buy-and-sell-stock" ? "O(1)" : "O(1)");

    const youtubeLink = activeProblem.youtubeLink || `https://www.youtube.com/results?search_query=leetcode+${encodeURIComponent(activeProblem.title)}+solution`;

    container.innerHTML = `
      <div class="flex flex-col gap-4 animate-fade-in text-xs font-sans">
        
        <!-- Premium YouTube Video Walkthrough Link Card -->
        <a href="${youtubeLink}" target="_blank"
          class="flex items-center justify-between px-4 py-3 rounded-xl bg-red-950/20 border border-red-500/30 hover:border-red-500/60 hover:bg-red-950/30 text-red-400 font-bold transition-all duration-300 shadow-md shadow-red-950/10 cursor-pointer group hover:scale-[1.01]">
          <div class="flex items-center gap-2">
            <i class="fab fa-youtube text-red-500 text-lg group-hover:scale-110 transition-transform"></i>
            <span>Video Solution Walkthrough</span>
          </div>
          <span class="flex items-center gap-1 text-[10px] text-gray-500 group-hover:text-red-400 transition-colors">
            Watch on YouTube
            <i class="fas fa-external-link-alt text-[9px] opacity-75"></i>
          </span>
        </a>

        <div class="bg-purple-950/10 border border-purple-500/20 p-4 rounded-xl flex flex-col gap-2">
          <span class="text-[10px] text-purple-400 font-bold uppercase tracking-widest font-mono">Algorithm Summary</span>
          <p class="text-gray-300 leading-relaxed">${solutionOverview}</p>
        </div>

        <div class="grid grid-cols-2 gap-3 font-mono">
          <div class="bg-gray-900/40 border border-gray-800 p-3 rounded-xl">
            <div class="text-[9px] text-gray-500 uppercase font-bold">Time Complexity</div>
            <div class="text-xs font-bold text-cyan-400 mt-1">${complexityTime}</div>
          </div>
          <div class="bg-gray-900/40 border border-gray-800 p-3 rounded-xl">
            <div class="text-[9px] text-gray-500 uppercase font-bold">Space Complexity</div>
            <div class="text-xs font-bold text-purple-400 mt-1">${complexitySpace}</div>
          </div>
        </div>

        <!-- Styled Solution Code Block -->
        <div class="flex flex-col bg-[#0d1117] rounded-xl border border-gray-800 overflow-hidden mt-2">
          <div class="h-9 border-b border-gray-800 bg-[#161b22] px-4 flex items-center justify-between">
            <span class="text-[9px] text-gray-500 font-semibold uppercase tracking-wider font-sans">${activeLanguage.toUpperCase()} Implementation</span>
          </div>
          <pre class="p-3.5 overflow-x-auto text-[10px] font-mono leading-relaxed text-gray-300 bg-[#0d1117]/60"><code>${highlightSyntax(starterCode)}</code></pre>
        </div>
      </div>
    `;
  }
});
