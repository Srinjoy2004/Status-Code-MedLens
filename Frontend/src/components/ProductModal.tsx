import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Medicine } from "./ProductCard";

interface ProductModalProps {
  medicine: Medicine;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (medicine: Medicine, quantity: number) => void;
}

export const ProductModal = ({ medicine, isOpen, onClose, onAddToCart }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [aiDescription, setAiDescription] = useState<string>("");
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const { toast } = useToast();

  const isOutOfStock = medicine.stock === 0;

  useEffect(() => {
    if (isOpen && !aiDescription) {
      generateAIDescription();
    }
  }, [isOpen, medicine.name]);

  const generateAIDescription = async () => {
    setIsLoadingDescription(true);
    // Simulate API call to generate AI description
    setTimeout(() => {
      setAiDescription(
        `${medicine.name} is a commonly prescribed medication used for pain relief and fever reduction. It works by inhibiting the production of prostaglandins, which are chemicals that cause pain and inflammation. This medication is generally well-tolerated when used as directed. Always follow dosage instructions and consult with your healthcare provider if you have any questions or concerns about this medication.`
      );
      setIsLoadingDescription(false);
    }, 2000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > medicine.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${medicine.stock} items available`,
        variant: "destructive",
      });
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(medicine, quantity);
    toast({
      title: "Added to Cart",
      description: `${medicine.name} (x${quantity}) added to your cart`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto gradient-secondary border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {medicine.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg shadow-card">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-80 object-cover"
              />
            </div>
            
            {medicine.category && (
              <Badge variant="outline" className="w-fit">
                {medicine.category}
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                ${medicine.price.toFixed(2)}
              </div>
              
              {!isOutOfStock ? (
                <Badge variant="outline" className="border-success text-success">
                  {medicine.stock} in stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                    min={1}
                    max={medicine.stock}
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= medicine.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              variant={isOutOfStock ? "ghost" : "medical"}
              size="lg"
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? "Out of Stock" : `Add ${quantity} to Cart`}
            </Button>

            {/* AI Description */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-foreground">
                  About this Medicine (AI Powered)
                </h3>
                <div className="group relative">
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none whitespace-nowrap shadow-card">
                    This description is generated by AI and is for informational purposes only. Always consult a doctor.
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-card/50 rounded-lg border border-primary/10">
                {isLoadingDescription ? (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating description...</span>
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed">
                    {aiDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};