import _ from 'lodash';

function compare(a, b) {
    if (a[0] === b[0] && a[1] === b[1]) {
        return 0;
    } else {
        let newDenominator = a[1] * b[1];
        let newNumeratorA = a[0] * b[1];
        let newNumeratorB = b[0] * a[1];

        if (newNumeratorA === newNumeratorB) {
            return 0;
        } else if (newNumeratorA < newNumeratorB) {
            return -1;
        } else {
            return 1;
        }
    }
}

export default class Division {
    constructor(numerator, denominator) {
        this[0] = numerator;
        this[1] = denominator;
    }

    eq(division) {
        return compare(this, division) === 0;
    }

    gt(division) {
        return compare(this, division) === 1;
    }

    gte(division) {
        return compare(this, division) >= 0;
    }

    lt(division) {
        return compare(this, division) === -1;
    }

    lte(division) {
        return compare(this, division) <= 0;
    }
}
