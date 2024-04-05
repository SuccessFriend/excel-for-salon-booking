import {CHANGE_TEXT, CHANGE_STYLES, TABLE_RESIZE, APPLY_STYLE, CHANGE_TITLE, UPDATE_DATE} from '@/redux/types';

const handlers = {
    [TABLE_RESIZE]: (state, action) => {
        const field = action.data.type === 'col' ? 'colState' : 'rowState';
        return {...state, [field]: value(state, field, action)};
    },
    [CHANGE_TEXT]: (state, action) => {
        const field = 'dataState';
        return {...state, currentText: action.data.value, [field]: value(state, field, action)};
    },
    [CHANGE_STYLES]: (state, action) => {
        return {...state, currentStyles: action.data};
    },
    [APPLY_STYLE]: (state, action) => {
        const val = state['stylesState'] || {};
        action.data.ids.forEach(id => {
            val[id] = {...val[id], ...action.data.value};
        });
        return {
            ...state,
            stylesState: val,
            currentStyles: {...state.currentStyles, ...action.data.value}};
    },
    [CHANGE_TITLE]: (state, action) => {
        return {...state, title: action.data};
    },
    [UPDATE_DATE]: (state) => {
        const openedDate = new Date().toJSON();
        return {...state, openedDate};
    },
    DEFAULT: state => state,
};

export const rootReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
};

function value(state, field, action) {
    const val = state[field] || {};
    val[action.data.id] = action.data.value;
    return val;
}
