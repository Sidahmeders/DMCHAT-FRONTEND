import ReactPaginate from 'react-paginate'
import { ArrowLeft, ArrowRight, MoreHorizontal } from 'react-feather'

import './Pagination.scss'

const Pagination = ({
  pageNumber,
  paginationTotalRows,
  onPageChange,
  paginationPerPage,
  paginationRowsPerPageOptions,
  onChangeRowsPerPage,
}) => {
  const pageCount = Math.floor(paginationTotalRows / paginationPerPage) + 1

  return (
    <div className="pagination-container">
      <div className="pagination-row-options">
        lignes
        <select className="pagination-selectbox" onChange={(e) => onChangeRowsPerPage(Number(e.target.value))}>
          {paginationRowsPerPageOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <ReactPaginate
        containerClassName="pagination"
        activeClassName="active"
        nextLinkClassName="next"
        previousLinkClassName="previous"
        pageCount={pageCount}
        onPageChange={(props) => onPageChange(props.selected)}
        forcePage={pageNumber}
        breakLabel={<MoreHorizontal size="1.25rem" color="#474aff" />}
        nextLabel={<ArrowRight size="1.25rem" color="#474aff" />}
        previousLabel={<ArrowLeft size="1.25rem" color="#474aff" />}
      />

      <h3 className="pagination-page-count">
        {paginationPerPage * pageNumber} / {paginationTotalRows}
      </h3>
    </div>
  )
}

export default Pagination
