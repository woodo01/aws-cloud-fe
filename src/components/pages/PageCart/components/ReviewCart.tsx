import Typography from "@mui/material/Typography";
import CartItems from "~/components/CartItems/CartItems";
import { Cart } from "~/models/CartItem";

type ReviewCartProps = {
  items: Cart[];
};

export default function ReviewCart({ items }: ReviewCartProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <CartItems items={items} isEditable />
    </>
  );
}
