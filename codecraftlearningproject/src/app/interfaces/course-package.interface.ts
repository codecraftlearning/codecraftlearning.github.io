export interface CoursePackageTechnology {
    name: string | string[];
    iconUrl: string | string[];
    isPackage: boolean;
    combinationBy: '+' | '/' | '';
}

export interface CoursePackage {
    id?: string;
    index: number;
    title: string;
    description: string;
    regularPrice: number;
    discountPrice: number;
    durationInMonth: number;
    technologies: CoursePackageTechnology[]
}