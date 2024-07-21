class PIP {
  constructor() {
    this.observer = new MutationObserver(() => {
      if (this.isPlayerPage()) {
        this.injectPipControls();
      }
    });

    this.observer.observe(window.document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("unload", () => this.observer.disconnect(), {
      once: true,
    });
  }

  isPlayerPage() {
    const { pathname } = window.location;
    const pattern = /^\/?[A-Za-z-]+\/play\/[A-Za-z0-9-]+\/?$/i;
    return pattern.test(pathname);
  }

  togglePiP() {
    const videoElement = document.querySelector("video");

    if (!videoElement) {
      console.log("Nenhum elemento de vídeo encontrado.");
      return;
    }

    if (videoElement.hasAttribute("disablePictureInPicture")) {
      videoElement.removeAttribute("disablePictureInPicture");
    }

    if (videoElement !== document.pictureInPictureElement) {
      videoElement
        .requestPictureInPicture()
        .then(() => {
          console.log("Picture-in-Picture iniciado.");
        })
        .catch((error) => {
          console.error("Erro ao iniciar Picture-in-Picture:", error);
        });
    } else {
      document
        .exitPictureInPicture()
        .then(() => {
          console.log("Picture-in-Picture encerrado.");
        })
        .catch((error) => {
          console.error("Erro ao encerrar Picture-in-Picture:", error);
        });
    }
  }

  createPipButton() {
    const button = document.createElement("button");
    button.id = "pip-btn";
    button.type = "button";
    button.role = "button";
    button.tabIndex = "0";
    button.classList = "control-icon-btn fullscreen-icon";
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

  injectPipControls() {
    if (this.btnElementIdExists() || !this.isPlayerPage()) {
      return;
    }

    const target = document.querySelector("#hudson-wrapper .controls__right");

    if (target) {
      target.insertAdjacentElement("afterbegin", this.createPipButton());
    }
  }

  btnElementIdExists() {
    return !!document.getElementById("pip-btn");
  }
}

window.addEventListener("load", () => new PIP(), { once: true });
