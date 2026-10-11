"use strict";

const personalContent = {
  memories: [
    { title: "送你回家的路", text: "高中时期，我送你回家。直到现在，想起这件事，心里仍然很温暖。" },
    { title: "在走廊寻找你的身影", text: "高一的时候，我总是在教室走廊，朝教学楼望去，寻找你的身影。" }
  ],
  careLine: "希望你工作顺利，身体健康。"
};

const scenes = [...document.querySelectorAll(".scene")];
const counter = document.getElementById("step-counter");
const backButton = document.getElementById("back-button");
const envelope = document.getElementById("envelope");
const overlay = document.getElementById("meter-overlay");
const teaseButton = document.getElementById("tease-button");
const quizFootnote = document.getElementById("quiz-footnote");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentStep = 0;
let coverOpening = false;
let prankRunning = false;
let teaseCount = 0;

personalContent.memories.forEach((memory, index) => {
  document.getElementById(`memory-title-${index + 1}`).textContent = memory.title;
  document.getElementById(`memory-text-${index + 1}`).textContent = memory.text;
});
document.getElementById("personal-care-line").textContent = personalContent.careLine;

function showStep(step, updateHistory = true) {
  if (step < 0 || step >= scenes.length) return;
  scenes.forEach((scene, index) => {
    scene.hidden = index !== step;
    scene.classList.toggle("is-active", index === step);
  });
  currentStep = step;
  counter.textContent = `${String(step + 1).padStart(2, "0")} / 06`;
  counter.setAttribute("aria-label", `第 ${step + 1} 页，共 6 页`);
  backButton.hidden = step === 0;
  if (updateHistory) history.pushState({ step }, "", location.href);
  window.scrollTo({ top: 0, behavior: "auto" });
  const title = scenes[step].querySelector("h1, h2");
  if (title) {
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
  }
  if (step === 0) {
    coverOpening = false;
    envelope.classList.remove("is-opening");
  }
}

history.replaceState({ step: 0 }, "", location.href);
window.addEventListener("popstate", (event) => {
  const step = Number.isInteger(event.state?.step) ? event.state.step : 0;
  showStep(step, false);
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep === 0) {
      if (coverOpening) return;
      coverOpening = true;
      envelope.classList.add("is-opening");
      window.setTimeout(() => showStep(1), reduceMotion.matches ? 30 : 500);
      return;
    }
    showStep(currentStep + 1);
  });
});

backButton.addEventListener("click", () => history.back());
document.getElementById("replay-button").addEventListener("click", () => showStep(0));

document.querySelectorAll(".memory-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    document.getElementById(button.getAttribute("aria-controls")).hidden = expanded;
  });
});

document.querySelectorAll(".care-card").forEach((button) => {
  button.addEventListener("click", () => {
    button.setAttribute("aria-expanded", String(button.getAttribute("aria-expanded") !== "true"));
  });
});

function revealFinale() {
  if (prankRunning) return;
  prankRunning = true;
  overlay.hidden = false;
  window.setTimeout(() => {
    overlay.hidden = true;
    prankRunning = false;
    showStep(5);
  }, reduceMotion.matches ? 800 : 1700);
}

document.querySelector("[data-reveal]").addEventListener("click", revealFinale);
teaseButton.addEventListener("click", () => {
  if (teaseCount === 0) {
    teaseCount = 1;
    teaseButton.classList.add("is-dodging");
    teaseButton.innerHTML = '哎呀，没抓到 <span aria-hidden="true">♡</span>';
    quizFootnote.textContent = "逗你玩的，再点一下就好。";
    window.setTimeout(() => teaseButton.classList.remove("is-dodging"), 550);
    return;
  }
  revealFinale();
});
