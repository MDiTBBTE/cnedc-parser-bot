export const parseCardDetailsFromText = (input) => {
  const cardRegex = /(?:\b|\s)(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g;
  // COMMENT: changed from /\b(0[1-9]|1[0-2])[\s\/|-]*(\d{2}|\d{4})\b/g
  const expiryRegex = /\b(0[1-9]|1[0-2])[\s/|-]*(\d{2}|\d{4})\b/g;
  const cvvRegex = /(?:CVV\s*:?\s*|^|\s)(\d{3})(?:\s|$|[^0-9])/g;

  let cards = [];
  let expiryDates = [];
  let cvvs = [];

  let match;

  // Extract card numbers
  while ((match = cardRegex.exec(input)) !== null) {
    cards.push(match[1].replace(/[\s-]/g, ""));
  }
  // Extract expiry dates
  while ((match = expiryRegex.exec(input)) !== null) {
    let month = match[1];
    let year = match[2];
    if (year.length === 4) {
      year = year.slice(-2); // Take only the last two digits of the year
    }
    expiryDates.push(`${month}|${year}`);
  }
  // Extract CVVs
  while ((match = cvvRegex.exec(input)) !== null) {
    cvvs.push(match[1]);
  }

  // Combine extracted data
  let parsedData = [];
  for (
    let i = 0;
    i < Math.max(cards.length, expiryDates.length, cvvs.length);
    i++
  ) {
    const card = cards[i] || null;
    const expiry = expiryDates[i] || null;
    const cvv = cvvs[i] || null;

    if (card && expiry && cvv) {
      parsedData.push(`${card}|${expiry}|${cvv}`);
    }
  }

  return parsedData.join("\n");
};

export const parseCardDetailsFromHTML = (input) => {
  const cardRegex = /(?:\b|\s)(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g;
  // COMMENT: changed from /\b(0[1-9]|1[0-2])[\s\/|-]*(\d{2}|\d{4})\b/g
  const expiryRegex = /\b(0[1-9]|1[0-2])[\s/|-]*(\d{2}|\d{4})\b/g;
  const cvvRegex =
    /\b(?:CVV|CVC|CSC|CVV\/CVC)\b.*?(?:<code>|<strong>)?(\d{3,4})(?:<\/code>|<\/strong>)?/gi;

  const splitHTMLInput = (input) => {
    if (/<\/?strong>/i.test(input)) {
      return input.split(/\n+/g).filter(Boolean);
    }

    return input.split(/<\/?div>/).filter(Boolean);
  };

  const blocks = splitHTMLInput(input);
  let parsedData = [];

  for (let block of blocks) {
    let cards = [];
    let expiryDates = [];
    let cvvs = [];

    let match;

    // Extract card numbers
    while ((match = cardRegex.exec(block)) !== null) {
      cards.push(match[1].replace(/[\s-]/g, ""));
    }
    // Extract expiry dates
    while ((match = expiryRegex.exec(block)) !== null) {
      let month = match[1];
      let year = match[2];
      if (year.length === 4) {
        year = year.slice(-2);
      }
      expiryDates.push(`${month}|${year}`);
    }
    // Extract CVVs
    while ((match = cvvRegex.exec(block)) !== null) {
      cvvs.push(match[1]);
    }

    for (
      let i = 0;
      i < Math.max(cards.length, expiryDates.length, cvvs.length);
      i++
    ) {
      const card = cards[i] || null;
      const expiry = expiryDates[i] || null;
      const cvv = cvvs[i] || null;

      if (card && expiry && cvv) {
        parsedData.push(`${card}|${expiry}|${cvv}`);
      }
    }
  }

  return parsedData.join("\n");
};

export const parseCardDetails = (input) => {
  const inputHasHtml = /<\/?[a-z][\s\S]*>/i.test(input);

  if (inputHasHtml) {
    return parseCardDetailsFromHTML(input);
  } else {
    return parseCardDetailsFromText(input);
  }
};

export const hasToParseTextOrHTML = (input) => {
  const inputHasHtml = /<\/?[a-z][\s\S]*>/i.test(input);

  const cardRegex = /(?:\b|\s)(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g;
  const match = cardRegex.exec(input);

  return inputHasHtml || match;
};
