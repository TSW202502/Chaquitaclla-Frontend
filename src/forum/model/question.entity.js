export class Question{
    constructor(id, userName, ask, category, date){
        this.id = id;
        this.userName = userName;
        this.ask = ask;
        this.category = category;
        this.date = date;
    }
    static fromDisplayableQuestion(displayableQuestion) {
        return new Question(
            displayableQuestion.id,
            displayableQuestion.userName,
            displayableQuestion.ask,
            displayableQuestion.category,
            displayableQuestion.date
        );
    }
    static toDisplayableQuestion(question) {
        return {
            id: question.id,
            userName: question.userName,
            ask: question.ask,
            category: question.category,
            date: question.date
        };
    }
}