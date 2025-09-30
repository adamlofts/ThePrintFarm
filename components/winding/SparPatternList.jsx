import React, {useEffect, useState} from 'react'
import {radToDeg} from "three/src/math/MathUtils";
import {ALGO_ROTATIONAL_HELICAL_PATTERN} from "./Algo";
import {getCoreRowModel, useReactTable, createColumnHelper, flexRender, getSortedRowModel} from "@tanstack/react-table";
import styles from './SparPatternList.module.css';

function BendHeader() {
    return (<thead>
    <tr>
        <td>Cycles</td>
        <td colSpan="2">Coverage</td>
        <td>Layers</td>
        <td>Length</td>
        {/*<td>Crossovers</td>*/}
        {/*<td>Displacement</td>
                    <td>Voids</td>
                    <td>Balance</td>*/}
    </tr>
    </thead>);
}

function RotationalHelicalHeader() {
    return (<thead>
    <tr>
        <td colSpan="2">Pattern</td>
        <td colSpan="2">Coverage</td>
        <td colSpan="2">Thickness</td>
        <td>Length</td>
    </tr>
    </thead>);
}

function RowDetail({detail}) {
    const zero = 100 - (detail.nonzeroArea / detail.totalArea) * 100;
    const cover = (detail.coverArea / detail.totalArea) * 100;
    const layerCount = detail.layers.length - 1;  // don't count layer 0
    return (<React.Fragment>
        <td>{zero.toFixed(1)}</td>
        <td>{cover.toFixed(1)}</td>
        <td>{layerCount}</td>
        <td>{detail.length.toFixed(0)}</td>
        {/*<td>{detail.crossovers}</td>*/}
    </React.Fragment>)
}

function Row(pattern, detail) {
    // const angles = pattern.params.map((p) => radToDeg(p.theta)).join();
    const windCount = pattern.params.length;
    const hasDetail = !!detail;
    return (
    <>
        <td>{windCount}</td>
        {hasDetail && <RowDetail detail={detail}/>}
    </>)
}

function zip(a, b) {
    const ret = [];
    for (let i = 0; i < a.length; i++) {
        ret.push({
            pattern: a[i],
            detail: b[i]
        })
    }
    return ret;
}

const columnHelper = createColumnHelper();

const columnsRotationalHelical = [
    columnHelper.accessor((r) => r.params[0].pattern, {
        id: 'pattern',
        cell: info => info.getValue(),
        header: '#',
        sortingFn: 'basic',
    }),
    columnHelper.accessor((r) => r.params[0].patternSkip, {
        id: 'skip',
        cell: info => info.getValue(),
        header: 'skip',
        sortingFn: 'basic',
    }),
    columnHelper.accessor((r) => r.uncovered * 100, {
        id: 'uncovered',
        cell: info => info.getValue().toFixed(1),
        header: '% uncovered',
        sortingFn: 'basic',
    }),
    columnHelper.accessor((r) => r.layerUniformity, {
        id: 'layerUniformity',
        cell: info => info.getValue().toFixed(2),
        header: 'Uniformity',
        sortingFn: 'basic',
    }),
    columnHelper.accessor('minLayer', {
        cell: info => info.getValue(),
        header: 'min',
        sortingFn: 'basic',
    }),
    columnHelper.accessor('maxLayer', {
        cell: info => info.getValue(),
        header: 'max',
        sortingFn: 'basic',
    }),
    columnHelper.accessor((r) => r.length, {
        id: 'length',
        cell: info => info.getValue().toFixed(0),
        header: 'mm',
        sortingFn: 'basic',
    }),
]

const columnsBend = [
    columnHelper.accessor((r) => r.params.length, {
        id: 'cycles',
        cell: info => info.getValue(),
        header: '#',
        sortingFn: 'basic',
    }),
    columnHelper.accessor((r) => r.uncovered * 100, {
        id: 'uncovered',
        cell: info => info.getValue().toFixed(1),
        header: '% uncovered',
        sortingFn: 'basic',
    }),
    columnHelper.accessor('minLayer', {
        cell: info => info.getValue(),
        header: 'min',
        sortingFn: 'basic',
    }),
    columnHelper.accessor('maxLayer', {
        cell: info => info.getValue(),
        header: 'max',
        sortingFn: 'basic',
    }),
    columnHelper.accessor((r) => r.length, {
        id: 'length',
        cell: info => info.getValue().toFixed(0),
        header: 'mm',
        sortingFn: 'basic',
    }),
]

export function SparPatternList({algo, patternResponse, onClickPattern, focusedPattern}) {
    const [data, setData] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState([{
        desc: false,
        id: 'uncovered',
    }]);


    const patterns = patternResponse.patterns;

    // const pairs = zip(patterns, allPatternDetail);

    let header = BendHeader();
    let columns = columnsBend;
    if (algo === ALGO_ROTATIONAL_HELICAL_PATTERN) {
        columns = columnsRotationalHelical;
        header = RotationalHelicalHeader();
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), //provide a sorting row model
        onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
        state: {
            rowSelection, //pass the row selection state back to the table instance
            sorting,
        },
        enableMultiRowSelection: false, //only allow a single row to be selected at once
        onSortingChange: setSorting,
    });

    useEffect(() => {
        setData(patternResponse.patterns);
    //     if (patternResponse.patterns) {
    //         const bestIndex = patternResponse.patterns.reduce((minIndex, current, index, array) => {
    //             return current.uncovered < patternResponse.patterns[minIndex].uncovered ? index : minIndex;
    //         }, 0);
    //         setRowSelection({
    //             [bestIndex]: true,
    //         });
    //         setFocusedPattern(patternResponse.patterns[bestIndex]);
    //     }
    }, [patternResponse]);

    useEffect(() => {
        let index = -1;
        if (focusedPattern && data) {
            index = patternResponse.patterns.findIndex((it) => it.params[0].pattern === focusedPattern.params[0].pattern &&
                it.params[0].patternSkip === focusedPattern.params[0].patternSkip);
        }
        if (index === -1) {
            setRowSelection({});
        } else {
            setRowSelection({
                [index]: true,
            });
        }
    //     if (patternResponse.patterns) {
    //         const bestIndex = patternResponse.patterns.reduce((minIndex, current, index, array) => {
    //             return current.uncovered < patternResponse.patterns[minIndex].uncovered ? index : minIndex;
    //         }, 0);
    //         setRowSelection({
    //             [bestIndex]: true,
    //         });
    //         setFocusedPattern(patternResponse.patterns[bestIndex]);
    //     }
    }, [focusedPattern, data]);



    return (
        <React.Fragment>
            <div className={styles.scroll}>
            <table className={`table table-bordered table-hover ${styles.table}`}>
                {header}

                <thead>
                {table.getHeaderGroups().map(headerGroup => {
                    return (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => ( // map over the headerGroup headers array
                                <th key={header.id} colSpan={header.colSpan}
                                    onClick={header.column.getToggleSortingHandler()}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    )
                })}
                </thead>

                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr
                        key={row.id}
                        className={row.getIsSelected() ? styles.trHighlight : null}
                        onClick={() => {
                            onClickPattern(patternResponse.patterns[row.index]);
                        }}
                    >
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </React.Fragment>
    );
}

