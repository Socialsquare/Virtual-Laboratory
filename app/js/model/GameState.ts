// Global singleton game state

import ko = require('knockout');

import Inventory = require('model/Inventory');
import MouseCageModel = require('model/MouseCage');
import PipetteModel = require('model/Pipette');
import Worktable1Model = require('model/Worktable1');
import Worktable2Model = require('model/Worktable2');
import Worktable3Model = require('model/Worktable3');
import FumehoodModel = require('model/Fumehood');
import IncubatorModel = require('model/Incubator');
import SpectroPMModel = require('model/SpectroPM');
import FermentorModel = require('model/Fermentor');
import UvRoomModel = require('model/UvRoom');
import WashingModel = require('model/Washing');

import DNAElementModel = require('model/DNAElement');

import ComputerScreenType = require('model/type/ComputerScreen');

class GameState {

    public activeComputerScreen: KnockoutObservable<ComputerScreenType>;
    public sequencedDNA: KnockoutObservableArray<DNAElementModel>;

    public inventory: Inventory;

    // Global items
    public pipette: PipetteModel;

    // Areas
    public worktable1: Worktable1Model;
    public worktable2: Worktable2Model;
    public worktable3: Worktable3Model;
    public mousecage: MouseCageModel;
    public fumehood: FumehoodModel;
    public incubator: IncubatorModel;
    public spectroPM: SpectroPMModel;
    public fermentor: FermentorModel;
    public uvroom: UvRoomModel;
    public washing: WashingModel;

    public askTutorial: KnockoutObservable<boolean>;
    public askBeforeNavigating: boolean;

    constructor() {
        this.activeComputerScreen = ko.observable(ComputerScreenType.MENU);
        this.sequencedDNA = ko.observableArray([]);

        this.inventory = new Inventory();

        this.pipette = new PipetteModel();

        this.askTutorial = ko.observable(window['BUILD'] === 'production');
        this.askBeforeNavigating = window['BUILD'] === 'production';

        this.worktable1 = new Worktable1Model();
        this.worktable2 = new Worktable2Model();
        this.worktable3 = new Worktable3Model();
        this.mousecage = new MouseCageModel();
        this.fumehood = new FumehoodModel();
        this.incubator = new IncubatorModel();
        this.spectroPM = new SpectroPMModel();
        this.fermentor = new FermentorModel();
        this.uvroom = new UvRoomModel();
        this.washing = new WashingModel();

        ko.rebind(this);
    }

    reset() {
        this.activeComputerScreen(ComputerScreenType.MENU);
        this.sequencedDNA.removeAll();

        this.inventory.reset();

        this.pipette.removeTip();
        this.worktable1.reset();
        this.worktable2.reset();
        this.worktable3.reset();
        this.mousecage.reset();
        this.fumehood.reset();
        this.incubator.reset();
        this.spectroPM.reset();
        this.fermentor.reset();
        this.uvroom.reset();
        this.washing.reset();
    }
}

// Note that we're returning an instance
export = new GameState();
