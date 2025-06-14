import React from "react";
import { deleteProduct } from "components/productFunctions";

export default function DeleteProductButton({ id }:{id: number}) {
  const handleDelete = async () => {
    await deleteProduct(id);
    window.location.href = "/"
  };

  return (
    <button onClick={handleDelete} style={{ color: "red" }}>
        Delete Product
    </button>
  );
}