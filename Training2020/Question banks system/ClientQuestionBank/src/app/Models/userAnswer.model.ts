import { ListQuestion } from "./listQuestion.model";

export class UserAnswer{
    id:string;
    email:string;
    theme:string;
    listquestion:ListQuestion[];
    summary:number;
    total:number;
    date:Date;
}