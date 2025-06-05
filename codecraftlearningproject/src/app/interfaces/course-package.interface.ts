export interface CoursePackageTechnology {
    name: string[];
    iconUrl: string[];
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
    technologies?: CoursePackageTechnology[];
    allTechItems: string[];
}