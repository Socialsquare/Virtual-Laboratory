import QuizService = require('service/Quiz');

class QuizHelper {

    static electroporator = {
        getQuiz1: () => QuizService.getQuiz(1),
        getQuiz2: () => QuizService.getQuiz(2),
        getQuiz3: () => QuizService.getQuiz(3),
        getQuiz4: () => QuizService.getQuiz(4),
        getQuiz5: () => QuizService.getQuiz(5),
        getQuiz6: () => QuizService.getQuiz(6)
    };

    static drugStepsBeforeCure = {
        getPsoriasisBodyInjection: (drug) => {
            var returnObj = {
                reachedTarget: false,
                videos: ['mousemap-pso-blood-inj-body']
            };

            if (!drug.drugInfo.passes.canPassBlood) {
                returnObj.videos.push('drug-blood-failure');

                return returnObj;
            }

            returnObj.videos.push('drug-blood-success');
            returnObj.videos.push('mousemap-pso-liver');
            // This is due to the fact that no sidegroup gets modified
            returnObj.videos.push('drug-liver-unchanged');
            returnObj.videos.push('mousemap-pso-blood-liver');
            returnObj.videos.push('mousemap-pso-skin');

            returnObj.reachedTarget = drug.canBindToTarget();

            if (returnObj.reachedTarget) {
                returnObj.videos.push('drug-target-success');
            } else {
                returnObj.videos.push('drug-target-failure');
            }

            return returnObj;
        },

        getPsoriasisPill: (drug) => {
            var returnObj = {reachedTarget: false, videos: []};
            returnObj.videos = ['mousemap-pso-pill-intestine'];

            if (!drug.drugInfo.passes.canPassBlood) {
                returnObj.videos.push('drug-barrier-failure');

                return returnObj;
            }

            returnObj.videos.push('drug-barrier-success');
            returnObj.videos.push('mousemap-pso-liver');
            returnObj.videos.push('drug-liver-unchanged'); // This is due to the fact that no sidegroup gets modified
            returnObj.videos.push('mousemap-pso-blood-liver');
            returnObj.videos.push('mousemap-pso-skin');

            returnObj.reachedTarget = drug.canBindToTarget();

            if (returnObj.reachedTarget) {
                returnObj.videos.push('drug-target-success');
            }else {
                returnObj.videos.push('drug-target-failure');
            }

            return returnObj;
        },

        getPsoriasisCream: (drug) => {
            var returnObj = {
                reachedTarget: false,
                videos: []
            };

            if (!drug.drugInfo.passes.canPassSkin) {
                returnObj.videos.push('drug-barrier-failure');

                return returnObj;
            }

            returnObj.videos.push('drug-barrier-success');

            returnObj.reachedTarget = drug.canBindToTarget();

            if (returnObj.reachedTarget) {
                returnObj.videos.push('drug-target-success');
            }else {
                returnObj.videos.push('drug-target-failure');
            }

            return returnObj;
        }
    };
}

export = QuizHelper;
