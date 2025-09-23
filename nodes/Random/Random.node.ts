import {
    IExecuteFunctions,
    //IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

/* import {
    OptionsWithUri,
} from 'request'; */

export class Random implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Random',
        name: 'random',
        icon: 'file:random.svg',
        group: ['transform'],
        version: 1,
        description: 'Generates a random number within a given range',
        defaults: {
            name: 'Random',
        },
        inputs: ['main'],
        outputs: ['main'],
        // Basic node details will go here
        properties: [
            {
                displayName: 'Valor mínimo',
                name: 'min',
                type: 'number',
                required: true,
                typeOptions: {
                    maxValue: 10,
                    minValue: 0,
                    numberPrecision: 1,
                },
                default: 10.00,
                description: 'Your current amount',
                displayOptions: { // the resources and operations to display this element with
                    show: {
                        resource: [
                            // comma-separated list of resource names
                        ],
                        operation: [
                            // comma-separated list of operation names
                        ]
                    }
                },
            },
            {
                displayName: 'Valor máximo',
                name: 'max',
                type: 'number',
                required: true,
                typeOptions: {
                    maxValue: 10,
                    minValue: 0,
                    numberPrecision: 1,
                },
                default: 10.00,
                description: 'Your current amount',
                displayOptions: { // the resources and operations to display this element with
                    show: {
                        resource: [
                            // comma-separated list of resource names
                        ],
                        operation: [
                            // comma-separated list of operation names
                        ]
                    }
                },
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'True Random Number Generator',
                        value: 'trueRandom',
                        description: 'Gera um número inteiro aleatório usando random.org',
                    },
                ],
                default: 'trueRandom',
            },
            // Resources and operations will go here
        ],
    };

    // The execute method will go here
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // Se não houver itens, ainda assim executa uma vez (com índice 0)
        const iterations = items.length === 0 ? 1 : items.length;

        for (let i = 0; i < iterations; i++) {
            const operation = this.getNodeParameter('operation', i) as string;
            if (operation === 'trueRandom') {
                const min = this.getNodeParameter('min', i) as number;
                const max = this.getNodeParameter('max', i) as number;

                if (!Number.isInteger(min) || !Number.isInteger(max)) {
                    throw new Error('Min e Max devem ser inteiros.');
                }
                if (max < min) {
                    throw new Error('Max deve ser maior ou igual a Min.');
                }

                const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

                // this.helpers.request está disponível no runtime do n8n
                const responseBody = (await (this.helpers as any).request({
                    method: 'GET',
                    uri: url,
                    resolveWithFullResponse: false,
                    simple: false,
                })) as string;

                const value = parseInt(responseBody.trim(), 10);

                returnData.push({
                    json: {
                        value,
                        min,
                        max,
                        source: 'random.org',
                        timestamp: new Date().toISOString(),
                    },
                });
            } else {
                throw new Error(`Operação desconhecida: ${operation}`);
            }
        }

        return [returnData];
    }
}