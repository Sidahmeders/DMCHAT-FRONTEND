import { useState } from 'react'
import propTypes from 'prop-types'
import ReactDataTableComponent from 'react-data-table-component'
import { PropagateLoader } from 'react-spinners'
import { ChevronDown } from 'react-feather'

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
}) {
  const PAGINATION_ROWS_PER_PAGE_OPTIONS = [200, 500, 1000]
  const [currentRow, setCurrentRow] = useState(null)
  const [paginationPerPage, setPaginationPerPage] = useState(PAGINATION_ROWS_PER_PAGE_OPTIONS[0])

  return (
    <div className="data-table-container">
      <ReactDataTableComponent
        pagination
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
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={PAGINATION_ROWS_PER_PAGE_OPTIONS}
        onChangeRowsPerPage={(currentRowsPerPage) => setPaginationPerPage(currentRowsPerPage)}
        paginationResetDefaultPage={paginationResetDefaultPage}
        sortIcon={<ChevronDown />}
        expandableRowExpanded={(row) => row === currentRow}
        onRowExpandToggled={(_, row) => setCurrentRow(row)}
        progressComponent={<PropagateLoader color="#474aff" />}
        subHeaderComponent={subHeaderComponent}
        expandableRowsComponent={expandableRowsComponent}
        onRowDoubleClicked={onRowDoubleClicked}
      />
    </div>
  )
}

DataTable.propTypes = {
  columns: propTypes.arrayOf(propTypes.any).isRequired,
  data: propTypes.arrayOf(propTypes.any).isRequired,
  loading: propTypes.bool,
  paginationResetDefaultPage: propTypes.bool,
  onRowDoubleClicked: propTypes.func,
  expandableRowsComponent: propTypes.func,
  subHeaderComponent: propTypes.node.isRequired,
}

DataTable.defaultProps = {
  loading: false,
  paginationResetDefaultPage: false,
  onRowDoubleClicked: () => {},
  expandableRowsComponent: () => {},
}
