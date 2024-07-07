class PIP {
  constructor() {
    this.element = null;

    this.observer = new MutationObserver(() => {
      if (this.isPlayerPage()) {
        this.injectPipControls();
      }
    });

    this.observer.observe(window.document.body, {
      childList: true,
      subtree: true,
    });
  }

  isPlayerPage() {
    const url = new URL(window.location);
    const pattern = /^\/?[A-Za-z-]*\/video\//i;
    return pattern.test(url.pathname);
  }

  togglePiP() {
    if (document.pictureInPictureEnabled && this.element) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        this.element.requestPictureInPicture();
      }
    }
  }

  createPipButton() {
    const TYPE = "button";
    const PIP_BUTTON_ID = "pip-btn";
    const PIP_BUTTON_CLASS = "control-icon-btn fullscreen-icon";

    const button = document.createElement(TYPE);
    button.id = PIP_BUTTON_ID;
    button.type = TYPE;
    button.role = TYPE;
    button.tabindex = "0";
    button.classList = PIP_BUTTON_CLASS;
    button.innerHTML = this.createButtonContent();

    button.addEventListener("click", () => this.togglePiP());

    return button;
  }

  createButtonContent() {
    return `
			<div class="focus-hack-div" tabindex="-1">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -1 27 27" tabindex="-1" focusable="false">
					<path fill="#ffffff" d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/>
				</svg>
			</div>`;
  }

  hasPipControls() {
    return !!document.getElementById("pip-btn");
  }

  injectPipControls() {
    if (this.hasPipControls()) {
      return true;
    }

    this.element = document.querySelector("video");

    if (!this.isPlayerPage() || !this.element) {
      return false;
    }

    this.element.disablePictureInPicture = false;

    const target = document.querySelector("#hudson-wrapper .controls__right");

    if (target) {
      target.insertAdjacentElement("afterbegin", this.createPipButton());
      return true;
    }
  }
}

window.addEventListener("load", () => new PIP(), { once: true });
