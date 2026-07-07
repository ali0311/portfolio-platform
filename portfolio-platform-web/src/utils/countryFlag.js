const COUNTRY_TO_ISO = {
  "India": "IN",
  "United States": "US",
  "United States of America": "US",
  "USA": "US",
  "United Kingdom": "GB",
  "UK": "GB",
  "Canada": "CA",
  "Australia": "AU",
  "Germany": "DE",
  "France": "FR",
  "Netherlands": "NL",
  "Spain": "ES",
  "Italy": "IT",
  "Sweden": "SE",
  "Norway": "NO",
  "Denmark": "DK",
  "Finland": "FI",
  "Ireland": "IE",
  "Poland": "PL",
  "Portugal": "PT",
  "Switzerland": "CH",
  "Austria": "AT",
  "Belgium": "BE",
  "Czech Republic": "CZ",
  "Czechia": "CZ",
  "Greece": "GR",
  "Turkey": "TR",
  "Russia": "RU",
  "Ukraine": "UA",
  "Japan": "JP",
  "South Korea": "KR",
  "Korea": "KR",
  "China": "CN",
  "Hong Kong": "HK",
  "Taiwan": "TW",
  "Singapore": "SG",
  "Malaysia": "MY",
  "Indonesia": "ID",
  "Thailand": "TH",
  "Vietnam": "VN",
  "Philippines": "PH",
  "Pakistan": "PK",
  "Bangladesh": "BD",
  "Sri Lanka": "LK",
  "Nepal": "NP",
  "United Arab Emirates": "AE",
  "UAE": "AE",
  "Saudi Arabia": "SA",
  "Israel": "IL",
  "Egypt": "EG",
  "South Africa": "ZA",
  "Nigeria": "NG",
  "Kenya": "KE",
  "Brazil": "BR",
  "Argentina": "AR",
  "Mexico": "MX",
  "Chile": "CL",
  "Colombia": "CO",
  "Peru": "PE",
  "New Zealand": "NZ",
};

function isoToFlag(iso) {
  if (!iso || iso.length !== 2) return "";
  const codePoints = iso
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function flagFor(countryName) {
  if (!countryName) return "";
  const iso = COUNTRY_TO_ISO[countryName];
  return iso ? isoToFlag(iso) : "";
}
