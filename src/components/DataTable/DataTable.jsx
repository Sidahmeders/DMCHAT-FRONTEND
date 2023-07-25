import { useState } from 'react'
import propTypes from 'prop-types'
import ReactDataTableComponent from 'react-data-table-component'
import { HashLoader } from 'react-spinners'
import { ChevronDown } from 'react-feather'

import Pagination from './Pagination/Pagination'

import './DataTable.scss'

const defaultStyles = {
  progress: {
    style: {
      transform: 'translateY(12rem)',
      zIndex: '9',
    },
  },
}

export default function DataTable({
  columns,
  data,
  loading,
  onRowDoubleClicked,
  expandableRowsComponent,
  paginationResetDefaultPage,
  subHeaderComponent,
  onChangePage,
  pageNumber,
  paginationTotalRows,
  onChangeRowsPerPage,
  paginationPerPage,
  paginationRowsPerPageOptions,
}) {
  const [currentRow, setCurrentRow] = useState(null)

  return (
    <div className="data-table-container">
      <ReactDataTableComponent
        striped
        highlightOnHover
        pointerOnHover
        expandableRows
        subHeader
        className="data-table"
        data={data}
        columns={columns}
        progressPending={loading}
        customStyles={defaultStyles}
        //** FIXME: remove pagination props **//
        // pagination
        // paginationServer={paginationServer}
        // paginationTotalRows={paginationTotalRows}
        // paginationPerPage={paginationPerPage}
        // paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        // onChangePage={onChangePage}
        // onChangeRowsPerPage={onChangeRowsPerPage}
        // paginationResetDefaultPage={paginationResetDefaultPage}
        sortIcon={<ChevronDown />}
        expandableRowExpanded={(row) => row === currentRow}
        onRowExpandToggled={(_, row) => setCurrentRow(row)}
        progressComponent={<HashLoader color="#474aff" />}
        subHeaderComponent={subHeaderComponent}
        expandableRowsComponent={expandableRowsComponent}
        onRowDoubleClicked={onRowDoubleClicked}
      />

      <Pagination
        pageNumber={pageNumber}
        paginationTotalRows={paginationTotalRows}
        paginationPerPage={paginationPerPage}
        onPageChange={onChangePage}
      />
    </div>
  )
}

DataTable.propTypes = {
  columns: propTypes.arrayOf(propTypes.any).isRequired,
  data: propTypes.arrayOf(propTypes.any),
  loading: propTypes.bool,
  paginationResetDefaultPage: propTypes.bool,
  onRowDoubleClicked: propTypes.func,
  expandableRowsComponent: propTypes.func,
  subHeaderComponent: propTypes.node.isRequired,
  onChangePage: propTypes.func,
  pageNumber: propTypes.number,
  onChangeRowsPerPage: propTypes.func,
  paginationTotalRows: propTypes.number,
  paginationServer: propTypes.bool,
  paginationPerPage: propTypes.number,
  paginationRowsPerPageOptions: propTypes.arrayOf(propTypes.number),
}

DataTable.defaultProps = {
  loading: false,
  data: [],
  paginationResetDefaultPage: false,
  onRowDoubleClicked: () => {},
  expandableRowsComponent: () => {},
  onChangePage: () => {},
  pageNumber: 1,
  onChangeRowsPerPage: () => {},
  paginationTotalRows: 0,
  paginationServer: false,
  paginationPerPage: 10,
  paginationRowsPerPageOptions: [],
}
