export async function getProducts({ filter }: { filter?: {} } = {}) {
  const response = await fetch('http://localhost:3000/api/products', {
    method: 'GET',
  });
  const data = await response.json();
  return data.data;
}
// get product by id
export async function getProductById(id: string) {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data.data;
}
