export interface WorkActivityType {
    id: number;
    name: string;
    description?: string;
    category?: string;
    riskLevel?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkActivityDto {
    name: string;
    description?: string;
    category?: string;
    riskLevel?: string;
}

export interface UpdateWorkActivityDto {
    name?: string;
    description?: string;
    category?: string;
    riskLevel?: string;
}

export interface WorkActivityActionType {
    isEdit: boolean;
    isView: boolean;
    isCreate: boolean;
}

export interface WorkActivityFilterType {
    page: number;
    limit: number;
    name?: string;
    category?: string;
    riskLevel?: string;
}
