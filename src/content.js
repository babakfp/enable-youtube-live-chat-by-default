// Check Chrome storage for the isEnabled flag.
chrome.storage.local.get().then(({ isEnabled }) => {
    if (isEnabled) {
        switchToLiveChat()
    }
})

// TODO: Maybe add try/catch?
// Listen for messages from the extension.
chrome.runtime.onMessage.addListener(({ isEnabled }) => {
    if (isEnabled) {
        switchToLiveChat()
    }
})

// Function to switch to Live Chat.
function switchToLiveChat() {
    /** @type {HTMLIFrameElement | null} */
    const iframe = document.querySelector("#chatframe")
    if (iframe) {
        fireClickActions(iframe)
    } else {
        waitForQuerySelector(
            document.body,
            "#chatframe",
            /** @param {HTMLIFrameElement} iframe */ iframe => {
                fireClickActions(iframe)
            },
        )
    }
}

/**
 * @param {HTMLIFrameElement} iframe
 * @returns
 */
function fireClickActions(iframe) {
    let didGoInsideLoad = false

    // Add an event listener for the iframe's load event.
    iframe.contentWindow.addEventListener("load", () => {
        didGoInsideLoad = true
        clickToSwitch(iframe)
    })

    // If the load event didn't trigger (iframe already loaded), call clickToSwitch.
    if (!didGoInsideLoad) {
        clickToSwitch(iframe)
    }
}

/**
 * Clicks to switch to "Live chat replay" mode if not already on that mode.
 * @param {Document} param0 - An object with a `contentDocument` property representing the document to interact with.
 */
function clickToSwitch({ contentDocument: document }) {
    waitForQuerySelector(
        document.body,
        "#label-text",
        /** @param {HTMLDivElement} labelElement */ labelElement => {
            if (labelElement.textContent === "Live chat replay") return

            const triggerButton = document.querySelector("#trigger")
            if (!triggerButton) return
            triggerButton.click()

            const liveChatButton = document.querySelector(
                "#menu > a:last-of-type",
            )
            if (!liveChatButton) return
            liveChatButton.click()
        },
    )
}

/**
 * Wait for a specified selector to become available in the DOM and execute a callback function when found.
 * @param {Node | Element | HTMLBodyElement} target A DOM Node (which may be an Element) within the DOM tree to watch for changes, or to be the root of a subtree of nodes to be watched.
 * @param {string} selector - The CSS selector to wait for.
 * @param {(element: Element) => void} callback - The callback function to execute when the selector is found.
 */
function waitForQuerySelector(target, selector, callback) {
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            // Check if the selector exists in the added nodes
            if (mutation.addedNodes.length > 0) {
                const element = target.querySelector(selector)
                if (element) {
                    // Selector found, call the callback function
                    callback(element)
                    // Disconnect the observer since we found what we were looking for
                    observer.disconnect()
                    // Break out of the loop
                    break
                }
            }
        }
    })

    // Start observing for changes
    observer.observe(target, { childList: true, subtree: true })
}
