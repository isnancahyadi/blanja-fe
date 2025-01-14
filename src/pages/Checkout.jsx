import "../style/pages/Checkout.scss";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Swal from "sweetalert2";

function Checkout() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [show, setShow] = useState(false);
  const product = location.state.product;
  const productSize = location.state.product_size;
  const productColor = location.state.product_color;
  const totalProduct = location.state.total_product;
  const address_name = useRef();
  const recipient_name = useRef();
  const recipient_phone_number = useRef();
  const address_data = useRef();
  const postal_code = useRef();
  const city = useRef();

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("auth") === null) {
      window.location.href = "/login";
    }

    const fetchData = async () => {
      try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/address`);
        setAddress(result?.data?.data);
        setSelectedAddress(result?.data?.data[0]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: "Loading",
        text: "Please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      Swal.close();
    }
  }, [loading]);

  const getAddress = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/address`)
      .then((result) => {
        setLoading(false);
        setAddress(result?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Function to change price to rupiah format
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleSubmitAddress = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/customer/address`, {
        address_name: address_name.current.value,
        recipient_name: recipient_name.current.value,
        recipient_phone_number: recipient_phone_number.current.value,
        address_data: address_data.current.value,
        postal_code: postal_code.current.value,
        city: city.current.value,
      })
      .then((result) => {
        setLoading(false);
        console.log(result);
        getAddress();
        setAddress([...address, result?.data?.data]);
        console.log(result?.data?.data);
        handleClose();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckOut = () => {
    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/create-payment`)
      .then((result) => {
        console.log(result?.data?.transactionToken);
        window.snap.pay(result?.data?.data?.transactionToken);

        axios
          .post(`${process.env.REACT_APP_BASE_URL}/product/createOrder`, {
            adds_id: selectedAddress.address_id,
            product_id: product.product_id,
            product_size: productSize,
            product_color: productColor,
            total_product: totalProduct,
          })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
            console.error(error?.response?.data?.message);
            Swal.fire({
              title: "Failed",
              text: "Failed Create Order",
              icon: "error",
            });
          });
          
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        console.error(error?.response?.data?.message);
        Swal.fire({
          title: "Failed",
          text: "Failed Select Payment",
          icon: "error",
        });
      });
  };

  return (
    <div className="Checkout">
      <Navbar />

      <section id="content-checkout" className="container">
        <div className="row mb-3">
          <h2 className="fw-bold lh-1">Checkout</h2>
        </div>
        <div className="row mt-4">
          <div className="col-md-8">
            <div className="row mb-4">
              <h6 className="fw-bold">Shipping Address</h6>
              <div id="card-shipping" className="card mt-1">
                <div className="card-body">
                  {
                    address?.length > 0 ? (
                      <>
                        <h6 className="fw-bold">
                          {selectedAddress?.recipient_name} ({selectedAddress?.address_name})
                        </h6>
                        <p className="text mb-0">
                          {selectedAddress?.recipient_phone_number}
                        </p>
                        <h6 className="card-title">{selectedAddress?.address_data}</h6>
                        <p className="card-text">
                          {selectedAddress?.city} {selectedAddress?.postal_code}
                        </p>
                        <button
                          id="btn-address"
                          type="button"
                          className="btn btn-light border-2 border rounded-pill"
                          onClick={
                            handleShow
                          }
                        >
                          Choose another address
                        </button>
                      </>
                    ) : (
                      <>
                        <p>There are no addresses.</p>
                        <button
                          id="btn-address"
                          type="button"
                          className="btn btn-light border-2 border rounded-pill"
                          onClick={
                            handleShow
                          }
                        >
                          Add address
                        </button>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <h6 className="fw-bold">Items</h6>
              <div id="card-items" className="card mt-1">
                <div className="card-body">
                  <div className="row d-flex align-items-center">
                    <div className="col-auto">
                      <img
                        className="img-product"
                        src={product?.path[0]?.photo_path}
                        alt="Image Product"
                      />
                    </div>
                    <div className="col-md-7">
                      <h6 className="card-title fw-bold">
                        {product.product_name} - {productColor}
                      </h6>
                      <small className="text-muted">Code Crafters</small>
                    </div>
                    <div className="col-md-3 text-end">
                      <h5 className="card-title fw-bold">
                        {formatPrice(product.product_price)}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div id="card-summary" className="card">
              <div className="card-body">
                <h6 className="card-title fw-bold">Shopping Summary</h6>
                <div className="row mt-4 justify-content-between">
                  <div className="col-auto">
                    <h6 className="fw-normal text-muted">Order</h6>
                  </div>
                  <div className="col-auto">
                    <h6 className="fw-bold">
                      {formatPrice(product.product_price)} (x
                      {totalProduct})
                    </h6>
                  </div>
                </div>
                <div className="row justify-content-between">
                  <div className="col-auto">
                    <h6 className="fw-normal text-muted">Delivery</h6>
                  </div>
                  <div className="col-auto">
                    <h6 className="fw-bold">
                      {formatPrice(25000)}
                    </h6>
                  </div>
                </div>
                <hr className="solid" style={{ borderTop: "2px solid" }} />
                <div className="row justify-content-between">
                  <div className="col-auto">
                    <h6 className="fw-bold">Total</h6>
                  </div>
                  <div className="col-auto">
                    <h6 className="fw-bold" style={{ color: "#db3022" }}>
                      {formatPrice(product.product_price * totalProduct + 25000)}
                    </h6>
                  </div>
                </div>
                <button
                  id="btn-payment"
                  type="button"
                  className="btn btn-primary mt-3 border-2 border rounded-pill"
                  onClick={handleCheckOut}
                >
                  Select payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Choose Address</Accordion.Header>
              <Accordion.Body>
                {address?.length > 0 ? (
                  address.map((item, index) => (
                    <div className="container" key={index}>
                      <div className="form-check flex-column mb-3">
                        <div className="row">
                          <div className="col-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              value={item?.address_id}
                              onChange={(e) => {
                                setSelectedAddress(item);
                              }}
                            />
                          </div>
                          <div className="col-10">
                            <h6 className="text fw-bold mb-0">
                              {item?.recipient_name} ({item?.address_name})
                            </h6>
                            <p className="text fw-bold mb-0">
                              {item?.recipient_phone_number}
                            </p>
                            <p
                              className="text mb-0"
                              style={{
                                width: "100%",
                                overflowWrap: "break-word",
                              }}
                            >
                              {item?.address_data}
                            </p>
                            <p className="text mb-0">
                              {item?.city} {item?.postal_code}
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr
                        style={{ border: "none", borderTop: "3px solid black" }}
                      />
                    </div>
                  ))
                ) : (
                  <p>There are no addresses.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Add Address</Accordion.Header>
              <Accordion.Body>
                <form onSubmit={handleSubmitAddress}>
                  <label for="allAddress" className="form-label">
                    Save address as (ex : home address, office address)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="allAddress"
                    placeholder="Rumah"
                    ref={address_name}
                  />
                  <label for="name" className="form-label">
                    Recipient’s name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient_name"
                    ref={recipient_name}
                  />
                  <label for="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    ref={address_data}
                  />
                  <label for="telphone_number" className="form-label">
                    Recipient's telephone number
                  </label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    id="telphone_number"
                    ref={recipient_phone_number}
                  />
                  <label for="postal_code" className="form-label">
                    Postal code{" "}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="postal_code"
                    ref={postal_code}
                  />
                  <label for="city" className="form-label">
                    City or Subdistrict{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    id="city"
                    ref={city}
                  />
                  <button type="submit" class="btn btn-success">
                    Add Address
                  </button>
                </form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Checkout;
