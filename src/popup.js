const toggleInput = document.getElementById("isEnabled")

chrome.storage.local.get().then(({ isEnabled }) => {
    if (isEnabled) {
        toggleInput.checked = true
    }
})

toggleInput.addEventListener("change", e => {
    const isChecked = e.target.checked

    ;(async () => {
        // TODO: Maybe add try/catch?
        const firstTab = await getCurrentTab()
        const options = { isEnabled: isChecked }
        await sendOptions(firstTab, options)
        await chrome.storage.local.set(options)
    })()
})

async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true }
    const [firstTab] = await chrome.tabs.query(queryOptions)
    return firstTab
}

async function sendOptions(firstTab, options) {
    await chrome.tabs.sendMessage(firstTab.id, options)
}
