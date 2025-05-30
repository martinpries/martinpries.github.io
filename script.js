document.getElementById('start-datetime').addEventListener('input', calculateParkingCost);
document.getElementById('end-datetime').addEventListener('input', calculateParkingCost);

function calculateParkingCost() {
    const startDateTime = document.getElementById('start-datetime').value;
    const endDateTime = document.getElementById('end-datetime').value;

    if (!startDateTime || !endDateTime) return;

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (end <= start) return;

    const priceA = calculatePriceA(start, end);
    const priceB = calculatePriceB(start, end);
    const priceC = calculatePriceC(start, end);

    document.getElementById('price-a').innerText = priceA.toFixed(2);
    document.getElementById('price-b').innerText = priceB.toFixed(2);
    document.getElementById('price-c').innerText = priceC.toFixed(2);

    highlightCheapestOption(priceA, priceB, priceC);
}

// København Vesterbro
function calculatePriceA(start, end) {
    let total = 0;
    let current = new Date(start);

    while (current < end) {
        const day = current.getDay();
        const hour = current.getHours();
        const minute = current.getMinutes();

        if ((day === 6 && hour >= 17) || (day === 0) || (hour < 8 && day >= 1 && day <= 5)) {
            current.setMinutes(current.getMinutes() + 1);
            continue;
        }

        const remainingMinutes = Math.min((end - current) / 1000 / 60, 60 - minute);
        let ratePerMinute = 0;

        if (hour >= 8 && hour < 18) {
            ratePerMinute = 16 / 60;
        } else if (hour >= 18 && hour < 23) {
            ratePerMinute = 17 / 60;
        } else if (hour >= 23 || hour < 8) {
            ratePerMinute = 6 / 60;
        }

        total += remainingMinutes * ratePerMinute;
        current.setMinutes(current.getMinutes() + remainingMinutes);
    }

    return total;
}

// Carlsberg Byen
function calculatePriceB(start, end) {
    const hours = (end - start) / 1000 / 60 / 60;
    const startedHours = Math.ceil(hours); // Round up to the nearest hour for started hours

    let totalPrice = 0;
    let current = new Date(start);

    while (current < end) {
        const day = current.getDay();
        const hour = current.getHours();

        // Determine the rate based on the day and hour
        if ((day >= 1 && day <= 5)) {
            // Monday to Friday and Sunday
            totalPrice += 27;
        } else if ((day >= 6) || (day <= 0)){
            // Saturday and Sunday
            totalPrice += 14.5;
        }

        current.setHours(current.getHours() + 1); // Move to the next hour
    }

    return totalPrice;
}

// Frederiksberg
function calculatePriceC(start, end) {
    let total = 0;
    let dailyTotal = 0;
    let current = new Date(start);
    const rates = [5, 10, 15, 20, 25, 25];
    const maxDailyRate = 110;
    const maxWeeklyRate = 550;

    while (current < end) {
        const day = current.getDay();
        const hour = current.getHours();
        const minute = current.getMinutes();

        const isChargeable = (day >= 1 && day <= 5 && hour >= 7 && hour < 24) || (day === 6 && hour >= 7 && hour < 17);

        if (isChargeable) {
            const remainingMinutes = Math.min((end - current) / 1000 / 60, (day === 6 && hour < 17 ? 17 * 60 - (hour * 60 + minute) : 24 * 60 - (hour * 60 + minute)));
            let hoursToCharge = Math.floor(remainingMinutes / 60);
            let minutesToCharge = remainingMinutes % 60;

            for (let i = 0; i < rates.length && hoursToCharge > 0; i++) {
                const rate = rates[i];
                const rateMinutes = 60;

                if (dailyTotal + rate <= maxDailyRate) {
                    dailyTotal += rate;
                    total += rate;
                } else {
                    total += maxDailyRate - dailyTotal;
                    dailyTotal = maxDailyRate;
                }
                hoursToCharge--;
            }

            if (hoursToCharge > 0) {
                const additionalRate = 25;
                const additionalCharge = Math.min(hoursToCharge * additionalRate, maxDailyRate - dailyTotal);
                dailyTotal += additionalCharge;
                total += additionalCharge;
                hoursToCharge = 0;
            }

            const currentRateIndex = Math.min(rates.length - 1, Math.floor(minutesToCharge / 60));
            const minuteRate = rates[currentRateIndex] * (minutesToCharge / 60);

            if (dailyTotal + minuteRate <= maxDailyRate) {
                dailyTotal += minuteRate;
                total += minuteRate;
            } else {
                total += maxDailyRate - dailyTotal;
                dailyTotal = maxDailyRate;
            }

            current.setMinutes(current.getMinutes() + remainingMinutes);
        } else {
            current.setHours(current.getHours() + 1);
        }

        if (current.getHours() === 0 && current.getMinutes() === 0) {
            dailyTotal = 0;
        }
    }

    return Math.min(total, maxWeeklyRate);
}

function highlightCheapestOption(priceA, priceB, priceC) {
    document.getElementById('option-a').classList.remove('highlight');
    document.getElementById('option-b').classList.remove('highlight');
    document.getElementById('option-c').classList.remove('highlight');

    const minPrice = Math.min(priceA, priceB, priceC);

    if (priceA === minPrice) {
        document.getElementById('option-a').classList.add('highlight');
    }
    if (priceB === minPrice) {
        document.getElementById('option-b').classList.add('highlight');
    }
    if (priceC === minPrice) {
        document.getElementById('option-c').classList.add('highlight');
    }
}