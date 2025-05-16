export async function getProducts({ filter }: { filter?: boolean } = {}) {
  const response = await fetch('http://localhost:3000/api/products', {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}