define([
    'service/Localization',
    'model/Quiz'

], function (LocalizationService, QuizModel) {
    return {

        electroporator: {
            getQuiz1: function() {
                //TODO: i18n
                /*"quiz.electroporator1.name": "Lalala ",
                "quiz.electroporator1.question": "LAla",
                "quiz.electroporator1.answer1.answer": "LAla",
                "quiz.electroporator1.answer1.message": "LAla",
                "quiz.electroporator1.answer2.answer": "LAla",
                "quiz.electroporator1.answer2.message": "LAla",
                "quiz.electroporator1.answer3.answer": "LAla",
                "quiz.electroporator1.answer3.message": "LAla",*/

                var quizValues = {
                    "id": 1,
                        "name": "",
                        "question": "Det ønskede protein blev desværre ikke udtrykt. Hvad gik der galt?",
                        "correct": 1,
                        "answers": [
                        {
                            "id": 0,
                            "answer": "DNA'et kunne ikke komme ind i cellerne",
                            "message": "Nej. Elektroshocket får det negativt ladede DNA til at bevæge sig ind i cellerne."
                        },
                        {
                            "id": 1,
                            "answer": "Der var ingen promoter",
                            "message": "Det er korrekt! Der kræves en promoter for at RNA-polymerasen kan aflæse genet, og transkriptere DNA'et til mRNA. Hvis du vil udtrykke et gen, skal du gå tilbage til computeren og designe et nyt gen, der indeholder en promoter."
                        },
                        {
                            "id": 2,
                            "answer": "Cellerne kan ikke tåle at få elektroshock i elektroporatoen",
                            "message": "Cellerne kan godt tåle at få et mindre elektroshock. Elektroshocket får det negativt ladede DNA til at bevæge sig ind i cellerne"
                        }
                    ]
                };
                return new QuizModel(quizValues);
            },

            getQuiz2: function() {
                //TODO: i18n
                var quizValues = {
                    "id": 2,
                    "name": "",
                    "question": "Det ønskede protein blev desværre ikke udtryk. Hvad gik der galt?",
                    "correct": 0,
                    "answers": [
                        {
                            "id": 0,
                            "answer": "Transkriptionen kunne ikke afsluttes, da der ikke var nogen terminator, eller da terminatoren var placeret før promoteren",
                            "message": "Det er korrekt! Det er nødvendigt med en terminator for at afslutte transskriptionen af DNA til mRNA. Hvis du vil udtrykke et gen, skal du gå tilbage til computeren og designe et nyt gen der indeholder en terminator. Det er vigtigt at placere terminatoren til sidst; efter denne sekvens stopper transskriptionen af DNA til mRNA."
                        },
                        {
                            "id": 1,
                            "answer": "Transkriptionen kunne ikke afsluttes, da der ikke var noget stop-codon",
                            "message": "Det er forkert. Stop-codon afslutter translationen af mRNA til protein – problemet her er, at transkriptionen af DNA til mRNA ikke afsluttes."
                        },
                        {
                            "id": 2,
                            "answer": "Transkriptionen af DNA til mRNA kunne ikke starte, da der ikke var nogen terminator.",
                            "message": "2. Det er forkert. Transkriptionen fra DNA til mRNA startede, da der var en promoter i genet."
                        }
                    ]
                };
                return new QuizModel(quizValues);
            }
        }
    };
});

