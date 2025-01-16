import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import './assets/all.scss';

const Modal = ({
  editModalRef, 
  tempProduct, 
  controlModalInput, 
  closeModal, 
  editProduct,
  controlImgInput, 
  addImg, 
  removeImg
}) => {
  return(<>
    <div id="productModal" className="modal fade" tabIndex="-1" ref={editModalRef}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 id="productModalLabel" className="modal-title">
              {tempProduct.id === '' ? <span>新增產品</span> : <span>編輯產品</span> }
            </h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-2">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      輸入圖片網址
                    </label>
                    <input id="imageUrl" type="text" className="form-control" placeholder="請輸入圖片連結"
                      value={tempProduct.imageUrl}
                      onChange={controlModalInput}/>
                  </div>
                  <img className="img-fluid" src={tempProduct.imageUrl} alt="主圖" />
                </div>
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {tempProduct.imagesUrl.map((image, index) => {
                    return (<div key={index} className="mb-2">
                      <label htmlFor={`newImages${index}`} className="form-label">副圖{index + 1}</label>
                      <input
                        id={`newImages${index}`}
                        type="text"
                        value={image}
                        onChange={controlImgInput}
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-preview mb-2"
                        />
                      )}
                    </div>)
                  })}
                </div>
                <div>
                  <button className="btn btn-outline-primary btn-sm d-block w-100" onClick={addImg}>
                    新增圖片
                  </button>
                </div>
                <div>
                  <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={removeImg}>
                    刪除圖片
                  </button>
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">標題</label>
                  <input id="title" type="text" className="form-control" placeholder="請輸入標題"
                   value={tempProduct.title} 
                   onChange={controlModalInput}/>
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">分類</label>
                    <input id="category" type="text" className="form-control" placeholder="請輸入分類"
                     value={tempProduct.category} 
                     onChange={controlModalInput}/>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">單位</label>
                    <input id="unit" type="text" className="form-control" placeholder="請輸入單位"
                     value={tempProduct.unit} 
                     onChange={controlModalInput}/>
                  </div>
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">原價</label>
                    <input id="origin_price" type="number" min="0" className="form-control" placeholder="請輸入原價"
                     value={tempProduct.origin_price} 
                     onChange={controlModalInput}/>
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">售價</label>
                    <input id="price" type="number" min="0" className="form-control" placeholder="請輸入售價"
                     value={tempProduct.price} 
                     onChange={controlModalInput}/>
                  </div>
                </div>
                <hr />
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">產品描述</label>
                  <textarea id="description" className="form-control" placeholder="請輸入產品描述" 
                    value={tempProduct.description} 
                    onChange={controlModalInput}>
                  </textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">說明內容</label>
                  <textarea id="content" className="form-control" placeholder="請輸入說明內容" 
                    value={tempProduct.content} 
                    onChange={controlModalInput}>
                  </textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check text-start">
                    {
                      tempProduct.is_enabled === 1 ? (<input id="is_enabled" className="form-check-input" type="checkbox" checked 
                        value={tempProduct.is_enabled} 
                        onChange={controlModalInput}/>) :
                      (<input id="is_enabled" className="form-check-input" type="checkbox" 
                        value={tempProduct.is_enabled} 
                        onChange={controlModalInput}/>)
                    }
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={editProduct}>確認</button>
          </div> 
        </div>
      </div>
    </div>
 </>)
}

const DeleteModal = ({deleteRef, closeModal, tempProduct, deleteProduct})=>{
  return(<>
    <div
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      ref={deleteRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除 
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              取消
            </button>
            <button type="button" className="btn btn-danger" onClick={deleteProduct}>
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </>)
}

function ReactWeek3(){
  const url = import.meta.env.VITE_BASE_URL; 
  const path = import.meta.env.VITE_API_PATH; 
  
  const [user, setUser] = useState({
      username:'',
      password:''
  })

  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState([]);

  //login
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

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

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
    is_enabled: false,
    imagesUrl: [""]
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
        imagesUrl: [""]
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
  const editProduct = async (product) => {
    setTempProduct(product)
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
      setTempProduct(product)
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


  // deleteModal
  const deleteRef = useRef(null);
  const deleteModal = (product) => {
    controlModal.current = new bootstrap.Modal(deleteRef.current)
    controlModal.current.show();
    setTempProduct(product)
  }

  const deleteProduct = async (product) =>{
    setTempProduct(product)
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
        <div className="text-end mt-4">
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
    />
    <DeleteModal deleteRef={deleteRef} closeModal={closeModal} tempProduct={tempProduct} deleteProduct={deleteProduct}/>
  </>)
}
export default ReactWeek3;