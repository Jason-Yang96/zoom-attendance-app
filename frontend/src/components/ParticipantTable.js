import React, { useState } from 'react'
import { useTable, useGlobalFilter, useSortBy } from 'react-table'
import "./ParticipantTable.css";
import Search from './Search'


export function ParticipantTable({ participant }) {
    const [size, setSize] = useState("")
    const [date, setDate] = useState("")
    const [ buttonValue, setButtonValue]  = useState("출석부 불러오기")
    const [fetchedData, setFetchedData] = useState([])
    const [clicked, setClicked] = useState(false)
    const [tableVisible, setTableVisible] = useState(false)
    // const [mode, setMode] = useState(false)

    const columns = React.useMemo(
        () => [
            {
                Header: '이름',
                accessor: 'name',
            },
            // CheckList 항목을 개별 셀로 분리
            ...Array.from({ length: 8 }).map((_, i) => ({
                Header: `${i + 1}교시`,
                accessor: (d) => d.checkList[i],
                id: `checkList-${i}`,
                // Cell에 조건부 스타일 적용
                Cell: ({ value }) => (
                    <div
                        className="cell-check-list"
                        style={{
                            backgroundColor:
                                value === 1
                                    ? 'rgb(0 222 0 / 90%)'
                                    : value === 2
                                        ? 'rgb(200 200 200 / 90%)'
                                        : value === 5
                                            ? 'rgb(125 125 125 / 90%)'
                                            : null,
                        }}
                    >
                        {value}
                    </div>
                ),
            })),
        ],
        [],
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
    } = useTable({ columns, data: fetchedData }, useGlobalFilter, useSortBy)


    const fetchData =  () => {
        try {
            const { data, date, size } =  participant
            setDate(date)
            setSize(size)
            setFetchedData(data)
        } catch (error) {
            console.error(error)
        }
    }

    const handlePrintBtn = () => {
        setButtonValue('출결상태 재출력')
        fetchData()
        setClicked(true)

        setTimeout(() => {
            setClicked(false)
            setTableVisible(true)
        }, 500)
    }


    const today = new Date()

    return (
        <div className="app_body">
            <div className="title">
                <div className="title_text">ZOOM 출결 관리</div>
            </div>

            <div className="main_body">
                <button
                    id={clicked ? 'btnAni' : null}
                    className="print_button"
                    onClick={handlePrintBtn}
                >
                    {buttonValue}
                </button>
                <div id={clicked ? 'dateAni' : null} className="date">
                    {`출석 기준일: ${date}`}
                    {/*{today.toLocaleString()}*/}
                </div>
                <Search onSubmit={setGlobalFilter} />

                <div
                    className={`${tableVisible ? 'tableVisible' : null} table_container`}
                >
                    <table {...getTableProps()}>
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                    >
                                        {column.render('Header')}
                                        <div className="swap_vert">^</div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                <div id={clicked ? 'dateAni' : null} className="date">
                    {`전체 출석 인원: ${size} `}
                </div>
                <div className="numExplanation">
                    <div className="numExp"> 1: 참석</div>
                    <div className="numExp"> 2: 지각</div>
                    <div className="numExp"> 5: 결석</div>
                </div>
            </div>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <footer>Made by Y-CPK</footer>
        </div>
    )
}
