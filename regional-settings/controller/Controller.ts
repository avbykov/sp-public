import {Currency, Direction, RegionalSettings, RsParameters} from "../model/Model.js";
import {dsLocator} from "../ds/DsLocator.js";

const ds = dsLocator.acquire(process.env.org_enc_sp_regional_settings_ds);

const exists = async (country: string): Promise<boolean> => ds.exists(country);

const add = {
	regionalSettings: async (parameters: RsParameters): Promise<string> => ds.create(parameters)
};

const put = {
	languages: async (country: string, languages: string[]): Promise<boolean> => ds.setLanguages(country, languages),
	charset: async (country: string, charset: string): Promise<boolean> => ds.setCharset(country, charset),
	dateFormats: async (country: string, dateFormats: string[]): Promise<boolean> => ds.setDateFormats(country, dateFormats),
	timeFormats: async (country: string, timeFormats: string[]): Promise<boolean> => ds.setTimeFormats(country, timeFormats),
	currency: async (country: string, currency: Currency): Promise<boolean> => ds.setCurrency(country, currency),
	decimalSeparator: async (country: string, decimalSeparator: string): Promise<boolean> => ds.setDecimalSeparator(country, decimalSeparator),
	lineDirection: async (country: string, lineDirection: Direction): Promise<boolean> => ds.setLineDirection(country, lineDirection),
	nextLine: async (country: string, nextLine: Direction): Promise<boolean> => ds.setNextLine(country, nextLine)
};

const get = {
	regionalSettings: async (country: string): Promise<RegionalSettings> => ds.read(country),
	languages: async (country: string): Promise<string[]> => ds.getLanguages(country),
	charset: async (country: string): Promise<string> => ds.getCharset(country),
	dateFormats: async (country: string): Promise<string[]> => ds.getDateFormats(country),
	timeFormats: async (country: string): Promise<string[]> => ds.getTimeFormats(country),
	currency: async (country: string): Promise<Currency> => ds.getCurrency(country),
	decimalSeparator: async (country: string): Promise<string> => ds.getDecimalSeparator(country),
	lineDirection: async (country: string): Promise<Direction> => ds.getLineDirection(country),
	nextLine: async (country: string): Promise<Direction> => ds.getNextLine(country)
};

const del = {
	regionalSettings: async (country: string): Promise<number> => ds.remove(country)
};

export {exists, add, put, get, del};