/**
 * @fileoverview
 * User administration and management
 * @module shared/crudtable/Table
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { darken, lighten, useTheme } from '@mui/material';
import MRT_Localization from '../../hooks/MRT_Localization.jsx';

export const Table = ({
    name, columns, data, isError, renderRowActions, renderTopToolbarCustomActions, renderBottomToolbarCustomActions, renderDetailPanel,
    muiTableHeadCellProps, muiTableBodyCellProps,
    enableRowSelection, enableColumnOrdering, enablePinning, enableRowActions, enableColumnActions, enableColumnFilters,
    enableDensityToggle, enablePagination, enableSorting, enableFullScreenToggle, enableHiding, muiPaginationProps,
    displayColumnDefOptions, positionActionsColumn, enableExpandAll, positionExpandColumn, muiTablePaperProps,
    muiTableBodyProps, paginationDisplayMode, enableColumnDragging, enableFilters, initialColumnVisibility
}) => {

    const { textMRT } = MRT_Localization(); // Table language

    const [isFirstRender, setIsFirstRender] = useState(true);

    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
    const [density, setDensity] = useState('comfortable');
    const [columnOrder, setColumnOrder] = useState([]);
    const [columnPinning, setColumnPinning] = useState({});
    const [globalFilter, setGlobalFilter] = useState(undefined);
    const [showGlobalFilter, setShowGlobalFilter] = useState(false);
    const [showColumnFilters, setShowColumnFilters] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const loadStateFromLocalStorage = useCallback(() => {
        try {
            const columnFilters = localStorage.getItem('mrt_columnFilters_table_'+name);
            const columnVisibility = localStorage.getItem('mrt_columnVisibility_table_'+name);
            const density = localStorage.getItem('mrt_density_table_'+name);
            const columnOrder = localStorage.getItem('mrt_columnOrder_table_'+name);
            const columnPinning = localStorage.getItem('mrt_columnPinning_table_'+name);
            const globalFilter = localStorage.getItem('mrt_globalFilter_table_'+name);
            const showGlobalFilter = localStorage.getItem('mrt_showGlobalFilter_table_'+name);
            const showColumnFilters = localStorage.getItem('mrt_showColumnFilters_table_'+name);
            const sorting = localStorage.getItem('mrt_sorting_table_'+name);
            const pagination = localStorage.getItem('mrt_pagination_table_'+name);

            if (columnFilters) setColumnFilters(JSON.parse(columnFilters));
            if (columnVisibility) setColumnVisibility(JSON.parse(columnVisibility));
            if (density) setDensity(JSON.parse(density));
            if (columnOrder) setColumnOrder(JSON.parse(columnOrder));
            if (columnPinning) setColumnPinning(JSON.parse(columnPinning));
            if (globalFilter) setGlobalFilter(JSON.parse(globalFilter) || undefined);
            if (showGlobalFilter) setShowGlobalFilter(JSON.parse(showGlobalFilter));
            if (showColumnFilters) setShowColumnFilters(JSON.parse(showColumnFilters));
            if (sorting) setSorting(JSON.parse(sorting));
            if (pagination) setPagination(JSON.parse(pagination));
        } catch (error) {
            if (!localStorage){
                console.error('Error loading state from localStorage', error);
            }
        }
        setIsFirstRender(false);
    }, []);

    const saveStateToLocalStorage = useCallback((key, value) => {
        if (isFirstRender) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage`, error);
        }
    }, [isFirstRender]);

    useEffect(() => {
        loadStateFromLocalStorage();
    }, [loadStateFromLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_columnFilters_table_'+name, columnFilters);
    }, [columnFilters, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_columnVisibility_table_'+name, columnVisibility);
    }, [columnVisibility, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_density_table_'+name, density);
    }, [density, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_columnOrder_table_'+name, columnOrder);
    }, [columnOrder, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_columnPinning_table_'+name, columnPinning);
    }, [columnPinning, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_globalFilter_table_'+name, globalFilter ?? '');
    }, [globalFilter, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_showGlobalFilter_table_'+name, showGlobalFilter);
    }, [showGlobalFilter, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_showColumnFilters_table_'+name, showColumnFilters);
    }, [showColumnFilters, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_sorting_table_'+name, sorting);
    }, [sorting, saveStateToLocalStorage]);

    useEffect(() => {
        saveStateToLocalStorage('mrt_pagination_table_'+name, pagination);
    }, [pagination, saveStateToLocalStorage]);

    const theme = useTheme();

    const baseBackgroundColor = theme.palette.mode === 'dark'
        ? 'rgba(29, 33, 39, 1)'
        : 'rgba(236, 237, 240, 1)';

    const baseBackgroundColor2 = theme.palette.mode === 'dark'
        ? 'rgba(29, 33, 39, 1)'
        : 'rgba(235, 235, 180, 0.1)';

    // default
    const defaultMuiTableHeadCellProps = {
        sx: (theme) => ({
            background: 'rgba(52, 210, 235, 0.1)',
            borderRight: '1px solid rgba(224,224,224,1)',
            color: theme.palette.text.primary,
        }),
    };

    const defaultMuiTableBodyCellProps = {
        sx: {
            borderRight: '1px solid rgba(224,224,224,0.5)',
        },
    };

    const defaultDisplayColumnDefOptions = {
        'mrt-row-actions': {
            size: 100, // make actions column wider
        },
    };

    const defaultMuiTablePaperProps = {
        elevation: 0,
        sx: {
            borderRadius: '0',
        },
    };

    const defaultMuiTableBodyProps = {
        sx: (theme) => ({
            '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td': {
                backgroundColor: darken(baseBackgroundColor2, 0.1),
            },
            '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td': {
                backgroundColor: darken(baseBackgroundColor2, 0.2),
            },
            '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td': {
                backgroundColor: lighten(baseBackgroundColor, 0.1),
            },
            '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td': {
                backgroundColor: darken(baseBackgroundColor, 0.2),
            },
        }),
    };

    const table = useMaterialReactTable({
        columns,
        data,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onDensityChange: setDensity,
        onColumnOrderChange: setColumnOrder,
        onColumnPinningChange: setColumnPinning,
        onGlobalFilterChange: setGlobalFilter,
        onShowColumnFiltersChange: setShowColumnFilters,
        onShowGlobalFilterChange: setShowGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        localization: textMRT,
        enableRowSelection: enableRowSelection || false,
        enableColumnOrdering: enableColumnOrdering || false,
        enableColumnDragging: enableColumnDragging || false,
        enablePinning: enablePinning || false,
        enableRowActions: enableRowActions || false,
        enableColumnActions: enableColumnActions || false,
        enableColumnFilters: enableColumnFilters || false,
        enableDensityToggle: enableDensityToggle || false,
        enablePagination: enablePagination || false,
        enableSorting: enableSorting || false,
        enableFullScreenToggle: enableFullScreenToggle || false,
        enableHiding: enableHiding || false,
        enableFilters: enableFilters || false,
        enableExpandAll: enableExpandAll || false,
        muiPaginationProps: muiPaginationProps || null,
        state: {
            showAlertBanner: isError,
            columnFilters,
            columnVisibility,
            density,
            columnOrder,
            columnPinning,
            globalFilter,
            showColumnFilters,
            showGlobalFilter,
            sorting,
            pagination,
        },
        paginationDisplayMode: paginationDisplayMode || 'default',
        displayColumnDefOptions: displayColumnDefOptions || defaultDisplayColumnDefOptions,
        positionActionsColumn: positionActionsColumn || "last",
        renderRowActions: renderRowActions,
        renderTopToolbarCustomActions: renderTopToolbarCustomActions,
        renderBottomToolbarCustomActions: renderBottomToolbarCustomActions,
        renderDetailPanel: renderDetailPanel,
        positionExpandColumn: positionExpandColumn || "last",
        muiTableHeadCellProps: muiTableHeadCellProps || defaultMuiTableHeadCellProps,
        muiTableBodyCellProps: muiTableBodyCellProps || defaultMuiTableBodyCellProps,
        muiTablePaperProps: muiTablePaperProps || defaultMuiTablePaperProps,
        muiTableBodyProps: muiTableBodyProps || defaultMuiTableBodyProps,
        mrtTheme: (theme) => ({
            baseBackgroundColor: baseBackgroundColor,
            draggingBorderColor: theme.palette.secondary.main,
        }),
    });

    return <MaterialReactTable table={table} />;
};
