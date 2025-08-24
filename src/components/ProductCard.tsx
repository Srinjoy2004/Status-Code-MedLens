import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShoppingCart } from "lucide-react";
import { ProductModal } from "./ProductModal";

export interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  dosage?: string;
  category?: string;
}

interface ProductCardProps {
  medicine: Medicine;
  onAddToCart: (medicine: Medicine, quantity: number) => void;
}

export const ProductCard = ({ medicine, onAddToCart }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOutOfStock = medicine.stock === 0;

  return (
    <>
      <Card className="group overflow-hidden transition-smooth hover:shadow-medical hover:scale-105 animate-float-medical border-primary/10">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <img
              src={medicine.image}
              alt={medicine.name}
              className="w-full h-48 object-cover transition-smooth group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm font-semibold animate-pulse-medical">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-smooth">
                {medicine.name}
              </h3>
              {medicine.category && (
                <p className="text-sm text-muted-foreground">{medicine.category}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                ${medicine.price.toFixed(2)}
              </span>
              
              {!isOutOfStock && (
                <Badge variant="outline" className="border-success text-success">
                  {medicine.stock} in stock
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setIsModalOpen(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          <Button
            variant={isOutOfStock ? "ghost" : "default"}
            size="sm"
            className="flex-1"
            disabled={isOutOfStock}
            onClick={() => !isOutOfStock && onAddToCart(medicine, 1)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>

      <ProductModal
        medicine={medicine}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={onAddToCart}
      />
    </>
  );
};