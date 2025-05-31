import { Icon, ICredentialType, INodeProperties } from "n8n-workflow"

export const GLOBAL_VARIABLES_CREDENTIALS_NAME = "globalVariablesApi"

const BOOL_COUNT = 5
const NUMBER_COUNT = 5
const JSON_COUNT = 5
const SECRET_COUNT = 10
const STRING_COUNT = 25

const booleanFields = Array.from({ length: BOOL_COUNT }, (_, i) => {
	const index = i + 1
	return [
		{
			displayName: `Boolean ${index} Name`,
			name: `boolean${index}Name`,
			type: "string" as const,
			default: "",
			placeholder: "varName",
		},
		{
			displayName: `Boolean ${index} Value`,
			name: `boolean${index}Value`,
			type: "boolean" as const,
			default: false,
		},
	]
}).flat()

const numberFields = Array.from({ length: NUMBER_COUNT }, (_, i) => {
	const index = i + 1
	return [
		{
			displayName: `Number ${index} Name`,
			name: `number${index}Name`,
			type: "string" as const,
			default: "",
			placeholder: "varName",
		},
		{
			displayName: `Number ${index} Value`,
			name: `number${index}Value`,
			type: "number" as const,
			default: "0",
		},
	]
}).flat()

const jsonFields = Array.from({ length: JSON_COUNT }, (_, i) => {
	const index = i + 1
	return [
		{
			displayName: `JSON ${index} Name`,
			name: `json${index}Name`,
			type: "string" as const,
			default: "",
			placeholder: "varName",
		},
		{
			displayName: `JSON ${index} Value`,
			name: `json${index}Value`,
			type: "json" as const,
			default: "{ }",
		},
	]
}).flat()

const stringFields = Array.from({ length: STRING_COUNT }, (_, i) => {
	const index = i + 1
	return [
		{
			displayName: `Text ${index} Name`,
			name: `string${index}Name`,
			type: "string" as const,
			default: "",
			placeholder: "varName",
		},
		{
			displayName: `Text ${index} Value`,
			name: `string${index}Value`,
			type: "string" as const,
			default: "",
			placeholder: "Enter value",
		},
	]
}).flat()

const secretFields = Array.from({ length: SECRET_COUNT }, (_, i) => {
	const index = i + 1
	return [
		{
			displayName: `Secret ${index} Name`,
			name: `secret${index}Name`,
			type: "string" as const,
			default: "",
			placeholder: "varName",
		},
		{
			displayName: `Secret ${index} Value`,
			name: `secret${index}Value`,
			type: "string" as const,
			default: "",
			placeholder: "Enter secret",
			typeOptions: { password: true },
		},
	]
}).flat()

// eslint-disable-next-line n8n-nodes-base/cred-class-name-unsuffixed
export class GlobalVariablesCredentials implements ICredentialType {
	name = GLOBAL_VARIABLES_CREDENTIALS_NAME
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
	displayName = "Global Variables"
	description = "Global variables"
	icon: Icon = "fa:file-code"

	properties: INodeProperties[] = [
		{
			type: "notice",
			displayName: `Boolean Variables`,
			name: `booleanVariablesNotice`,
			default: "",
		},
		...booleanFields,

		{
			type: "notice",
			displayName: `Number Variables`,
			name: `numberVariablesNotice`,
			default: "",
		},
		...numberFields,

		{
			type: "notice",
			displayName: `JSON Variables`,
			name: `jsonVariablesNotice`,
			default: "",
		},
		...jsonFields,

		{
			type: "notice",
			displayName: `Secret Variables`,
			name: `secretVariablesNotice`,
			default: "",
		},
		...secretFields,

		{
			type: "notice",
			displayName: `Text Variables`,
			name: `textVariablesNotice`,
			default: "",
		},
		...stringFields,
	]
}

export interface GlobalVariablesCredentialsData {
	[key: `var${number}Name` | `var${number}Value`]: string
}
