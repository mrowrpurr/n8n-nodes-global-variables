import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeOperationError } from "n8n-workflow"
import { GLOBAL_VARIABLES_CREDENTIALS_NAME, GlobalVariablesCredentialsData } from "../../credentials/GlobalVariablesCredentials.credentials"

export class GlobalVariables implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Global Variables",
		name: "globalVariables",
		icon: "fa:file-code",
		group: ["transform", "output"],
		version: 1,
		description: "Access global variables from credentials",
		subtitle: '={{$parameter["putAllInOneKey"] ? "$" + $parameter["variablesKeyName"] : ""}}',
		defaults: {
			name: "Global Variables",
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: GLOBAL_VARIABLES_CREDENTIALS_NAME,
				required: true,
			},
		],
		properties: [
			{
				displayName: "Put All Variables in One Key",
				name: "putAllInOneKey",
				type: "boolean",
				default: true,
				description: "Whether to put all variables in one key or use separate keys for each variable",
			},
			{
				displayName: "Variables Key Name",
				name: "variablesKeyName",
				type: "string",
				default: "vars",
				displayOptions: {
					show: {
						putAllInOneKey: [true],
					},
				},
			},
		],
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		this.helpers.httpRequest

		const credentials = (await this.getCredentials(GLOBAL_VARIABLES_CREDENTIALS_NAME)) as unknown as GlobalVariablesCredentialsData

		const variables: Record<string, any> = {}

		// Extract boolean variables
		for (let i = 1; i <= 2; i++) {
			const name = credentials[`boolean${i}Name` as keyof GlobalVariablesCredentialsData] as string
			const value = credentials[`boolean${i}Value` as keyof GlobalVariablesCredentialsData] as unknown as boolean

			if (name && name.trim()) {
				if (variables[name] !== undefined) {
					throw new NodeOperationError(this.getNode(), `Duplicate variable name detected: ${name}`)
				}
				variables[name] = value
			}
		}

		// Extract number variables
		for (let i = 1; i <= 2; i++) {
			const name = credentials[`number${i}Name` as keyof GlobalVariablesCredentialsData] as string
			const value = credentials[`number${i}Value` as keyof GlobalVariablesCredentialsData] as unknown as number

			if (name && name.trim()) {
				if (variables[name] !== undefined) {
					throw new NodeOperationError(this.getNode(), `Duplicate variable name detected: ${name}`)
				}
				variables[name] = value
			}
		}

		// Extract JSON variables
		for (let i = 1; i <= 2; i++) {
			const name = credentials[`json${i}Name` as keyof GlobalVariablesCredentialsData] as string
			const value = credentials[`json${i}Value` as keyof GlobalVariablesCredentialsData] as string

			if (name && name.trim()) {
				if (variables[name] !== undefined) {
					throw new NodeOperationError(this.getNode(), `Duplicate variable name detected: ${name}`)
				}
				try {
					variables[name] = JSON.parse(value || "{}")
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Invalid JSON in variable "${name}": ${error}`)
				}
			}
		}

		// Extract string variables
		for (let i = 1; i <= 20; i++) {
			const name = credentials[`string${i}Name` as keyof GlobalVariablesCredentialsData] as string
			const value = credentials[`string${i}Value` as keyof GlobalVariablesCredentialsData] as string

			if (name && name.trim()) {
				if (variables[name] !== undefined) {
					throw new NodeOperationError(this.getNode(), `Duplicate variable name detected: ${name}`)
				}
				variables[name] = value
			}
		}

		// Extract secret variables
		for (let i = 1; i <= 5; i++) {
			const name = credentials[`secret${i}Name` as keyof GlobalVariablesCredentialsData] as string
			const value = credentials[`secret${i}Value` as keyof GlobalVariablesCredentialsData] as string

			if (name && name.trim()) {
				if (variables[name] !== undefined) {
					throw new NodeOperationError(this.getNode(), `Duplicate variable name detected: ${name}`)
				}
				variables[name] = value
			}
		}

		const putAllInOneKey = this.getNodeParameter("putAllInOneKey", 0) as boolean

		let variablesData: Record<string, any> = {}

		if (putAllInOneKey) {
			const variablesKeyName = this.getNodeParameter("variablesKeyName", 0) as string
			variablesData = {
				[variablesKeyName]: variables,
			}
		} else {
			variablesData = variables
		}

		// For each input, add the variables data
		const returnData = this.getInputData()
		if (returnData.length === 0) {
			// Create a new item with the variables data
			returnData.push({ json: variablesData })
		} else {
			// Add the variables data to each item
			returnData.forEach((item) => {
				item.json = {
					...item.json,
					...variablesData,
				}
			})
		}

		return [returnData]
	}
}
