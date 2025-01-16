import { useState } from 'react'
import axios from 'axios'
import './assets/all.scss'

function App() {
  const url = import.meta.env.VITE_BASE_URL; 
  const path = import.meta.env.VITE_API_PATH; 

  const [user, setUser] = useState({
    username:'',
    password:''
  })

  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const checkLogin = async() => {
    try {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] = token;
      const res = await axios.post(`${url}/api/user/check`)
      alert("已登入")
    } catch (error) {
      console.dir(error);
    }
  }

  const getProducts = async () => {
    try {
      const res = await axios.get(`${url}/api/${path}/admin/products`)
      setProducts(res.data.products);
    } catch (error) {
      console.dir(error);
    }
  }

  const controlInput = (e) =>{
    const {id,value} = e.target;
    setUser({
      ...user,
      [id]:value
    })
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/admin/signin`, user)
      const {token, expired} = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      getProducts();
      setIsLogin(true);
      setUser({
        username:'',
        password:''
      })

    } catch (error) {
      alert("登入失敗",+error.response)
      console.dir(error);
    }
  }

  return ( 
    <>
      {
        isLogin ? (
          <div className="container">
            <button className="d-inline-block w-auto" onClick={checkLogin}>確認登入</button>
            <div className="row mt-5">
              <div className="col-md-6">
                <h2>產品列表</h2>
                  <table className="table">
                    <thead className="text-center">
                        <tr>
                            <th>產品名稱</th>
                            <th>原價</th>
                            <th>售價</th>
                            <th>是否啟用</th>
                            <th>查看細節</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {products.map((item) => (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.origin_price}</td>
                                <td>{item.price}</td>
                                <td>{item.is_enabled ? '是' : '否'}</td>
                                <td>
                                    <button type="button" onClick={()=>{
                                        setTempProduct(item);
                                    }}>查看細節</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
              </div>
              <div className="col-md-6">
                <h2>單一產品細節</h2>
                {tempProduct ? (
                  <div className="card mb-3">
                    <img src={tempProduct.imageUrl} className="card-img-top primary-image" alt="主圖"/>
                    <div className="card-body">
                      <h5 className="card-title">
                          {tempProduct.title}
                          <span className="badge bg-primary ms-2">{tempProduct.category}</span>
                      </h5>
                      <p className="card-text">產品描述 : {tempProduct.description}</p>
                      <p className="card-text">產品內容 : {tempProduct.content}</p>
                      <div className="d-flex">
                          <p className="card-text text-secondary"><del>{tempProduct.origin_price}</del></p>
                          元/ {tempProduct.price} 元
                      </div>
                      <h5 className="mt-3">更多圖片:</h5>
                      <div className="d-flex flex-wrap">
                          {tempProduct.imagesUrl.map((item, i)=>(
                              <img key={i} src={item} className="images"/>
                          ))}
                      </div>
                    </div>
                  </div>
                  ) : (<p className="text-secondary">請選擇一個商品看看</p>)
                }
              </div>
            </div>
            <button onClick={()=>(
              setIsLogin(false),
              setTempProduct(null)
            )}>登出</button>
          </div>
        ) : (
          <div className="container login">
            <div className="row justify-content-center">
              <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
              <div className="col-8">
                <form id="form" className="form-signin" onSubmit={login}>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="username" placeholder="name@example.com" value={user.username} onChange={controlInput} required autoFocus />
                    <label htmlFor="username">Email address</label>
                  </div>
                  <div className="form-floating">
                    <input type="password" className="form-control" id="password" placeholder="Password" value={user.password} onChange={controlInput} required />
                    <label htmlFor="password">Password</label>
                  </div>
                  <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">登入</button>
                </form>
              </div>
            </div>
            <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
          </div>
        )
      }  
    </>
  )
}

export default App