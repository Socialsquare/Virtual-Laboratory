import ko = require('knockout');

import ConsequenceType = require('model/type/Consequence');

import ConsequenceModel = require('model/Consequence');
import QuizModel = require('model/Quiz');

class QuizConsequence extends ConsequenceModel {

    public quiz: QuizModel;

    constructor(quiz) {
        super(ConsequenceType.QUIZ);

        this.quiz = new QuizModel(quiz);

        ko.rebind(this);
    }
}

export = QuizConsequence;
