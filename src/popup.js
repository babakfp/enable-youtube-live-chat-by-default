const toggleInput = document.getElementById("isEnabled")

toggleInput.addEventListener("change", e => {
    const isChecked = e.target.checked

    ;(async () => {
        try {
            const firstTab = await getCurrentTab()
            const options = { isEnabled: isChecked }
            await sendOptions(firstTab, options)
        } catch {}
        // TODO: Maybe this is a bad idea! ^^^
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
