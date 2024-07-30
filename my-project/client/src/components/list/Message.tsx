export interface Message {
    id: number;
    title: string;
    text: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
}
