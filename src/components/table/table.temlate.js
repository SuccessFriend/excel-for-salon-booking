import {toInlineStyles} from '@core/utils';
import {defaultStyles} from '@/constants';
import {parse} from '@core/parse';

const CODES = {
    A: 65,
    Z: 90,
};

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;

function getWidth(state, index) {
    return (state[index] || DEFAULT_WIDTH) + 'px';
}

function getHeight(state, index) {
    return (state[index] || DEFAULT_HEIGHT) + 'px';
}

function toCell(state, row) {
    return function (_, col) {
        const id = `${row}:${col}`;
        const width = getWidth(state.colState, col);
        const data = state.dataState[id];
        const styles = toInlineStyles({
                ...defaultStyles,
                ...state.stylesState[id]
            }
        );
        return `
        <div 
            class="cell" 
            contenteditable="true" 
            data-col="${col}" 
            data-type="cell" 
            data-id="${id}"
            data-value="${data || ''}"
            style="${styles}; width: ${width}"
        >${parse(data) || ''}</div>
        `;
    };
}

function toColumn({col, index, width}) {
    return `
    <div class="column unselectable" data-type="resizable" data-col="${index}" style="width: ${width}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `;
}

function createRow(index, content, state) {
    const resizer = index ? `<div class="row-resize" data-resize="row"></div>` : '';
    const height = getHeight(state, index);
    return `
            <div 
                class="row" 
                data-type="resizable" 
                data-row="${index}"
                style="height: ${height}"
            >
            <div class="row-info unselectable">
              ${index ? index : ''}
              ${resizer}
             </div>
            <div class="row-data">${content}</div>
        </div>
  `;
}

function toChar(_, idx) {
    const length = CODES.Z - CODES.A + 1;
    idx++;
    let str = '';

    while (idx > length) {
        const remainder = idx % length;
        if (remainder) {
            str = String.fromCharCode(CODES.A + remainder - 1) + str;
            idx = (idx - remainder) / length;
        } else {
            str = String.fromCharCode(CODES.A + length - 1) + str;
            idx = idx / length - 1;
        }
    }

    return String.fromCharCode(CODES.A + idx - 1) + str;
}

function withWidthFrom(state) {
    return function (col, index) {
        return {
            col, index, width: getWidth(state.colState, index)
        };
    };
}

export function createTable(rowsCount = 20, state = {}) {
    const rows = [];
    const headRow = new Array(100)
        .fill('')
        .map(toChar)
        .map(withWidthFrom(state))
        .map(toColumn)
        .join('');
    rows.push(createRow(null, headRow, {}));

    for (let row = 0; row < rowsCount; row++) {
        const dataRow = new Array(100)
            .fill('')
            .map(toCell(state, row))
            .join('');

        rows.push(createRow((row + 1).toString(), dataRow, state.rowState));
    }

    return rows.join('');
}
