/**
 * @fileoverview
 * Load the table language from the backend
 * material-react-table
 * @module hooks/MRT_Localization
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires react-i18next
 */

import { useTranslation } from 'react-i18next';

/**
 * React component for Material React Table (MRT) localization.
 *
 * @returns {Object} An object containing localized text for MRT actions and messages.
 */
const MRT_Localization = () => {
    //Change Language
    const [t] = useTranslation("materialreacttable");
    //Change Language

    const textMRT = {
        actions: t('actions'),
        and: t('and'),
        cancel: t('cancel'),
        changeFilterMode: t('changeFilterMode'),
        changeSearchMode: t('changeSearchMode'),
        clearFilter: t('clearFilter'),
        clearSearch: t('clearSearch'),
        clearSort: t('clearSort'),
        clickToCopy: t('clickToCopy'),
        collapse: t('collapse'),
        collapseAll: t('collapseAll'),
        columnActions: t('columnActions'),
        copiedToClipboard: t('copiedToClipboard'),
        dropToGroupBy: t('dropToGroupBy'),
        edit: t('edit'),
        expand: t('expand'),
        expandAll: t('expandAll'),
        filterArrIncludes: t('filterArrIncludes'),
        filterArrIncludesAll: t('filterArrIncludesAll'),
        filterArrIncludesSome: t('filterArrIncludesSome'),
        filterBetween: t('filterBetween'),
        filterBetweenInclusive: t('filterBetweenInclusive'),
        filterByColumn: t('filterByColumn'),
        filterContains: t('filterContains'),
        filterEmpty: t('filterEmpty'),
        filterEndsWith: t('filterEndsWith'),
        filterEquals: t('filterEquals'),
        filterEqualsString: t('filterEqualsString'),
        filterFuzzy: t('filterFuzzy'),
        filterGreaterThan: t('filterGreaterThan'),
        filterGreaterThanOrEqualTo: t('filterGreaterThanOrEqualTo'),
        filterInNumberRange: t('filterInNumberRange'),
        filterIncludesString: t('filterIncludesString'),
        filterIncludesStringSensitive: t('filterIncludesStringSensitive'),
        filterLessThan: t('filterLessThan'),
        filterLessThanOrEqualTo: t('filterLessThanOrEqualTo'),
        filterMode: t('filterMode'),
        filterNotEmpty: t('filterNotEmpty'),
        filterNotEquals: t('filterNotEquals'),
        filterStartsWith: t('filterStartsWith'),
        filterWeakEquals: t('filterWeakEquals'),
        filteringByColumn: t('filteringByColumn'),
        goToFirstPage: t('goToFirstPage'),
        goToLastPage: t('goToLastPage'),
        goToNextPage: t('goToNextPage'),
        goToPreviousPage: t('goToPreviousPage'),
        grab: t('grab'),
        groupByColumn: t('groupByColumn'),
        groupedBy: t('groupedBy'),
        hideAll: t('hideAll'),
        hideColumn: t('hideColumn'),
        max: t('max'),
        min: t('min'),
        move: t('move'),
        noRecordsToDisplay: t('noRecordsToDisplay'),
        noResultsFound: t('noResultsFound'),
        of: t('of'),
        or: t('or'),
        pinToLeft: t('pinToLeft'),
        pinToRight: t('pinToRight'),
        resetColumnSize: t('resetColumnSize'),
        resetOrder: t('resetOrder'),
        rowActions: t('rowActions'),
        rowNumber: t('rowNumber'),
        rowNumbers: t('rowNumbers'),
        rowsPerPage: t('rowsPerPage'),
        save: t('save'),
        search: t('search'),
        select: t('select'),
        selectedCountOfRowCountRowsSelected: t('selectedCountOfRowCountRowsSelected'),
        showAll: t('showAll'),
        showAllColumns: t('showAllColumns'),
        showHideColumns: t('showHideColumns'),
        showHideFilters: t('showHideFilters'),
        showHideSearch: t('showHideSearch'),
        sortByColumnAsc: t('sortByColumnAsc'),
        sortByColumnDesc: t('sortByColumnDesc'),
        sortedByColumnAsc: t('sortedByColumnAsc'),
        sortedByColumnDesc: t('sortedByColumnDesc'),
        thenBy: t('thenBy'),
        toggleDensity: t('toggleDensity'),
        toggleFullScreen: t('toggleFullScreen'),
        toggleSelectAll: t('toggleSelectAll'),
        toggleSelectRow: t('toggleSelectRow'),
        toggleVisibility: t('toggleVisibility'),
        ungroupByColumn: t('ungroupByColumn'),
        unpin: t('unpin'),
        unpinAll: t('unpinAll'),
        unsorted: t('unsorted'),
    };

    return {textMRT};
};

export default MRT_Localization;