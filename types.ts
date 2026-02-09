
export interface DiseaseInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  therapyStatus: 'Clinical' | 'Experimental' | 'Established';
  impact: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum StemCellType {
  EMBRYONIC = 'Embryonic',
  ADULT = 'Adult/Somatic',
  IPS = 'Induced Pluripotent',
  MESENCHYMAL = 'Mesenchymal'
}
