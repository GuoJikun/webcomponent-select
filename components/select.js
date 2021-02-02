class Select extends HTMLElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
    // 元素的功能代码写在这里

    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
                position: relative;
                display: inline-block;
            }
            .select-inner {
                height: 34px;
                border: 1px solid #cdcdcd;
                box-sizing: border-box;
                font-size: 13px;
                outline: none;
                padding: 0 10px;
                border-radius: 4px;
            }
            .drop {
                position: absolute;
                top: 36px;
                left: 0;
                width: 100%;
                padding: 4px 0;
                border-radius: 2px;
                overflow: auto;
                max-height: 256px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                display: none;
            }
        </style>
        <input class="select-inner" readonly>
        <div class="drop">
            <slot></slot>
        </div>
      `;

    const shadowELe = this.attachShadow({ mode: "open" });
    const content = template.content.cloneNode(true);
    shadowELe.appendChild(content);

    this.$input = shadowELe.querySelector(".select-inner");
    this.dropEle = shadowELe.querySelector(".drop");
    this.value === null;

    this.$input.addEventListener("click", () => {
      this.dropEle.style.display = "block";
    });

    this.dropEle.addEventListener("click", (ev) => {
      const target = ev.target;
      const nodeName = target.nodeName.toLowerCase();
      if (nodeName === "ivy-option") {
        this.value = target.getAttribute("value");
        this.$input.setAttribute("value", target.innerHTML);
        // 自定义事件
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              value: this.value,
            },
          })
        );

        this.dropEle.style.display = "none";
      }
    });

    this.BodyClick = () => {
      this.dropEle.style.display = "none";
    };
  }
  connectedCallback() {
    document.addEventListener("click", this.BodyClick, true);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this.BodyClick);
  }
}

class Option extends HTMLElement {
  constructor() {
    // 必须首先调用 super 方法
    super();
    // 元素的功能代码写在这里

    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
                position: relative;
            }
            .option {
                height: 32px;
                line-height: 32px;
                box-sizing: border-box;
                font-size: 13px;
                color: #333333;
                padding: 0 10px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .option:hover {
                background-color: #f4f4f4;
            }
        </style>
        <div class="option">
            <slot></slot>
        </div>
      `;

    const shadowELe = this.attachShadow({ mode: "open" });
    const content = template.content.cloneNode(true);
    shadowELe.appendChild(content);
  }
  static get observedAttributes() {
    return ["value"];
  }
}

customElements.define("ivy-select", Select);
customElements.define("ivy-option", Option);
