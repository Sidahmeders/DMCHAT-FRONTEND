import { useState } from 'react'
import propTypes from 'prop-types'
import ReactDataTableComponent from 'react-data-table-component'
import { HashLoader } from 'react-spinners'
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
  onChangePage,
  paginationTotalRows,
  paginationServer,
  onChangeRowsPerPage,
  paginationPerPage,
  paginationRowsPerPageOptions,
}) {
  const [currentRow, setCurrentRow] = useState(null)

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
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationResetDefaultPage={paginationResetDefaultPage}
        onChangePage={onChangePage}
        sortIcon={<ChevronDown />}
        expandableRowExpanded={(row) => row === currentRow}
        onRowExpandToggled={(_, row) => setCurrentRow(row)}
        progressComponent={<HashLoader color="#474aff" />}
        subHeaderComponent={subHeaderComponent}
        expandableRowsComponent={expandableRowsComponent}
        onRowDoubleClicked={onRowDoubleClicked}
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
  onChangeRowsPerPage: () => {},
  paginationTotalRows: 0,
  paginationServer: false,
  paginationPerPage: 10,
  paginationRowsPerPageOptions: [],
}
