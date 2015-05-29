import  _ = require('lodash');

import QuizModel = require('model/Quiz');

import quizData = require('json!datadir/quiz.json');

class Quiz {

    static getQuiz(id: number) {
        var rawQuiz = _.find(quizData.quizzes, quiz => quiz.id === id);

        return new QuizModel(rawQuiz);
    }
}

export = Quiz;
