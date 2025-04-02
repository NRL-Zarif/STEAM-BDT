document.addEventListener("DOMContentLoaded", function () {
    let exchangeRateInput = document.getElementById("exchangeRate");
    let saveButton = document.getElementById("saveRate");
    let resetButton = document.getElementById("resetRate");
    let languageSelect = document.getElementById("languageSelect");
    let languageIndicator = document.getElementById("languageIndicator");

    chrome.storage.sync.get(["customExchangeRate", "language"], function (result) {
        if (result.customExchangeRate) {
            exchangeRateInput.value = result.customExchangeRate;
        }
        if (result.language) {
            languageSelect.value = result.language;
            updateLanguageIndicator(result.language);
        }
    });

    saveButton.addEventListener("click", function () {
        let rate = parseFloat(exchangeRateInput.value);
        if (!isNaN(rate) && rate > 0) {
            chrome.storage.sync.set({ customExchangeRate: rate }, function () {
                alert("Exchange rate saved!");
            });
        } else {
            alert("Please enter a valid exchange rate.");
        }
    });

    resetButton.addEventListener("click", function () {
        chrome.storage.sync.remove("customExchangeRate", function () {
            alert("Reset to API exchange rate.");
            exchangeRateInput.value = ""; 
        });
    });

    languageSelect.addEventListener("change", function () {
        let selectedLanguage = languageSelect.value;
        chrome.storage.sync.set({ language: selectedLanguage }, function () {
            updateLanguageIndicator(selectedLanguage);
        });
    });

    function updateLanguageIndicator(language) {
        if (language === "bn") {
            languageIndicator.innerText = "Current Language: Bangla";
        } else {
            languageIndicator.innerText = "Current Language: English";
        }
    }
});
