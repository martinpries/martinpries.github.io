document.getElementById('start-datetime').addEventListener('input', calculateParkingCost);
document.getElementById('end-datetime').addEventListener('input', calculateParkingCost);

function calculateParkingCost() {
    const startDateTime = document.getElementById('start-datetime').value;
    const endDateTime = document.getElementById('end-datetime').value;

    if (!startDateTime || !endDateTime) return;

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const hours = (end - start) / 1000 / 60 / 60;

    if (hours <= 0) return;

    const priceA = calculatePriceA(start, end);
    const priceB = 16 * hours;
    const priceC = calculatePriceC(start, end);

    document.getElementById('price-a').innerText = priceA.toFixed(2);
    document.getElementById('price-b').innerText = priceB.toFixed(2);
    document.getElementById('price-c').innerText = priceC.toFixed(2);

    highlightCheapestOption(priceA, priceB, priceC);
}

function calculatePriceA(start, end) {
    let total = 0;
    let current = new Date(start);

    while (current < end) {
        const day = current.getDay();
        const hour = current.getHours();

        if (day === 0 || (day === 6 && (hour >= 17 || hour < 8))) {
            current.setHours(current.getHours() + 1);
            continue;
        } else if (hour >= 8 && hour < 18) {
            total += 16;
        } else if (hour >= 18 && hour < 23) {
            total += 17;
        } else {
            total += 6;
        }

        current.setHours(current.getHours() + 1);
    }

    return total;
}

function calculatePriceC(start, end) {
    let total = 0;
    let dailyTotal = 0;
    let current = new Date(start);
    const rates = [5, 10, 15, 20, 25, 25];
    
    while (current < end) {
        const day = current.getDay();
        const hour = current.getHours();
        const minute = current.getMinutes();

        const isChargeable = (day >= 1 && day <= 5 && hour >= 7 && hour < 24) || (day === 6 && hour >= 7 && hour < 17);

        if (isChargeable) {
            const remainingMinutes = Math.min((end - current) / 1000 / 60, 24 * 60 - (hour * 60 + minute));
            let chargeableMinutes = Math.min(remainingMinutes, 60);

            for (let i = 0; i < rates.length && chargeableMinutes > 0; i++) {
                const rate = rates[i];
                const remainingChargeableMinutes = Math.min(chargeableMinutes, 60);

                if (dailyTotal + rate * (remainingChargeableMinutes / 60) <= 110) {
                    dailyTotal += rate * (remainingChargeableMinutes / 60);
                    total += rate * (remainingChargeableMinutes / 60);
                } else {
                    const allowedMinutes = (110 - dailyTotal) / rate * 60;
                    chargeableMinutes = Math.min(remainingChargeableMinutes, allowedMinutes);
                    dailyTotal += rate * (chargeableMinutes / 60);
                    total += rate * (chargeableMinutes / 60);
                }

                chargeableMinutes -= remainingChargeableMinutes;
            }

            current.setMinutes(current.getMinutes() + Math.min(remainingMinutes, 60));
        } else {
            current.setHours(current.getHours() + 1);
        }

        if (current.getHours() === 0 && current.getMinutes() === 0) {
            dailyTotal = 0;
        }
    }

    return total;
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