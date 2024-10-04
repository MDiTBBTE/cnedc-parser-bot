export const isValidCard = (cardData) => {
  const cleanCardData = cardData.replace(/[^\x20-\x7E]/g, "").trim();

  const cardParts = cleanCardData.split("|").map((part) => part.trim());

  if (cardParts.length < 3 || cardParts.length > 4) {
    return false;
  }

  let cardNumber, expDate, expMonth, expYear, cvv;

  if (cardParts.length === 3) {
    [cardNumber, expDate, cvv] = cardParts;

    let [month, year] = expDate.includes("/")
      ? expDate.split("/")
      : [expDate.slice(0, 2), expDate.slice(2)];

    expMonth = parseInt(month, 10);
    expYear = parseInt(year, 10);
  } else if (cardParts.length === 4) {
    [cardNumber, expMonth, expYear, cvv] = cardParts;

    expMonth = parseInt(expMonth, 10);
    expYear = parseInt(expYear, 10);
  }

  if (expYear < 100) {
    expYear += 2000;
  }

  const cleanCardNumber = cardNumber.replace(/\D/g, "");

  const luhnCheck = (num) => {
    let sum = 0;
    const reversedDigits = num.split("").reverse(); // Переворачиваем строку для правильной обработки

    for (let i = 0; i < reversedDigits.length; i++) {
      let digit = parseInt(reversedDigits[i], 10);

      // Удваиваем каждую вторую цифру, начиная с первой (в исходной строке)
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
    }

    return sum % 10 === 0; // Если сумма делится на 10 без остатка, номер карты валиден
  };

  const isExpired = (expMonth, expYear) => {
    const currentDate = new Date();
    const expDate = new Date(expYear, expMonth - 1);

    return expDate < currentDate;
  };

  const isCvvValid = (cvv) => /^\d{3,4}$/.test(cvv);

  const isValidNumber = luhnCheck(cleanCardNumber);
  const isNotExpired = !isExpired(expMonth, expYear);
  const isValidCvv = isCvvValid(cvv);

  return isValidNumber && isNotExpired && isValidCvv;
};

export const validateCardList = (input) => {
  const cardList = input.split("\n").filter((_e, i) => i !== 0);

  return cardList
    .map((cardData) => {
      return isValidCard(cardData)
        ? `\n ✅ | ${cardData}`
        : `\n 🛑 | ${cardData}`;
    })
    .join("");
};

export const hasToValidCardInput = (input) => {
  return input.startsWith("#RUN_CHECKER");
};
