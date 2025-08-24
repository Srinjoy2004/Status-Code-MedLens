import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProductCard, Medicine } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Upload, ShoppingBag } from "lucide-react";
import pharmacyHero from "@/assets/pharmacy-hero.jpg";
import medicine1 from "@/assets/medicine-1.jpg";
import medicine2 from "@/assets/medicine-2.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<Medicine[]>([]);
  const { toast } = useToast();

  // Mock medicines data
  const allMedicines: Medicine[] = [
    {
      id: "1",
      name: "Paracetamol",
      price: 4.99,
      stock: 50,
      image: medicine1,
      description: "Pain relief and fever reducer",
      dosage: "500mg tablets",
      category: "Pain Relief"
    },
    {
      id: "2", 
      name: "Amoxicillin",
      price: 12.99,
      stock: 25,
      image: medicine2,
      description: "Antibiotic for bacterial infections",
      dosage: "250mg capsules", 
      category: "Antibiotics"
    },
    {
      id: "3",
      name: "Cetirizine",
      price: 6.99,
      stock: 0,
      image: medicine1,
      description: "Antihistamine for allergies",
      dosage: "10mg tablets",
      category: "Allergy Relief"
    },
    {
      id: "4",
      name: "Vitamin D3",
      price: 8.99,
      stock: 30,
      image: medicine2,
      description: "Vitamin D supplement",
      dosage: "1000IU tablets",
      category: "Vitamins"
    },
    {
      id: "5",
      name: "Ibuprofen",
      price: 5.99,
      stock: 40,
      image: medicine1,
      description: "Anti-inflammatory pain reliever",
      dosage: "200mg tablets",
      category: "Pain Relief"
    },
    {
      id: "6",
      name: "Omeprazole",
      price: 9.99,
      stock: 15,
      image: medicine2,
      description: "Acid reflux medication",
      dosage: "20mg capsules",
      category: "Digestive Health"
    }
  ];

  const filteredMedicines = allMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (medicine: Medicine, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.id === medicine.id
            ? { ...item, stock: item.stock + quantity }
            : item
        );
      }
      return [...prev, { ...medicine, stock: quantity }];
    });

    toast({
      title: "Added to Cart",
      description: `${medicine.name} (x${quantity}) added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.length} 
        onSearchChange={setSearchQuery}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={pharmacyHero}
            alt="Modern Pharmacy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-secondary opacity-80" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                Your Trusted
                <span className="gradient-primary bg-clip-text text-transparent block">
                  Digital Pharmacy
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload prescriptions, browse medicines, and get AI-powered insights for your healthcare needs
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prescription">
                <Button variant="medical" size="lg" className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Prescription</span>
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Browse Medicines</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Over-the-Counter Medicines
              </h2>
              <p className="text-lg text-muted-foreground">
                Browse our selection of trusted pharmaceutical products
              </p>
            </div>

            {searchQuery && (
              <div className="text-center">
                <p className="text-muted-foreground">
                  Showing results for "{searchQuery}" ({filteredMedicines.length} items)
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine) => (
                <ProductCard
                  key={medicine.id}
                  medicine={medicine}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {filteredMedicines.length === 0 && searchQuery && (
              <div className="text-center py-12 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">No medicines found</h3>
                <p className="text-muted-foreground">
                  Try searching for a different medicine or category
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-foreground">
                AI-Powered Prescription Analysis
              </h2>
              <p className="text-lg text-muted-foreground">
                Advanced technology for accurate prescription processing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-medical">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Easy Upload</h3>
                  <p className="text-muted-foreground">
                    Upload prescription images or PDFs with simple drag & drop
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto shadow-glow">
                  <ShoppingBag className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Smart Matching</h3>
                  <p className="text-muted-foreground">
                    AI matches prescription medicines with available stock
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-medical">
                  <ShoppingBag className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Secure Checkout</h3>
                  <p className="text-muted-foreground">
                    Safe and secure payment processing with invoice generation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
