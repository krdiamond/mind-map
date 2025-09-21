// src/lib/click-spark.js
class ClickSpark extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = this.createSpark();
    this.svg = this.shadowRoot.querySelector("svg");
    this._parent = this.parentNode;

    // ensure parent can position sparks
    if (getComputedStyle(this._parent).position === "static") {
      this._parent.style.position = "relative";
    }

    this._parent.addEventListener("click", this);
  }

  disconnectedCallback() {
    this._parent?.removeEventListener("click", this);
    delete this._parent;
  }

  handleEvent(e) {
    // 🚫 skip spark if this click came right after a drag
    if (e?.currentTarget?.dataset?.dragged) return;

    this.setSparkPosition(e);
    this.animateSpark();
  }

  setSparkPosition(e) {
    // position relative to parent container
    const rect = this._parent.getBoundingClientRect();
    const x = e.clientX - rect.left - this.clientWidth / 2;
    const y = e.clientY - rect.top - this.clientHeight / 2;
    this.style.left = x + "px";
    this.style.top = y + "px";
  }

  animateSpark() {
    const sparks = [...this.svg.children];
    const size = parseInt(sparks[0].getAttribute("y1"));
    const offset = size / 2 + "px";

    const keyframes = (i) => {
      const deg = `calc(${i} * (360deg / ${sparks.length}))`;
      return [
        {
          strokeDashoffset: size * 3,
          transform: `rotate(${deg}) translateY(${offset})`,
        },
        {
          strokeDashoffset: size,
          transform: `rotate(${deg}) translateY(0)`,
        },
      ];
    };

    const options = {
      duration: 660,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      fill: "forwards",
    };

    sparks.forEach((spark, i) => spark.animate(keyframes(i), options));
  }

  createSpark() {
    return `
      <style>
        :host {
          position: absolute;
          pointer-events: none;
        }
      </style>
      <svg width="50" height="50" viewBox="0 0 100 100" fill="none"
           stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
           stroke="var(--click-spark-color, currentcolor)" transform="rotate(-20)">
        ${Array.from(
          { length: 8 },
          () =>
            `<line x1="50" y1="45" x2="50" y2="0"
                   stroke-dasharray="45"
                   stroke-dashoffset="45"
                   style="transform-origin: center" />`
        ).join("")}
      </svg>
    `;
  }
}

customElements.define("click-spark", ClickSpark);
export default ClickSpark;
