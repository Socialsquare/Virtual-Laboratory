define([
    'service/Localization',
    'model/Quiz'

], function (LocalizationService, QuizModel) {
    return {

        electroporator: {
            getQuiz1: function() {

                var quizValues = {
                    "id": 1,
                        "name": {"dk": ""},
                        "question": {"dk": "Det ønskede protein blev desværre ikke udtrykt. Hvad gik der galt?"},
                        "correct": 1,
                        "answers": [
                        {
                            "id": 0,
                            "answer": {"dk": "DNA'et kunne ikke komme ind i cellerne"},
                            "message": {"dk": "Nej. Elektroshocket får det negativt ladede DNA til at bevæge sig ind i cellerne."}
                        },
                        {
                            "id": 1,
                            "answer": {"dk": "Der var ingen promoter"},
                            "message": {"dk": "Det er korrekt! Der kræves en promoter for at RNA-polymerasen kan aflæse genet, og transkriptere DNA'et til mRNA. Hvis du vil udtrykke et gen, skal du gå tilbage til computeren og designe et nyt gen, der indeholder en promoter."}
                        },
                        {
                            "id": 2,
                            "answer": {"dk": "Cellerne kan ikke tåle at få elektroshock i elektroporatoen"},
                            "message": {"dk": "Cellerne kan godt tåle at få et mindre elektroshock. Elektroshocket får det negativt ladede DNA til at bevæge sig ind i cellerne"}
                        }
                    ]
                };
                return new QuizModel(quizValues);
            },

            getQuiz2: function() {
                var quizValues = {
                    "id": 2,
                    "name": {"dk": ""},
                    "question": {"dk": "Det ønskede protein blev desværre ikke udtryk. Hvad gik der galt?"},
                    "correct": 0,
                    "answers": [
                        {
                            "id": 0,
                            "answer": {"dk": "Transkriptionen kunne ikke afsluttes, da der ikke var nogen terminator, eller da terminatoren var placeret før promoteren"},
                            "message": {"dk": "Det er korrekt! Det er nødvendigt med en terminator for at afslutte transskriptionen af DNA til mRNA. Hvis du vil udtrykke et gen, skal du gå tilbage til computeren og designe et nyt gen der indeholder en terminator. Det er vigtigt at placere terminatoren til sidst; efter denne sekvens stopper transskriptionen af DNA til mRNA."}
                        },
                        {
                            "id": 1,
                            "answer": {"dk": "Transkriptionen kunne ikke afsluttes, da der ikke var noget stop-codon"},
                            "message": {"dk": "Det er forkert. Stop-codon afslutter translationen af mRNA til protein – problemet her er, at transkriptionen af DNA til mRNA ikke afsluttes." }
                        },
                        {
                            "id": 2,
                            "answer": {"dk": "Transkriptionen af DNA til mRNA kunne ikke starte, da der ikke var nogen terminator."},
                            "message": {"dk": "Det er forkert. Transkriptionen fra DNA til mRNA startede, da der var en promoter i genet."}
                        }
                    ]
                };
                return new QuizModel(quizValues);
            },

            getQuiz3: function() {
                var quizValues = {
                    "id": 3,
                    "name": {"dk": ""},
                    "question": {"dk": "Det ønskede protein blev desværre ikke udtryk. Hvad gik der galt?"},
                    "correct": 2,
                    "answers": [
                        {
                            "id": 0,
                            "answer":  {"dk": "Der var intet ribosom bindingssted, eller det var placeret forkert, og transskriptionen kunne derfor ikke gå i gang"},
                            "message": {"dk": "Det er forkert. Transskriptionen af DNA til mRNA bliver ikke påvirket af om der er et ribosom bindingssted eller ej. Det er et ribosom der sørger for translationen fra mRNA til protein. Et ribosom bindingssted (RBS) gør det nemmere for ribosomet at binde til mRNA'et"}
                        },
                        {
                            "id": 1,
                            "answer": {"dk": "Der var ingen promoter"},
                            "message": {"dk": "Det er forkert. Der er indsat en promoter – unden den ville transskriptionen af DNA til mRNA ikke være gået i gang."}
                        },
                        {
                            "id": 2,
                            "answer":  {"dk": "Der var intet ribosom bindingssted, eller det var placeret forkert, og translationen kunne derfor ikke gå i gang"},
                            "message": {"dk": "Det er korrekt! Det er et ribosom der sørger for translationen fra mRNA til protein. Et ribosom bindingssted (RBS) gør det nemmere for ribosomet at binde til mRNA'et. Hvis du vil udtrykke et gen, skal du gå tilbage til computeren og designe et nyt gen, der indeholder et rigtigt placeret RBS."}
                        }
                    ]
                };
                return new QuizModel(quizValues);
            },

            getQuiz4: function() {
                var quizValues = {
                    "id": 4,
                    "name": {"dk": ""},
                    "question": {"dk": "Det ønskede protein blev desværre ikke udtryk. Hvad gik der galt?"},
                    "correct": 1,
                    "answers": [
                        {
                            "id": 0,
                            "answer": {"dk": "Der var intet startcodon i mRNA'et og transskriptionen af DNA til mRNA kunne derfor ikke startes"},
                            "message": {"dk": "Det er forkert. Et startcodon er nødvendigt for at starte translationen af mRNA til protein."}
                        },
                        {
                            "id": 1,
                            "answer": {"dk": "Der var intet startcodon i mRNA'et og translationen af mRNA til protein kunne derfor ikke startes"},
                            "message": {"dk": "Det er rigtigt! Et startcodon er nødvendigt for at starte translationen af mRNA til protein. Når DNA'et er transskriberet til mRNA er det disse tre nukleotider på mRNA-strengen som det første tRNA-molekyle genkender. Hvis du vil udtrykke et gen, skal du gå tilbage til computeren og designe et nyt gen der indeholdet et startcodon."}
                        },
                        {
                            "id": 2,
                            "answer": {"dk": "Der var intet startcodon i mRNA'et og translationen af mRNA til protein kunne derfor ikke stoppes"},
                            "message": {"dk": "Det er forkert. Et startcodon er nødvendigt for at starte translationen af mRNA til protein, ikke for at stoppe translationen."}
                        }
                    ]
                };
                return new QuizModel(quizValues);
            },

            getQuiz5: function() {
                var quizValues = {
                    "id": 5,
                    "name": {"dk": ""},
                    "question": {"dk": "Det ønskede protein blev desværre ikke udtryk. Hvad gik der galt?"},
                    "correct": 0,
                    "answers": [
                        {
                            "id": 0,
                            "answer": {"dk": "Der er ikke indsat en proteinkodende sekvens umiddelbart efter startcodon, og der laves derfor ikke et funktionelt protein"},
                            "message": {"dk": "Det er korrekt. Hvis du vil fremstille et protein, skal du gå tilbage til computeren og designe et nyt gen der indeholder en proteinkodende sekvens umiddelbart efter startcodon"}
                        },
                        {
                            "id": 1,
                            "answer": {"dk": "Der er ikke indsat en proteinkodende sekvens umiddelbart efter startcodon, og der laves derfor ikke mRNA"},
                            "message": {"dk": "Det er forkert. Der kan godt laves mRNA uden en proteinkodende sekvens. Dette bruges bl.a. af cellerne til at lave transfer RNA (tRNA) og ribosomal RNA (rRNA)"}
                        },
                        {
                            "id": 2,
                            "answer": {"dk": "Der er ikke indsaten proteinkodende sekvens umiddelbart efter startcodon, og translationen kan derfor ikke stoppe"},
                            "message": {"dk": "Det er forkert. Hvis der er et startcodon kan translationen godt starte."}
                        }
                    ]
                };
                return new QuizModel(quizValues);
            },

            getQuiz6: function() {
                var quizValues = {
                    "id": 6,
                    "name": {"dk": ""},
                    "question": {"dk": "Det ønskede protein blev desværre ikke udtryk. Hvad gik der galt?"},
                    "correct": 2,
                    "answers": [
                        {
                            "id": 0,
                            "answer": {"dk": "Der var et stopcodon umiddelbart efter den proteinkodende sekvens, og translationen af mRNA til protein startede derfor ikke"},
                            "message": {"dk": "Det er forkert. Et stopcodon er nødvendigt for at stoppe translationen af mRNA til protein, men forhindrer ikke at translationen startes"}
                        },
                        {
                            "id": 1,
                            "answer": {"dk": "Der var intet stopcodon umiddelbart efter den proteinkodende sekvens, og transskriptionen af DNA til mRNA stoppede derfor ikke"},
                            "message": {"dk": "Det er forkert. Det er en terminator der stopper transskriptionen af DNA til mRNA"}
                        },
                        {
                            "id": 2,
                            "answer": {"dk": "Der var intet stopcodon umiddelbart efter den proteinkodende sekvens, og translationen af mRNA til protein stoppede derfor ikke"},
                            "message": {"dk": "Det er korrekt! Et stopcodon er nødvendigt fro at stoppe translationen af mRNA til protein. Når DNA'et er transskriberet til mRNA er det disse tre nukleotider på mRNA-strengen som det sidste tRNA molekyle genkender, og derved afsluttes translationen af mRNA til protein. Hvis du vil udtrykke et gen, skal du gå tilbage til computeren og designe et gen der indeholder et stopcodon efter den proteinkodende sekvens."}
                        }
                    ]
                };
                return new QuizModel(quizValues);
            }
        },

        drugStepsBeforeCure: {
            getPsoriasisBodyInjection: function(drug) {
                var returnObj = {reachedTarget: false, videos: []};
                returnObj.videos = ['mousemap-pso-blood-inj-body'];

                if(!drug.drugInfo.passes.canPassBlood) {
                    returnObj.videos.push('drug-blood-failure');

                    return returnObj;

                }

                returnObj.videos.push('drug-blood-success');
                returnObj.videos.push('mousemap-pso-liver');
                returnObj.videos.push('drug-liver-unchanged'); // This is due to the fact that no sidegroup gets modified
                returnObj.videos.push('mousemap-pso-blood-liver');
                returnObj.videos.push('mousemap-pso-skin');

                returnObj.reachedTarget = true;

                return returnObj;
            },
            getPsoriasisPill: function(drug) {
                var returnObj = {reachedTarget: false, videos: []};
                returnObj.videos = ['mousemap-pso-pill-intestine'];

                if(!drug.drugInfo.passes.canPassBlood) {
                    returnObj.videos.push('drug-barrier-failure');

                    return returnObj;

                }

                returnObj.videos.push('drug-barrier-success');
                returnObj.videos.push('mousemap-pso-liver');
                returnObj.videos.push('drug-liver-unchanged'); // This is due to the fact that no sidegroup gets modified
                returnObj.videos.push('mousemap-pso-blood-liver');
                returnObj.videos.push('mousemap-pso-skin');

                returnObj.reachedTarget = true;

                return returnObj;
            },
            getPsoriasisCream: function(drug) {
                var returnObj = {reachedTarget: false, videos: []};

                if(!drug.drugInfo.passes.canPassSkin) {
                    returnObj.videos.push('drug-barrier-failure');

                    return returnObj;

                }

                returnObj.videos.push('drug-barrier-success');

                returnObj.reachedTarget = true;

                return returnObj;
            }
        }
    };
});