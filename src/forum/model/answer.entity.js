export class Answer {
    constructor(id, questionId, authorId, answerText) {
        this.id = id;
        this.questionId = questionId;
        this.authorId = authorId;
        this.answerText = answerText;
    }

    static fromDisplayableAnswer(displayableAnswer) {
        return new Answer(
            displayableAnswer.id,
            displayableAnswer.questionId,
            displayableAnswer.authorId,
            displayableAnswer.content
        );
    }

    static toDisplayableAnswer(answer) {
        return {
            id: answer.answerId,
            questionId: answer.questionId,
            userName: answer.authorId,
            content: answer.answerText
        };
    }
}