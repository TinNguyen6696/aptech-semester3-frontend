
export interface Province {
    id: number;
    name: string;
}

export interface RegisterOptions {
    talentCategories?: string[];
    skillLevels?: string[];
    roles?: string[];
}

export interface RegisterFormProps {
    provinces: Province[];
    options: RegisterOptions;
}
