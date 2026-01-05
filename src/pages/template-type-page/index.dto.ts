export interface TemplateType {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateTypeDto {
  name: string;
  description?: string;
}

export interface UpdateTemplateTypeDto {
  name?: string;
  description?: string;
}
