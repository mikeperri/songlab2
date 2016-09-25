import Division from './index.js';
import { expect } from 'chai';

describe('Division', () => {
    describe('eq', () => {
        it('should be true for equivalent divisions', () => {
            expect(new Division(0, 1).eq(new Division(0, 2))).to.be.true;
            expect(new Division(1, 2).eq(new Division(2, 4))).to.be.true;
        });

        it('should be false for non-equivalent divisions', () => {
            expect(new Division(0, 1).eq(new Division(1, 2))).to.be.false;
            expect(new Division(1, 2).eq(new Division(1, 4))).to.be.false;
        });
    });
    describe('gt', () => {
        it('should be false for equivalent divisions', () => {
            expect(new Division(0, 1).gt(new Division(0, 2))).to.be.false;
            expect(new Division(1, 2).gt(new Division(2, 4))).to.be.false;
        });

        it('should be true where appropriate', () => {
            expect(new Division(0, 1).gt(new Division(1, 2))).to.be.false;
            expect(new Division(1, 2).gt(new Division(1, 4))).to.be.true;
        });
    });
    describe('gte', () => {
        it('should be true for equivalent divisions', () => {
            expect(new Division(0, 1).gte(new Division(0, 2))).to.be.true;
            expect(new Division(1, 2).gte(new Division(2, 4))).to.be.true;
        });

        it('should be true where appropriate', () => {
            expect(new Division(0, 1).gte(new Division(1, 2))).to.be.false;
            expect(new Division(1, 2).gte(new Division(1, 4))).to.be.true;
        });
    });
    describe('lt', () => {
        it('should be false for equivalent divisions', () => {
            expect(new Division(0, 1).lt(new Division(0, 2))).to.be.false;
            expect(new Division(1, 2).lt(new Division(2, 4))).to.be.false;
        });

        it('should be true where appropriate', () => {
            expect(new Division(0, 1).lt(new Division(1, 2))).to.be.true;
            expect(new Division(1, 2).lt(new Division(1, 4))).to.be.false;
        });
    });
    describe('lte', () => {
        it('should be true for equivalent divisions', () => {
            expect(new Division(0, 1).lte(new Division(0, 2))).to.be.true;
            expect(new Division(1, 2).lte(new Division(2, 4))).to.be.true;
        });

        it('should be true where appropriate', () => {
            expect(new Division(0, 1).lte(new Division(1, 2))).to.be.true;
            expect(new Division(1, 2).lte(new Division(1, 4))).to.be.false;
        });
    });
});
