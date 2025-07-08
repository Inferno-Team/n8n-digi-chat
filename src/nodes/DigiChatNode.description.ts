import { INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export const digiChatNodeDescription: INodeTypeDescription = {
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
    inputs: [NodeConnectionType.Main], // Use NodeConnectionType
    outputs: [NodeConnectionType.Main], // Use NodeConnectionType
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
            description: 'The WhatsApp phone number including country code without +',
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
        {
            displayName: 'Additional Options',
            name: 'additionalOptions',
            type: 'collection',
            placeholder: 'Add Option',
            default: {},
            options: [
                {
                    displayName: 'Priority',
                    name: 'priority',
                    type: 'options',
                    options: [
                        {
                            name: 'High',
                            value: 'high',
                        },
                        {
                            name: 'Normal',
                            value: 'normal',
                        },
                    ],
                    default: 'normal',
                },
            ],
        },
    ],
};