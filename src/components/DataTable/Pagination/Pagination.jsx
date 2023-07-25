import ReactPaginate from 'react-paginate'
import { ArrowLeft, ArrowRight, MoreHorizontal } from 'react-feather'

import './Pagination.scss'

const Pagination = ({ pageNumber, paginationTotalRows, onPageChange, paginationPerPage }) => {
  const pageCount = Math.floor(paginationTotalRows / paginationPerPage) + 1

  return (
    <div className="pagination-container">
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

      <div className="pagination-rows-option">
        <h3>
          {paginationPerPage * pageNumber} / {paginationTotalRows}
        </h3>
      </div>
    </div>
  )
}

export default Pagination
