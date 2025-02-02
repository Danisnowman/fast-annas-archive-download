(function () {
  "use strict";

  /**
   * Apply a set of CSS styles to a given element.
   * @param {HTMLElement} element - The element to style.
   * @param {Object} styles - An object with CSS property-value pairs.
   */
  function applyStyles(element, styles) {
    Object.entries(styles).forEach(([prop, value]) => {
      element.style[prop] = value;
    });
  }

  /**
   * Construct a fast download URL based on the given href.
   * @param {string} href - The original href (e.g. "/md5/43ba0f3bdcde9eb98b25b51321ef9593").
   * @returns {string|null} - The modified URL or null if the href is invalid.
   */
  function getFastDownloadUrl(href) {
    if (typeof href !== "string" || !href.startsWith("/md5/")) {
      return null;
    }
    return href.replace("/md5/", "/fast_download/") + "/0/0";
  }

  /**
   * Process a given anchor element by appending a fast download button.
   * @param {HTMLElement} anchor - The anchor element to enhance.
   */
  function processAnchor(anchor) {
    if (!anchor || typeof anchor.getAttribute !== "function") {
      return;
    }
    const href = anchor.getAttribute("href");
    const fastDownloadUrl = getFastDownloadUrl(href);
    if (!fastDownloadUrl) {
      return;
    }

    const container = anchor.parentElement;
    if (!container) {
      return;
    }

    // Ensure the container is relatively positioned.
    if (window.getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    // Create and style the fast download button.
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "⬇ Fast Download";

    const buttonStyles = {
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "20px",
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "background-color 0.2s ease-in-out",
      position: "absolute",
      top: "0",
      right: "0",
    };

    applyStyles(button, buttonStyles);

    // Add hover effects.
    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#218838";
    });
    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#28a745";
    });

    // On click, log the URL and navigate after a short delay.
    button.addEventListener("click", (event) => {
      event.preventDefault();
      console.debug("Fast download URL:", fastDownloadUrl);
      setTimeout(() => {
        window.location.href = fastDownloadUrl;
      }, 200);
    });

    container.appendChild(button);
  }

  /**
   * Find all matching anchor elements using XPath and process them.
   *
   * The XPath used here:
   *   /html/body/main/form/div[3]/div[2]/div[3]/div/div/a
   * is expected to return all anchor nodes under the specific container.
   */
  function addDownloadButtons() {
    const xpath = "/html/body/main/form/div[3]/div[2]/div[3]/div/div/a";
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < result.snapshotLength; i++) {
      const anchor = result.snapshotItem(i);
      processAnchor(anchor);
    }
  }

  // Run the script after the DOM is fully loaded.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addDownloadButtons);
  } else {
    addDownloadButtons();
  }
})();
