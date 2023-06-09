import axios from "axios";
import { createContext, useState, ReactNode, useEffect } from "react";
import ErrorPopup from "./ErrorPopup";

export interface Login {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface Cart {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  img: string;
  quantity: number;
}

export interface LoginContextValue {
  login: Login | null;
  setLogin: React.Dispatch<React.SetStateAction<Login | null>>;
}

export const LoginContext = createContext<LoginContextValue>({
  login: null,
  setLogin: () => {},
});

export interface ProductContextValue {
  cartProducts: Cart[];
  setCartProducts: React.Dispatch<React.SetStateAction<Cart[]>>;
}

export const ProductContext = createContext<ProductContextValue>({
  cartProducts: [],
  setCartProducts: () => {},
});

interface shopContextValue {
  userContext: LoginContextValue;
  cartContext: ProductContextValue;
}

export const ShopContext = createContext<shopContextValue>({
  userContext: { login: null, setLogin: () => {} },
  cartContext: { cartProducts: [], setCartProducts: () => {} },
});

interface Props {
  children: ReactNode;
}

export function ContextProvider({ children }: Props) {
  const [login, setLogin] = useState<Login | null>(null);
  const [cartProducts, setCartProducts] = useState<Cart[]>([]);
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    (async () => {
      const rememberedLoginToken = localStorage.getItem("token");

      if (rememberedLoginToken) {
        try {
          const rememberedUser = await axios.get(
            "http://localhost:8080/validate-token",
            {
              headers: { Authorization: `Bearer ${rememberedLoginToken}` },
            }
          );

          const { email, firstName, lastName, token } = rememberedUser.data;

          setLogin({ email, firstName, lastName, token });
        } catch (error) {
          localStorage.removeItem("token");
          
          setErrorMsg(true);
          setTimeout(() => {
            setErrorMsg(false);
          }, 2500);
        }
      }
    })();

    const CheckExistingCart: Cart[] = JSON.parse(
      localStorage.getItem("cart") || "null"
    );

    if (CheckExistingCart?.length > 0) {
      setCartProducts(CheckExistingCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }, [cartProducts]);

  return (
    <ShopContext.Provider
      value={{
        userContext: { login, setLogin },
        cartContext: { cartProducts, setCartProducts },
      }}
    >
      {children}
      <ErrorPopup errorMsg={errorMsg} />
    </ShopContext.Provider>
  );
}
