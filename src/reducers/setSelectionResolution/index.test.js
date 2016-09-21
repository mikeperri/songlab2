import setSelectionResolution from './index.js';
import { expect } from 'chai';

describe('setSelectionResolution', () => {
    describe('going down', () => {
        it('should also change selectedDivision when it starts at [1,4]', () => {
            let state = {
                selectedDivision: [1, 4],
                selectionResolution: 2
            };
            let action = { resolution: 1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision).to.deep.equal([0, 2]);
        });
        it('should also change selectedDivision when it starts at [3,4]', () => {
            let state = {
                selectedDivision: [3, 4],
                selectionResolution: 2
            };
            let action = { resolution: 1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision).to.deep.equal([1, 2]);
        });
        it('should also change selectedDivision when it starts at [1,2]', () => {
            let state = {
                selectedDivision: [1, 2],
                selectionResolution: 1
            };
            let action = { resolution: 0 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision).to.deep.equal([0, 1]);
        });
        it('should also change selectedDivision when it starts at [0,2]', () => {
            let state = {
                selectedDivision: [0, 2],
                selectionResolution: 1
            };
            let action = { resolution: 0 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision).to.deep.equal([0, 1]);
        });
    });
    describe('going up', () => {
        it('should also change selectedDivision when it starts at [0,1]', () => {
            let state = {
                selectedDivision: [0, 1],
                selectionResolution: 0
            };
            let action = { resolution: 1 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision).to.deep.equal([0, 2]);
        });
        it('should also change selectedDivision when it starts at [1,2]', () => {
            let state = {
                selectedDivision: [1, 2],
                selectionResolution: 1
            };
            let action = { resolution: 2 };

            let nextState = setSelectionResolution(state, action);

            expect(nextState.selectedDivision).to.deep.equal([2, 4]);
        });
    });
});
