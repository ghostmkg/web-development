const convertBtn = document.getElementById("convertBtn");
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");

// Static exchange rates (approximate values)
const rates = {
  USD: 1,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151
};

convertBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    result.textContent = "Please enter a valid amount.";
    return;
  }

  // Convert to USD base, then to target currency
  const convertedAmount = (amount / rates[from]) * rates[to];

  result.textContent = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
});
