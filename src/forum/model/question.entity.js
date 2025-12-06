export class Question{
    constructor(id, userName,category, ask,  date){
        this.id = id;
        this.authorId = userName;
        this.categoryId = category;
        this.questionText = ask;
        this.date = date;
    }
    static fromDisplayableQuestion(displayableQuestion) {
        return new Question(
            displayableQuestion.id,
            displayableQuestion.authorId,
            displayableQuestion.categoryId,
            displayableQuestion.ask,
            displayableQuestion.date
        );
    }
    static toDisplayableQuestion(question) {
        return {
            id: question.questionId,
            authorId: question.authorId,
            categoryId: question.categoryId,
            ask: question.questionText,
            date: question.date,
            category: question.category,
            userName: question.userName
        };
    }
}