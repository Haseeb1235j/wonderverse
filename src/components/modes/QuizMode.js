// QuizMode Component
import { scoreQuiz } from "../../generators/quizGenerator.js";
import { StorageService } from "../../services/storage.js";
import { Toast } from "../ui/Toast.js";
import { ProgressBar } from "../ui/ProgressBar.js";

// Retro Synthesizer Sound Effects (100% Free & Local)
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

const SoundFX = {
  playCorrect() {
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.type = "sine";
      osc2.type = "triangle";
      
      const now = audioCtx.currentTime;
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.24); // G5
      osc2.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.setValueAtTime(329.63, now + 0.12); // E4
      
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (err) {
      console.warn("Web Audio not supported or blocked", err);
    }
  },

  playIncorrect() {
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = "sawtooth";
      const now = audioCtx.currentTime;
      
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.3);
      
      gainNode.gain.setValueAtTime(0.18, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (err) {
      console.warn("Web Audio not supported or blocked", err);
    }
  }
};

export const QuizMode = {
  currentQuestionIndex: 0,
  userAnswers: [],
  questions: [],
  topicTitle: "",

  render(questions, topicTitle) {
    this.questions = questions;
    this.topicTitle = topicTitle;
    this.currentQuestionIndex = 0;
    this.userAnswers = [];

    return `
      <div id="quiz-workspace-inner" style="max-width: 650px; margin: 0 auto; padding-top: var(--space-2);">
        ${this.renderQuestionCard()}
      </div>
    `;
  },

  renderQuestionCard() {
    const qIndex = this.currentQuestionIndex;
    const question = this.questions[qIndex];
    const percentage = Math.round((qIndex / this.questions.length) * 100);

    const optionsHtml = question.options.map((option, idx) => `
      <button 
        data-index="${idx}" 
        class="btn btn-secondary quiz-option-btn" 
        style="width: 100%; justify-content: flex-start; text-align: left; padding: var(--space-4); border-radius: var(--radius-lg); font-size: 0.95rem; font-weight: 500;"
      >
        <span style="font-weight: bold; margin-right: var(--space-3); color: var(--text-muted);">${String.fromCharCode(65 + idx)}.</span>
        ${option}
      </button>
    `).join("");

    return `
      <div class="card reveal animate-fade-up" style="display: flex; flex-direction: column; gap: var(--space-5);">
        <!-- Progress Bar -->
        <div style="display: flex; flex-direction: column; gap: var(--space-2);">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">
            <span>QUESTION ${qIndex + 1} OF ${this.questions.length}</span>
            <span>${percentage}% COMPLETED</span>
          </div>
          ${ProgressBar.render(percentage, "var(--accent-cyan)")}
        </div>

        <h3 class="text-h2" style="font-size: 1.25rem; margin: 0; line-height: 1.4;">
          ${question.question}
        </h3>

        <!-- Options Container -->
        <div id="quiz-options-mount" style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${optionsHtml}
        </div>

        <!-- Explanation Card (Initially hidden) -->
        <div id="quiz-explanation-mount" class="card" style="display: none; background: var(--bg-secondary); border-left: 4px solid var(--accent-cyan); padding: var(--space-4); margin-top: var(--space-2);">
          <h4 style="margin: 0 0 var(--space-2) 0; font-size: 0.95rem; color: var(--accent-cyan); font-weight: 700;">
            Explanation Telemetry
          </h4>
          <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            ${question.explanation}
          </p>
        </div>

        <!-- Action Button -->
        <div style="display: flex; justify-content: flex-end; margin-top: var(--space-2);">
          <button id="quiz-action-btn" class="btn btn-primary" style="display: none;">
            Next Question →
          </button>
        </div>
      </div>
    `;
  },

  bindEvents() {
    this.bindQuestionEvents();
  },

  bindQuestionEvents() {
    const options = document.querySelectorAll(".quiz-option-btn");
    const explanation = document.getElementById("quiz-explanation-mount");
    const actionBtn = document.getElementById("quiz-action-btn");
    const correctIdx = this.questions[this.currentQuestionIndex].correctIndex;
    let answered = false;

    options.forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        const selectedIdx = parseInt(btn.getAttribute("data-index"));
        this.userAnswers.push(selectedIdx);

        // Highlight choices
        options.forEach((opt, idx) => {
          if (idx === correctIdx) {
            opt.style.borderColor = "var(--accent-emerald)";
            opt.style.background = "rgba(16, 185, 129, 0.08)";
            opt.style.color = "#34d399";
          } else if (idx === selectedIdx) {
            opt.style.borderColor = "var(--accent-rose)";
            opt.style.background = "rgba(244, 63, 94, 0.08)";
            opt.style.color = "#fb7185";
          }
          opt.style.cursor = "default";
        });

        // Play sound chime
        if (selectedIdx === correctIdx) {
          SoundFX.playCorrect();
        } else {
          SoundFX.playIncorrect();
        }

        // Show explanation and next btn
        if (explanation) explanation.style.display = "block";
        if (actionBtn) {
          const isLast = this.currentQuestionIndex === this.questions.length - 1;
          actionBtn.innerText = isLast ? "Finish Quiz" : "Next Question →";
          actionBtn.style.display = "inline-flex";
        }
      });
    });

    actionBtn?.addEventListener("click", () => {
      this.currentQuestionIndex++;
      const workspace = document.getElementById("quiz-workspace-inner");
      
      if (this.currentQuestionIndex < this.questions.length) {
        if (workspace) {
          workspace.innerHTML = this.renderQuestionCard();
          this.bindQuestionEvents();
        }
      } else {
        this.renderSummary(workspace);
      }
    });
  },

  renderSummary(container) {
    const quizStats = scoreQuiz(this.questions, this.userAnswers);
    
    // Save to local storage
    StorageService.saveQuizScore(this.topicTitle, quizStats.score);
    StorageService.markChapterComplete(this.topicTitle);

    let progressColor = "var(--accent-rose)";
    if (quizStats.percentage >= 80) progressColor = "var(--accent-emerald)";
    else if (quizStats.percentage >= 50) progressColor = "var(--accent-amber)";

    const reviewHtml = quizStats.results.map((res, idx) => `
      <div class="card" style="background: var(--bg-secondary); border-left: 4px solid ${res.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; padding: var(--space-4); margin-bottom: var(--space-4);">
        <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-2); align-items: center;">
          <span style="font-family: var(--font-mono); font-size: 0.8rem; background: ${res.isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)'}; color: ${res.isCorrect ? '#34d399' : '#fb7185'}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">
            ${res.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
          </span>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Question ${idx+1}</span>
        </div>
        <p style="font-size: 0.95rem; font-weight: 600; margin: 0 0 var(--space-2) 0; color: var(--text-primary);">${res.question}</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 6px 0;">Your answer: <strong style="color: ${res.isCorrect ? '#34d399' : '#fb7185'};">${res.userAnswer || 'Skipped'}</strong></p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 var(--space-3) 0;">Correct answer: <strong style="color: #34d399;">${res.correctAnswer}</strong></p>
        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-default); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.8rem; color: var(--text-muted);">
          <strong>Explanation:</strong> ${res.explanation}
        </div>
      </div>
    `).join("");

    container.innerHTML = `
      <div class="card reveal animate-fade-up" style="display: flex; flex-direction: column; gap: var(--space-6);">
        <div class="text-center" style="padding: var(--space-6) 0;">
          <span style="font-size: 3rem; display: block; margin-bottom: var(--space-3); filter: drop-shadow(0 0 10px var(--accent-amber));">
            ${quizStats.score === this.questions.length ? '👑' : '🎯'}
          </span>
          <h2 class="text-h1" style="margin: 0; font-size: 1.75rem;">Quiz Concluded</h2>
          <p style="color: var(--text-secondary); margin-top: var(--space-2); margin-bottom: var(--space-6);">
            Dynamic analysis telemetry review complete.
          </p>

          <div style="max-width: 250px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-2); align-items: center;">
            <span style="font-size: 2.25rem; font-weight: 800; color: ${progressColor}; font-family: var(--font-sans);">
              ${quizStats.score} / ${quizStats.total}
            </span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">
              ${quizStats.percentage}% SCORE ACCURACY
            </span>
            ${ProgressBar.render(quizStats.percentage, progressColor)}
          </div>
        </div>

        <div>
          <h3 class="text-h3" style="margin-bottom: var(--space-4); color: var(--text-secondary);">Telemetry Log Review</h3>
          ${reviewHtml}
        </div>

        <div style="display: flex; justify-content: center; gap: var(--space-4); margin-top: var(--space-4);">
          <button id="quiz-retry-btn" class="btn btn-primary">Retry Quiz</button>
          <a href="#/" class="btn btn-secondary">Return Portal</a>
        </div>
      </div>
    `;

    document.getElementById("quiz-retry-btn")?.addEventListener("click", () => {
      container.innerHTML = this.render(this.questions, this.topicTitle);
      this.bindEvents();
    });

    if (quizStats.score === this.questions.length) {
      Toast.show("Perfect score! 5/5 Telemetry Accuracy!", "success");
    }
  }
};

export default QuizMode;
