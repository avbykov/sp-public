export class Currency {

	symbol: string;
	decimalLength: number;
	iso4217alfa3: string;
	iso4217number3: string;

	constructor(symbol: string, decimalLength: number, iso4217alfa3: string, iso4217number3: string) {
		this.symbol = symbol;
		this.decimalLength = decimalLength;
		this.iso4217alfa3 = iso4217alfa3;
		this.iso4217number3 = iso4217number3;
	}
}

export enum Direction {
	top = `top`,
	bottom = `bottom`,
	left = `left`,
	right = `right`
}

export type LParameters = [string, string[], string, string[], string[], Currency, string, Direction?, Direction?];

export class Locale {

	country: string;
	languages: string[];
	charset: string;
	dateFormats: string[];
	timeFormats: string[];
	currency: Currency;
	decimalSeparator: string;
	lineDirection: Direction;
	nextLine: Direction;

	constructor(p: LParameters) {
		this.country = p[0];
		this.languages = p[1];
		this.charset = p[2];
		this.dateFormats = p[3];
		this.timeFormats = p[4];
		this.currency = p[5];
		this.decimalSeparator = p[6];
		this.lineDirection = p[7];
		this.nextLine = p[8];
	}
}