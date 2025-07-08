import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeConnectionType,
    NodeOperationError
} from 'n8n-workflow';
import { createHmac } from 'crypto';

export class DigiChatNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'DigiChat',
        name: 'digiChatNode',
        icon: 'file:icons/digichat.svg',
        group: ['transform'],
        version: 1,
        description: 'Send WhatsApp messages via DigiChat API',
        defaults: {
            name: 'DigiChat',
            color: '#053B38',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'digiChatApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Phone Number',
                name: 'phone',
                type: 'string',
                required: true,
                default: '',
                description: 'The WhatsApp phone number including country code',
                placeholder: '15551234567',
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                required: true,
                default: '',
                description: 'The message to send',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const credentials = await this.getCredentials('digiChatApi');
        const token = credentials.token as string;
        const secret = credentials.secret as string;

        for (let i = 0; i < items.length; i++) {
            try {
                const phone = this.getNodeParameter('phone', i) as string;
                const message = this.getNodeParameter('message', i) as string;

                // Prepare request body
                const requestBody = {
                    message,
                    phone,
                };
                const body = JSON.stringify(requestBody);
                const timestamp = Date.now();

                // Generate signature
                const dataToSign = `${timestamp}${token}${body}`;
                const signature = createHmac('sha256', secret)
                    .update(dataToSign)
                    .digest('hex');
                // Prepare headers

                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-Signature': signature,
                    'X-API-Timestamp': timestamp.toString()
                };

                // Make the actual HTTP request
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `https://whatsapp.digiworld-dev.com/api/whatsapp/${token}/sendMessage`,
                    body: requestBody,
                    headers,
                    json: true
                });
                // Return the API response
                returnData.push({
                    json: {
                        ...response,  // Spread the entire API response
                        requestBody,  // Include original payload for reference
                        timestamp
                    },
                    pairedItem: { item: i }
                });

            } catch (error) {
                if (this.continueOnFail()) {
                    if (error instanceof Error) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: { item: i },
                        });
                    }
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}