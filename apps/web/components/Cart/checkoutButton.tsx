export function proceedToCheckoutButton() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
        window.location.href = "/checkout";
        console.log("Proceeding to checkout...");
      }}
    >
      Proceed to Checkout
    </button>
  );
}