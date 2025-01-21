import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import './assets/all.scss';
import Pagination from './component/Pagination';
import {Modal, DeleteModal} from './component/Modal';


function ReactWeek4(){
  const url = import.meta.env.VITE_BASE_URL; 
  const path = import.meta.env.VITE_API_PATH; 
  
  const [user, setUser] = useState({
      username:'s8700122000@gmail.com',
      password:'chen810516tw'
  })

  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] =useState({});

  //login
  const getProducts = async (page = 1) => {
    try {
    const res = await axios.get(`${url}/api/${path}/admin/products?page=${page}`)
    setProducts(res.data.products);
    setPagination(res.data.pagination);
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

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
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
  }, []);

  //product edit
  const [tempProduct, setTempProduct] = useState({
    id:"",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: []
  });

  // modal
  const controlModal = useRef(null);
  // editModal
  const editModalRef = useRef(null);
  const openEditModal = (product, type) => {
    if (type == 'edit'){
      setTempProduct(product)
    } else {
      setTempProduct({
        id:"",
        imageUrl: "",
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: 0,
        imagesUrl: []
      })
    }
    controlModal.current = new bootstrap.Modal(editModalRef.current)
    controlModal.current.show();
  }

  const controlModalInput = (e) =>{
    const {id, value, type, checked} = e.target;
    setTempProduct({
      ...tempProduct,
      [id]:type =='checkbox' ? checked : value
    })
  }

  // edit product
  const editProduct = async () => {
    const productData ={
      data:{
        ...tempProduct,
        origin_price:Number(tempProduct.origin_price),
        price:Number(tempProduct.price),
        is_enabled:tempProduct.is_enabled? 1 : 0,
        imagesUrl:tempProduct.imagesUrl
      }
    }
    try {
      let res;
      if(tempProduct.id ===''){
        res = await axios.post(`${url}/api/${path}/admin/product`, productData)
        console.log(res.data)
      } else {
        res = await axios.put(`${url}/api/${path}/admin/product/${tempProduct.id}`, productData)
        console.log(res.data)
      }
      getProducts();
      controlModal.current.hide();
    } catch (error) {
      if(tempProduct.id===''){
        console.log('新增產品失敗', error);
      } else {
        console.log('編輯產品失敗', error);
      };
    };
  };

  // image
  const controlImgInput = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct(
      {...tempProduct,
      imagesUrl: newImages
      }
    )
  }
  
  const addImg = () => {
    if(tempProduct.imagesUrl.length < 5 && 
      tempProduct.imagesUrl[tempProduct.imagesUrl.length] !== ''){
        setTempProduct((product) => ({
          ...product,
          imagesUrl: [...product.imagesUrl, ""],
        }));
      } else {
        alert('圖片上限為五張')
      }
  };

  const removeImg = () => {
    if(tempProduct.imagesUrl.length > 1){
      setTempProduct((product) => {
        const newImages = [...product.imagesUrl];
        newImages.pop();
        return { ...product, imagesUrl: newImages };
      });
    } else {
      alert('圖片至少要有一張')
    }
  } 

  // upLoad image
  const controlFileChange = async(e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);
    try {
      const res = await axios.post(`${url}/api/${path}/admin/upload`, formData)
      setTempProduct({
        ...tempProduct,
        imageUrl: res.data.imageUrl
      })
    } catch (error) {
      console.log(error);
    }
  }

  // deleteModal
  const deleteRef = useRef(null);
  const deleteModal = (product) => {
    controlModal.current = new bootstrap.Modal(deleteRef.current)
    controlModal.current.show();
    setTempProduct(product)
  }

  const deleteProduct = async () =>{
    try {
      const res = await axios.delete(`${url}/api/${path}/admin/product/${tempProduct.id}`)
      console.log('刪除成功', res.data);
      controlModal.current.hide();
      getProducts();
    } catch (error) {
      console.log(error);
    }
  }

  // close Modal
  const closeModal = () =>{
    controlModal.current.hide();
  }

  

  return(<>
    {isLogin ? (<div>
      <div className="container">
        <div className="text-start mt-4">
          <button className="btn btn-primary" onClick={() => {openEditModal(products, 'create')}}>建立新的產品</button>
        </div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th width="120">分類</th>
              <th>產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="100">是否啟用</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product)=>{
              return (<tr key={product.id}>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td className="text-end">{product.origin_price}</td>
                <td className="text-end">{product.price}</td>
                <td>
                  {product.is_enabled ? (<span className="text-success">啟用</span>) : (<span className="text-danger">未啟用</span>)}
                </td>
                <td>
                  <div className="btn-group">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => {openEditModal(product, 'edit')}}>
                      編輯
                    </button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => {deleteModal(product)}}>
                      刪除
                    </button>
                  </div>
                </td>
              </tr>)
            })}
          </tbody>
        </table>
        <Pagination pagination={pagination} getProducts={getProducts} products={products}/>
      </div>
    </div>) : 
    (
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
    )}
    <Modal 
      editModalRef={editModalRef} 
      closeModal={closeModal} 
      tempProduct={tempProduct} 
      controlModalInput={controlModalInput} 
      editProduct={editProduct}
      controlImgInput={controlImgInput}
      addImg={addImg}
      removeImg={removeImg}
      controlFileChange={controlFileChange}
    />
    <DeleteModal
      deleteRef={deleteRef} 
      closeModal={closeModal} 
      tempProduct={tempProduct} 
      deleteProduct={deleteProduct}/>
  </>)
}
export default ReactWeek4;