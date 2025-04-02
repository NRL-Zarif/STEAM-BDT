async function getExchangeRate() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["customExchangeRate"], async function (result) {
            if (result.customExchangeRate) {
                resolve(result.customExchangeRate); //user rate
            } else {
                try {
                    let response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
                    let data = await response.json();
                    resolve(data.rates.BDT); // API rate
                } catch (error) {
                    console.error("Failed to fetch exchange rate:", error);
                    resolve(110); 
                }
            }
        });
    });
}

function convertToBangla(number) {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number.toString().split("").map(digit => bnDigits[parseInt(digit)] || digit).join("");
}

async function convertAllPrices() {
    let exchangeRate = await getExchangeRate();
    let language = await new Promise(resolve => {
        chrome.storage.sync.get(["language"], function (result) {
            resolve(result.language || 'en');
        });
    });

    
    document.querySelectorAll(".discount_final_price, .game_purchase_price, .bundle_base_discount").forEach((priceElement) => {
        let priceText = priceElement.innerText.match(/\d+(\.\d+)?/);
        if (!priceText) return;

        let usdPrice = parseFloat(priceText[0]);
        let bdtPrice = (usdPrice * exchangeRate).toFixed(2);

        if (language === 'bn') {
            bdtPrice = convertToBangla(bdtPrice);
        }

        priceElement.innerText = `৳${bdtPrice} BDT`;
    });

    
    document.querySelectorAll(".discount_original_price").forEach((priceElement) => {
        let priceText = priceElement.innerText.match(/\d+(\.\d+)?/);
        if (!priceText) return;

        let usdPrice = parseFloat(priceText[0]);
        let bdtPrice = (usdPrice * exchangeRate).toFixed(2);

        if (language === 'bn') {
            bdtPrice = convertToBangla(bdtPrice);
        }

        priceElement.innerText = `৳${bdtPrice} BDT`; 
    });
}

convertAllPrices();
