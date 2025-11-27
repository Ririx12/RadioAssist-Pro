// RadioAssist Pro - Clipboard Service

// Robust clipboard copy with execCommand fallback



/**

 * Fallback copy using document.execCommand (deprecated but still works)

 * @param {string} text - Text to copy

 */

const fallbackCopy = (text) => {

  const textArea = document.createElement("textarea");

  textArea.value = text;



  // Position off-screen to avoid scroll

  textArea.style.position = "fixed";

  textArea.style.left = "-9999px";

  textArea.style.top = "0";



  document.body.appendChild(textArea);

  textArea.focus();

  textArea.select();



  try {

    const successful = document.execCommand('copy');

    if (!successful) {

      console.error("Fallback copy failed.");

    }

  } catch (err) {

    console.error("Fallback copy error", err);

  }



  document.body.removeChild(textArea);

};



/**

 * Copy text to clipboard with automatic fallback

 * @param {string} text - Text to copy

 * @returns {Promise<void>}

 */

export const copyToClipboard = async (text) => {

  if (!text) return;



  // Attempt 1: Clipboard API (can fail in iframes or without HTTPS)

  if (navigator.clipboard && navigator.clipboard.writeText) {

    try {

      await navigator.clipboard.writeText(text);

      return;

    } catch (err) {

      console.warn("Clipboard API failed, trying execCommand fallback...", err);

      fallbackCopy(text);

    }

  } else {

    // Clipboard API not available

    fallbackCopy(text);

  }

};

