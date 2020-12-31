import { ListQuestion } from "./listQuestion.model";

export class UserAnswer{
    id:string;
    email:string;
    theme:string;
    level:number;
    listquestion:ListQuestion[];
    summary:number;
    total:number;
    date:Date;
}