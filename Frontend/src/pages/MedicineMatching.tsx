import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ProductCard, Medicine } from "@/components/ProductCard";
import { ArrowLeft, CheckCircle, AlertTriangle, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import medicine1 from "@/assets/medicine-1.jpg";
import medicine2 from "@/assets/medicine-2.jpg";

interface ExtractedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface MatchedMedicine {
  extracted: ExtractedMedicine;
  available: Medicine[];
  selected?: Medicine;
}

export const MedicineMatching = () => {
  const [extractedMedicines, setExtractedMedicines] = useState<ExtractedMedicine[]>([]);
  const [matchedMedicines, setMatchedMedicines] = useState<MatchedMedicine[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock available medicines in stock
  const availableMedicines: Medicine[] = [
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
      stock: 0, // Out of stock
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
    }
  ];

  useEffect(() => {
    // Load extracted medicines from localStorage
    const stored = localStorage.getItem('extractedMedicines');
    if (stored) {
      const medicines = JSON.parse(stored);
      setExtractedMedicines(medicines);
      matchWithAvailableStock(medicines);
    } else {
      // Redirect to prescription upload if no data
      navigate('/prescription');
    }
  }, [navigate]);

  const matchWithAvailableStock = (extracted: ExtractedMedicine[]) => {
    const matched = extracted.map(medicine => {
      const available = availableMedicines.filter(avail => 
        avail.name.toLowerCase().includes(medicine.name.toLowerCase()) ||
        medicine.name.toLowerCase().includes(avail.name.toLowerCase())
      );
      
      return {
        extracted: medicine,
        available,
        selected: available.length > 0 ? available[0] : undefined
      };
    });
    
    setMatchedMedicines(matched);
  };

  const handleMedicineSelect = (extractedId: string, medicine: Medicine) => {
    setMatchedMedicines(prev => 
      prev.map(match => 
        match.extracted.id === extractedId 
          ? { ...match, selected: medicine }
          : match
      )
    );
  };


  const proceedToCheckout = () => {
    // Prepare data for checkout: both available and unavailable medicines
    const availableMedicines = matchedMedicines
      .filter(match => match.selected && match.selected.stock > 0)
      .map(match => match.selected!);
    
    const unavailableMedicines = matchedMedicines
      .filter(match => !match.selected || match.selected.stock === 0 || match.available.length === 0)
      .map(match => match.extracted);
    
    localStorage.setItem('prescriptionCart', JSON.stringify(availableMedicines));
    localStorage.setItem('unavailableMedicines', JSON.stringify(unavailableMedicines));
    navigate('/prescription-checkout');
  };

  const getMatchStatus = (match: MatchedMedicine) => {
    if (match.available.length === 0) return 'not-found';
    if (match.selected && match.selected.stock === 0) return 'out-of-stock';
    if (match.selected && match.selected.stock > 0) return 'available';
    return 'available';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/prescription')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Upload</span>
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                  Medicine Matching
                </h1>
                <p className="text-muted-foreground">
                  Match your prescription medicines with available stock
                </p>
              </div>
            </div>

            <Button 
              onClick={proceedToCheckout}
              variant="medical"
              className="flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Proceed to Checkout</span>
            </Button>
          </div>

          {/* Medicine Matches */}
          <div className="space-y-6">
            {matchedMedicines.map((match) => {
              const status = getMatchStatus(match);
              
              return (
                <Card key={match.extracted.id} className="shadow-card border-primary/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {match.extracted.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {match.extracted.dosage} • {match.extracted.frequency} • {match.extracted.duration}
                          </p>
                        </div>
                      </CardTitle>
                      
                      <div className="flex items-center space-x-2">
                        {status === 'available' && (
                          <Badge variant="outline" className="border-success text-success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Available
                          </Badge>
                        )}
                        {status === 'out-of-stock' && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Out of Stock
                          </Badge>
                        )}
                        {status === 'not-found' && (
                          <Badge variant="outline" className="border-warning text-warning">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Not Found
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-card/50 rounded-lg border border-primary/10">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Instructions:</span> {match.extracted.instructions}
                        </p>
                      </div>

                      {match.available.length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground">Available Options:</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {match.available.map((medicine) => (
                              <div 
                                key={medicine.id} 
                                className={`relative cursor-pointer border rounded-lg p-4 transition-smooth hover:shadow-card ${
                                  match.selected?.id === medicine.id 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => handleMedicineSelect(match.extracted.id, medicine)}
                              >
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={medicine.image}
                                    alt={medicine.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-foreground">{medicine.name}</h4>
                                    <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                                    <p className="text-lg font-bold text-primary">${medicine.price.toFixed(2)}</p>
                                    <Badge variant="outline" className={medicine.stock > 0 ? "border-success text-success" : "border-destructive text-destructive"}>
                                      {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of Stock'}
                                    </Badge>
                                  </div>
                                </div>
                                {match.selected?.id === medicine.id && (
                                  <div className="absolute -top-2 -right-2">
                                    <Badge className="bg-success text-success-foreground">
                                      Selected
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 space-y-4">
                          <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
                          <div>
                            <h4 className="font-medium text-foreground">Medicine Not Available</h4>
                            <p className="text-sm text-muted-foreground">
                              {match.extracted.name} is not currently in stock. Please consult with a pharmacist for alternatives.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {matchedMedicines.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <AlertTriangle className="w-16 h-16 text-warning mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-foreground">No Prescription Data Found</h3>
                <p className="text-muted-foreground">
                  Please upload and analyze a prescription first.
                </p>
                <Button 
                  onClick={() => navigate('/prescription')} 
                  className="mt-4"
                  variant="medical"
                >
                  Upload Prescription
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};