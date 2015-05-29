declare module 'json!datadir/localization.json' {
    var data: any;
    export = data;
}

declare module 'json!datadir/dna.json' {
    var data: [{
        icon: string,
        type: string,
        comment: string,
        link: string,
        description: string,
        sequence: string,
        color: string,
        name: string,
        id: string,
        proteinCodingSequence: string
    }];
    export = data;
}

declare module 'json!datadir/drugs.json' {
    var data: {
        scaffolds: [{
            name: string,
            id: string,
            offset: { x: number, y: number },
            slots: [{
                index: number,
                position: { x: number, y: number },
                optimalLength: number,
                bindingType: string
            }]
        }],
        sidegroups: [{
            id: number,
            info: {
                pKa: number,
                weight: string,
                bindingLength: number,
                bindingTypes: string[]
            }
        }]
    };
    export = data;
}

declare module 'json!datadir/experiments.json' {
    var text: string;
    export = text;
}

declare module 'json!datadir/heartRate.json' {
    var data: { xVals: number[] };
    export = data;
}

declare module 'json!datadir/help.json' {
    var data: [{
        title: string,
        body: string,
        image: string,
        route: string,
    }];
    export = data;
}

declare module 'json!datadir/quiz.json' {
    var data: {
        quizzes: [{
            id: number,
            name: { [language: string]: string; },
            question: { [language: string]: string; },
            correct: number,
            answers: [{
                id: number,
                answer: { [language: string]: string; },
                message: { [language: string]: string; }
            }]
        }]
    };
    export = data;
}

declare module 'json!datadir/tutorial.json' {
    var text: string;
    export = text;
}

declare module 'json!datadir/videos.json' {
    var data: { [id: string]: string; };
    export = data;
}
