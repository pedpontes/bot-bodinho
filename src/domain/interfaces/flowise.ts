export type FlowModel = {
  id: string;
  name: string;
  flowData: string;
  deployed: boolean;
  isPublic: boolean;
  apikeyid: string;
  chatbotConfig: string;
  apiConfig: string;
  analytic: string;
  speechToText: string;
  category: string;
  type: 'CHATFLOW' | 'API';
  createdDate: string;
  updatedDate: string;
};
