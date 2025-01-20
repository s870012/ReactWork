

function Pagination ({pagination, getProducts, products}){
  
  const controlPageChange = (page) => {
    getProducts(page);
  }
  
  return (<>
    {products.length === 0 ? '' : (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${pagination.has_pre ? '' : 'disabled'}`}>
            <a href="#" className="page-link" onClick={() => controlPageChange(pagination.current_page - 1)}>上一頁</a>
          </li>
          {Array.from({length:pagination.total_pages}).map ((_, index) => {
            return (<li className={`page-item ${pagination.current_page === index +1 ? 'active' : ''}`} key={index}>
              <a className="page-link" href="#" onClick={() => controlPageChange(index + 1)}>
                {index + 1 }
              </a>
            </li>)
          })}
          <li className={`page-item ${pagination.has_next ? '' : 'disabled'}`}>
            <a className="page-link" href="#" onClick={() => controlPageChange(pagination.current_page + 1)}>下一頁</a>
          </li>
        </ul>
      </nav>
    )}
  </>)
}

export default Pagination;