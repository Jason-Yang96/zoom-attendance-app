import React, { useState } from 'react'
import { useTable, useGlobalFilter, useSortBy } from 'react-table'
import './App.css'
import Search from './Component/Search'

function DataFetcher() {
    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false)

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
                            color:
                                value === 1 ? '#578C45' : value === 5 ? '#5C5C5C' : 'inherit',
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
    } = useTable({ columns, data }, useGlobalFilter, useSortBy)

    const apiUrl = 'http://processlogic.link/example'

    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl, { mode: 'cors' })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const jsonData = await response.json()
            // console.log("api데이터", jsonData);

            if (Array.isArray(jsonData.data)) {
                setData(jsonData.data)
                setLoaded(true)
            } else {
                console.error('Expected an array but got:', jsonData.data)
            }
        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    return (
        <div className="container">
            <button onClick={fetchData} className="button-22 take_data_button">
                데이터 받기
            </button>
            {loaded && ( // 데이터가 로드되었을 때만 표시
                <>
                    <Search onSubmit={setGlobalFilter} />
                    <table {...getTableProps()} className="table">
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="tr">
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="th"
                                    >
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()} className="tr">
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()} className="td">
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

export default DataFetcher
