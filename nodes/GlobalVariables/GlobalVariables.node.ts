import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeOperationError } from "n8n-workflow"
import { GLOBAL_VARIABLES_INFO, GlobalVariablesCredentialsData } from "../../credentials/GlobalVariablesCredentials.credentials"

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
				name: GLOBAL_VARIABLES_INFO.credentialsName,
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

		const credentials = (await this.getCredentials(GLOBAL_VARIABLES_INFO.credentialsName)) as unknown as GlobalVariablesCredentialsData

		const extractVariables = <T>(type: keyof typeof GLOBAL_VARIABLES_INFO.counts, parser: (value: string) => T): Record<string, T> => {
			const count = GLOBAL_VARIABLES_INFO.counts[type]
			const prefix = GLOBAL_VARIABLES_INFO.prefixes[type]
			const vars: Record<string, T> = {}

			for (let i = 1; i <= count; i++) {
				const nameKey = `${prefix}${i}Name` as keyof GlobalVariablesCredentialsData
				const valueKey = `${prefix}${i}Value` as keyof GlobalVariablesCredentialsData

				const name = credentials[nameKey]
				const raw = credentials[valueKey]

				if (name?.trim()) {
					if (vars[name] !== undefined) {
						throw new NodeOperationError(this.getNode(), `Duplicate variable name detected: ${name}`)
					}
					try {
						vars[name] = parser(raw)
					} catch (error) {
						throw new NodeOperationError(this.getNode(), `Invalid ${type} in variable "${name}": ${error}`)
					}
				}
			}

			return vars
		}

		const extracted = {
			...extractVariables("boolean", (v) => Boolean(v)),
			...extractVariables("number", (v) => Number(v)),
			...extractVariables("json", (v) => JSON.parse(v || "{}")),
			...extractVariables("string", (v) => v),
			...extractVariables("secret", (v) => v),
		}

		const putAllInOneKey = this.getNodeParameter("putAllInOneKey", 0) as boolean

		let variablesData: Record<string, any> = {}

		if (putAllInOneKey) {
			const variablesKeyName = this.getNodeParameter("variablesKeyName", 0) as string
			variablesData = {
				[variablesKeyName]: extracted,
			}
		} else {
			variablesData = extracted
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
