import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Cart } from "~/models/CartItem";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useAvailableProducts } from "~/queries/products";

type CartItemsProps = {
  items: Cart[];
  isEditable: boolean;
};

export default function CartItems({ items, isEditable }: CartItemsProps) {
  const { data = [] } = useAvailableProducts();
  const fullCartItems = items.map(item => ({ count: item.count, product: data?.find((prod) => item?.product_id === prod?.id) || null}))
  
  const totalPrice: number = fullCartItems.reduce(
    (total, item) => item.count * (item.product?.price || 0) + total,
    0
  );

  return (
    <>
      <List disablePadding>
        {fullCartItems && fullCartItems.map((cartItem, i) => (
          <ListItem
            sx={{ padding: (theme) => theme.spacing(1, 0) }}
            key={cartItem.product?.id || 0 + i}
          >
            {isEditable && <AddProductToCart product={cartItem.product!} />}
            <ListItemText
              primary={cartItem.product?.title}
              secondary={cartItem.product?.description}
            />
            <Typography variant="body2">
              {formatAsPrice(cartItem.product?.price || 0)} x {cartItem.count} ={" "}
              {formatAsPrice((cartItem.product?.price || 0) * cartItem.count)}
            </Typography>
          </ListItem>
        ))}
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body2">Free</Typography>
        </ListItem>
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {formatAsPrice(totalPrice)}
          </Typography>
        </ListItem>
      </List>
    </>
  );
}
