export class Answer {
    constructor(id, questionId, userName, content) {
        this.id = id;
        this.questionId = questionId;
        this.userName = userName;
        this.content = content;
    }

    static fromDisplayableAnswer(displayableAnswer) {
        return new Answer(
            displayableAnswer.id,
            displayableAnswer.questionId,
            displayableAnswer.userName,
            displayableAnswer.content
        );
    }

    static toDisplayableAnswer(answer) {
        return {
            id: answer.id,
            questionId: answer.questionId,
            userName: answer.userName,
            content: answer.content
        };
    }
}