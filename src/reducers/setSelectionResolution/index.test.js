import setSelectionResolution from './index.js';
import Division from '../../constructors/division';
import { expect } from 'chai';

describe('setSelectionResolution', () => {
    describe('going down', () => {
        it('should also change selectedDivision when it starts at [1,4]', () => {
            let state = {
                selectedDivision: new Division(1, 4),
                selectionResolution: 2,
                selectionTuplet: 1
            };
            let action = { resolution: 1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(0);
            expect(nextState.selectedDivision[1]).to.equal(2);
        });
        it('should also change selectedDivision when it starts at [3,4]', () => {
            let state = {
                selectedDivision: new Division(3, 4),
                selectionResolution: 2,
                selectionTuplet: 1
            };
            let action = { resolution: 1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(1);
            expect(nextState.selectedDivision[1]).to.equal(2);
        });
        it('should also change selectedDivision when it starts at [1,2]', () => {
            let state = {
                selectedDivision: new Division(1, 2),
                selectionResolution: 1,
                selectionTuplet: 1
            };
            let action = { resolution: 0 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(0);
            expect(nextState.selectedDivision[1]).to.equal(1);
        });
        it('should also change selectedDivision when it starts at [0,2]', () => {
            let state = {
                selectedDivision: new Division(0, 2),
                selectionResolution: 1,
                selectionTuplet: 1
            };
            let action = { resolution: 0 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(0);
            expect(nextState.selectedDivision[1]).to.equal(1);
        });
        it('should also change selectedDivision when it starts at [2,3]', () => {
            let state = {
                selectedDivision: new Division(2, 3),
                selectionResolution: 0,
                selectionTuplet: 3
            };
            let action = { resolution: -1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(0);
            expect(nextState.selectedDivision[1]).to.equal(1);
        });
    });
    describe('going up', () => {
        it('should also change selectedDivision when it starts at [0,1]', () => {
            let state = {
                selectedDivision: new Division(0, 1),
                selectionResolution: 0,
                selectionTuplet: 1
            };
            let action = { resolution: 1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(0);
            expect(nextState.selectedDivision[1]).to.equal(2);
        });
        it('should also change selectedDivision when it starts at [1,2]', () => {
            let state = {
                selectedDivision: new Division(1, 2),
                selectionResolution: 1,
                selectionTuplet: 1
            };
            let action = { resolution: 2 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(2);
            expect(nextState.selectedDivision[1]).to.equal(4);
        });
        it('should also change selectedDivision when it starts at [2,3]', () => {
            let state = {
                selectedDivision: new Division(2, 3),
                selectionResolution: 0,
                selectionTuplet: 3
            };
            let action = { resolution: 1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision[0]).to.equal(4);
            expect(nextState.selectedDivision[1]).to.equal(6);
        });
    });
});
