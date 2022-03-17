import {DS} from "../DS.js";
import {Currency, Direction, RegionalSettings, RsParameters} from "../../model/Model.js";
import {RegionalSettingsModel as rs} from "./Schemas.js";
import pkg from "mongoose";

const { connect, disconnect } = pkg;


export class MongoDs implements DS {

	private ok = (ok: number) => ok > 0;

	private static readonly getValue = async <T>(country: string, projection: any): Promise<T> => rs.findOne({country: country}, projection);

	private static readonly setValue = async (country: string, data: any): Promise<number> => rs.updateOne({country: country}, data, {runValidators: true}).then(r => r.matchedCount);

	public exists = async (country: string): Promise<boolean> => rs.exists({country: country}).then(result => result !== null);

	public read = async (country: string): Promise<RegionalSettings> => MongoDs.getValue(country, {_id: 0, __v: 0, 'currency._id': 0});

	public create = async (parameters: RsParameters): Promise<string> => rs.create(new RegionalSettings(parameters)).toString();

	public remove = async (country: string): Promise<number> => rs.deleteOne({country: country}).exec().then(r => r.deletedCount);

	public getLanguages = async (country: string): Promise<string[]> => MongoDs.getValue(country, {languages: 1, _id: 0}).then(result => result[`_doc`].languages);

	public setLanguages = async (country: string, languages: string[]): Promise<boolean> => MongoDs.setValue(country, {languages: languages}).then(this.ok);

	public getCharset = async (country: string): Promise<string> => MongoDs.getValue(country, {charset: 1, _id: 0}).then(result => result[`_doc`].charset);

	public setCharset = async (country: string, charset: string): Promise<boolean> => MongoDs.setValue(country, {charset: charset}).then(this.ok);

	public getDateFormats = async (country: string): Promise<string[]> => MongoDs.getValue(country, {dateFormats: 1, _id: 0}).then(result => result[`_doc`].dateFormats);

	public setDateFormats = async (country: string, dateFormats: string[]): Promise<boolean> => MongoDs.setValue(country, {dateFormats: dateFormats}).then(this.ok);

	public getTimeFormats = async (country: string): Promise<string[]> => MongoDs.getValue(country, {timeFormats: 1, _id: 0}).then(result => result[`_doc`].timeFormats);

	public setTimeFormats = async (country: string, timeFormats: string[]): Promise<boolean> => MongoDs.setValue(country, {timeFormats: timeFormats}).then(this.ok);

	public getCurrency = async (country: string): Promise<Currency> => MongoDs.getValue(country, {currency: 1, _id: 0}).then(result => result[`_doc`].currency);

	public setCurrency = async (country: string, currency: Currency): Promise<boolean> => MongoDs.setValue(country, {currency: currency}).then(this.ok);

	public getDecimalSeparator = async (country: string): Promise<string> => MongoDs.getValue(country, {decimalSeparator: 1, _id: 0}).then(result => result[`_doc`].decimalSeparator);

	public setDecimalSeparator = async (country: string, separator: string): Promise<boolean> => MongoDs.setValue(country, {decimalSeparator: separator}).then(this.ok);

	public getLineDirection = async (country: string): Promise<Direction> => MongoDs.getValue(country, {lineDirection: 1, _id: 0}).then(result => Direction[result[`_doc`].lineDirection as keyof typeof Direction]);

	public setLineDirection = async (country: string, direction: Direction): Promise<boolean> => MongoDs.setValue(country, {lineDirection: direction}).then(this.ok);

	public getNextLine = async (country: string): Promise<Direction> => MongoDs.getValue(country, {nextLine: 1, _id: 0}).then(result => Direction[result[`_doc`].nextLine as keyof typeof Direction]);

	public setNextLine = async (country: string, direction: Direction): Promise<boolean> => MongoDs.setValue(country, {nextLine: direction}).then(this.ok);

	public connect = async (): Promise<string> => connect(process.env.org_enc_sp_regional_settings_mongo).then(() => null).catch(error => error.message);

	public disconnect = async (): Promise<any> => disconnect();

}