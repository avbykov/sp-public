import {DS} from "../DS.js";
import {Currency, Direction, Locale, LParameters} from "../../model/Model.js";
import {createClient} from "redis";

export class RedisDs implements DS {

	private client;

	private successful = (ok: string): boolean => `OK` === ok;

	public exists = (country: string): Promise<boolean> => this.read(country).then(result => result !== null);

	public read = async (country: string): Promise<Locale> => this.client.json.get(country);

	public create = async (parameters: LParameters) => this.client.json.set(parameters[0], `.`, new Locale(parameters));

	public remove = async (country: string): Promise<number> => this.client.json.del(country);

	public getLanguages = async (country: string): Promise<string[]> => this.client.json.get(country, {path: `languages`});

	public setLanguages = async (country: string, languages: string[]): Promise<boolean> => this.client.json.set(country, `$.languages`, languages).then(this.successful);

	public getCharset = async (country: string): Promise<string> => this.client.json.get(country, {path: `charset`});

	public setCharset = async (country: string, charset: string): Promise<boolean> => this.client.json.set(country, `$.charset`, charset).then(this.successful);

	public getDateFormats = async (country: string): Promise<string[]> => this.client.json.get(country, {path: `dateFormats`});

	public setDateFormats = async (country: string, dateFormats: string[]): Promise<boolean> => this.client.json.set(country, `$.dateFormats`, dateFormats).then(this.successful);

	public getTimeFormats = async (country: string): Promise<string[]> => this.client.json.get(country, {path: `timeFormats`});

	public setTimeFormats = async (country: string, timeFormats: string[]): Promise<boolean> => this.client.json.set(country, `$.timeFormats`, timeFormats).then(this.successful);

	public getCurrency = async (country: string): Promise<Currency> => this.client.json.get(country, {path: `currency`});

	public setCurrency = async (country: string, currency: Currency): Promise<boolean> => this.client.json.set(country, `$.currency`, currency).then(this.successful);

	public getDecimalSeparator = async (country: string): Promise<string> => this.client.json.get(country, {path: `decimalSeparator`});

	public setDecimalSeparator = async (country: string, separator: string): Promise<boolean> => this.client.json.set(country, `$.decimalSeparator`, separator).then(this.successful);

	public getLineDirection = async (country: string): Promise<Direction> => this.client.json.get(country, {path: `lineDirection`}).then((p: Partial<string>) => Direction[p as keyof typeof Direction]);

	public setLineDirection = async (country: string, direction: Direction): Promise<boolean> => this.client.json.set(country, `$.lineDirection`, direction.toString()).then(this.successful);

	public getNextLine = async (country: string): Promise<Direction> => this.client.json.get(country, {path: `nextLine`}).then((p: Partial<string>) => Direction[p as keyof typeof Direction]);

	public setNextLine = async (country: string, direction: Direction): Promise<boolean> => this.client.json.set(country, `$.nextLine`, direction.toString()).then(this.successful);

	public async connect(): Promise<string> {
		this.client = createClient({
			url: process.env.org_enc_sp_locales_redis_url,
			username: process.env.org_enc_sp_locales_redis_username,
			password: process.env.org_enc_sp_locales_redis_password,
			name: process.env.org_enc_sp_locales_redis_db_name
		});
		return this.client.connect().then(() => null).catch(error => error.message);
	}

	public disconnect = async (): Promise<any> => this.client.quit();

}