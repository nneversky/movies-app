import { Pagination } from 'antd'
import './PaginationItem.css'

const PaginationItem = ({ showPagination, page, onTogglePage }) => {
  if (!showPagination) return null
  return (
    <Pagination
      style={{ display: 'flex', justifyContent: 'center' }}
      onChange={(e) => onTogglePage(e)}
      showSizeChanger={false}
      total={page.totalPages * 20}
      defaultPageSize={20}
    />
  )
}

export default PaginationItem
