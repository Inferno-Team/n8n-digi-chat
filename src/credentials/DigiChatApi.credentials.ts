import type {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class DigiChatApiCredentials implements ICredentialType {
    name = 'digiChatApi';
    displayName = 'digiChat API Credentials';
    documentationUrl = "http://whatsapp.digiworld-dev.com/whatsapp-api-docs";
    properties: INodeProperties[] = [
        {
            displayName: 'API Token',
            name: 'token',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'API Secret',
            name: 'secret',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
        },
    ];
}
export const DigiChatApi = DigiChatApiCredentials;
export const credClass = DigiChatApiCredentials;