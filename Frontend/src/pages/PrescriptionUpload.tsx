import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { Upload, FileText, Image, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import prescriptionAnalysisImage from "@/assets/prescription-analysis.jpg";

interface ExtractedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const PrescriptionUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string>("");
  const [extractedMedicines, setExtractedMedicines] = useState<ExtractedMedicine[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const analyzePrescription = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate prescription analysis with progress
    const progressSteps = [
      { step: 10, message: "Preprocessing image..." },
      { step: 30, message: "Detecting text regions..." },
      { step: 50, message: "Extracting handwritten text..." },
      { step: 70, message: "Parsing medicine information..." },
      { step: 90, message: "Formatting results..." },
      { step: 100, message: "Analysis complete!" }
    ];

    for (const { step, message } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisProgress(step);
      
      if (step === 100) {
        // Simulate extracted prescription data
        const mockExtractedText = `
Patient: John Doe
Date: ${new Date().toLocaleDateString()}

Rx:
1. Paracetamol 500mg - Take 1 tablet twice daily for 5 days
2. Amoxicillin 250mg - Take 1 capsule three times daily for 7 days  
3. Cetirizine 10mg - Take 1 tablet once daily for 3 days
4. Vitamin D3 1000IU - Take 1 tablet daily for 30 days

Doctor: Dr. Smith
Signature: [Signed]
        `;

        const mockMedicines: ExtractedMedicine[] = [
          {
            id: "1",
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "5 days",
            instructions: "Take 1 tablet twice daily"
          },
          {
            id: "2", 
            name: "Amoxicillin",
            dosage: "250mg",
            frequency: "Three times daily",
            duration: "7 days",
            instructions: "Take 1 capsule three times daily"
          },
          {
            id: "3",
            name: "Cetirizine", 
            dosage: "10mg",
            frequency: "Once daily",
            duration: "3 days",
            instructions: "Take 1 tablet once daily"
          },
          {
            id: "4",
            name: "Vitamin D3",
            dosage: "1000IU", 
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take 1 tablet daily"
          }
        ];

        setExtractedText(mockExtractedText);
        setExtractedMedicines(mockMedicines);
        setAnalysisComplete(true);
        
        toast({
          title: "Analysis Complete",
          description: `${mockMedicines.length} medicines extracted from prescription`,
        });
      }
    }

    setIsAnalyzing(false);
  };

  const proceedToMedicineMatching = () => {
    // Store extracted medicines in localStorage for the next page
    localStorage.setItem('extractedMedicines', JSON.stringify(extractedMedicines));
    navigate('/medicine-matching');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              Prescription Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your prescription image or PDF and our AI will extract the medicine details automatically
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="shadow-card border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <span>Upload Prescription</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth ${
                    isDragActive 
                      ? "border-primary bg-primary/5" 
                      : "border-primary/20 hover:border-primary/40"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-12 h-12 text-success mx-auto" />
                        <div className="text-sm font-medium text-foreground">
                          {uploadedFile.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center space-x-2">
                          <FileText className="w-8 h-8 text-primary" />
                          <Image className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            {isDragActive 
                              ? "Drop your prescription here" 
                              : "Drag & drop your prescription or click to browse"
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports JPG, PNG, PDF files up to 10MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {uploadedFile && !analysisComplete && (
                  <Button 
                    onClick={analyzePrescription}
                    disabled={isAnalyzing}
                    className="w-full"
                    variant="medical"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Prescription...
                      </>
                    ) : (
                      "Analyze Prescription"
                    )}
                  </Button>
                )}

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing...</span>
                      <span className="text-primary">{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="shadow-card border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Extracted Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!uploadedFile ? (
                  <div className="text-center space-y-4 py-12">
                    <img 
                      src={prescriptionAnalysisImage}
                      alt="Prescription Analysis"
                      className="w-32 h-32 object-cover rounded-lg mx-auto opacity-50"
                    />
                    <p className="text-muted-foreground">
                      Upload a prescription to see extracted information
                    </p>
                  </div>
                ) : extractedText ? (
                  <div className="space-y-4">
                    <div className="bg-card/50 p-4 rounded-lg border border-primary/10">
                      <h4 className="font-medium text-foreground mb-2">Raw Extracted Text:</h4>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                        {extractedText}
                      </pre>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Parsed Medicines:</h4>
                      {extractedMedicines.map((medicine) => (
                        <Card key={medicine.id} className="p-3 border border-primary/10">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-primary">{medicine.name}</h5>
                              <Badge variant="outline">{medicine.dosage}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Frequency:</span>
                                <span className="ml-1 text-foreground">{medicine.frequency}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="ml-1 text-foreground">{medicine.duration}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {medicine.instructions}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {analysisComplete && (
                      <Button 
                        onClick={proceedToMedicineMatching}
                        className="w-full"
                        variant="medical"
                      >
                        Find Medicines in Stock
                      </Button>
                    )}
                  </div>
                ) : isAnalyzing ? (
                  <div className="text-center space-y-4 py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">
                      AI is analyzing your prescription...
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-12">
                    <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
                    <p className="text-muted-foreground">
                      Click "Analyze Prescription" to extract medicine information
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};