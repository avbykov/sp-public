import {Currency, Direction, Locale, LParameters} from '../model/Model.js';

interface DS {

	exists(country: string): Promise<boolean>;

	read(country: string): Promise<Locale>;

	create(parameters: LParameters): Promise<string>;

	remove(country: string): Promise<number>,

	getLanguages(country: string): Promise<string[]>;

	setLanguages(country: string, languages: string[]): Promise<boolean>;

    getCharset(country: string): Promise<string>;

    setCharset(country: string, charset: string): Promise<boolean>;

    getDateFormats(country: string): Promise<string[]>;

	setDateFormats(country: string, dateFormats: string[]): Promise<boolean>;

    getTimeFormats(country: string): Promise<string[]>;

	setTimeFormats(country: string, timeFormats: string[]): Promise<boolean>;

    getCurrency(country: string): Promise<Currency>;

	setCurrency(country: string, currency: Currency): Promise<boolean>;

    getDecimalSeparator(country: string): Promise<string>;

    setDecimalSeparator(country: string, separator: string): Promise<boolean>;

    getLineDirection(country: string): Promise<Direction>;

	setLineDirection(country: string, direction: Direction): Promise<boolean>;

    getNextLine(country: string): Promise<Direction>;

	setNextLine(country: string, direction: Direction): Promise<boolean>;

	connect(): Promise<string>;

	disconnect(): Promise<any>;

}

export {DS};