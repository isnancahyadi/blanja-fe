import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../style/components/ProductCard.scss";
import { Link } from "react-router-dom";

function ProductCard({ productId, image, title, price, storeName, rating }) {

  // Function to change price to rupiah format
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  }

  return (
    <Link
      className="text-decoration-none"
      to={`/product/${productId}`}
    >
      <div className="ProductCard">
        <div className="card mt-3 mb-3 h-100">
          <img src={image} className="card-img-top" alt="Product" />
          <div className="card-body">
            <h5 className="product-title card-title">{title}</h5>
            <h5 className="price card-title" style={{ color: "#DB3022" }}>
              {formatPrice(price)}
            </h5>
            <small className="text text-muted">{storeName}</small>
            <div className="row my-2">
              <div className="ic-rating col-auto pe-0">
                <FontAwesomeIcon
                  id="ic-star"
                  className="ic"
                  icon="star"
                  size="sm"
                />
                <FontAwesomeIcon
                  id="ic-star"
                  className="ic"
                  icon="star"
                  size="sm"
                />
                <FontAwesomeIcon
                  id="ic-star"
                  className="ic"
                  icon="star"
                  size="sm"
                />
                <FontAwesomeIcon
                  id="ic-star"
                  className="ic"
                  icon="star"
                  size="sm"
                />
                <FontAwesomeIcon
                  id="ic-star"
                  className="ic"
                  icon="star"
                  size="sm"
                />
              </div>
              <div className="rating col-auto ps-0">
                <small className="text">({rating})</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
