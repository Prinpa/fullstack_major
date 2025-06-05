import Link from "next/link";
import { getUserData } from "components/authFunctions";
import LogoutButton from "components/Auth/LogoutButton";
import { FiShoppingCart, FiUser, FiPackage, FiPlusSquare } from "react-icons/fi";


export async function TopNav() {
  const userData = await getUserData();
    return (
    <nav className="navbar">
      <Link href={"/"} className="home-button">Nexus</Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {userData.role === "guest" ? (
          <>
            <Link href={"/login"} className="nav-link">
              <FiUser size={20} />
              <span>Login</span>
            </Link>
            <Link href={"/signUp"} className="nav-link">
              <span>Sign up</span>
            </Link>
          </>
        ) : (
          <>
            <span style={{ color: '#ffffff80' }}>Hello, {userData.firstName}</span>
            <Link href={"/orders"} className="nav-link">
              <FiPackage size={20} />
              <span>Orders</span>
            </Link>
            <Link href={"/cart"} className="cart-icon">
              <FiShoppingCart size={20} />
              <span>Cart</span>
            </Link>
            {userData.role === "admin" && (
              <Link href={"/add-product"} className="nav-link">
                <FiPlusSquare size={20} />
                <span>Add Product</span>
              </Link>
            )}
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
}
