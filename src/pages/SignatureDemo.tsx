import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, FileText, User, Calendar, ArrowRight, Info } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SignatureDemo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const signatureId = searchParams.get('id') || 'sig_demo_123';
  const documentName = searchParams.get('doc') || 'Contract_Document.pdf';

  const handleSign = async () => {
    setLoading(true);
    // Simulate signing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSigned(true);
    setLoading(false);
  };

  const handleComplete = () => {
    // Redirect back to status page with the signature ID
    navigate(`/status?id=${signatureId}`);
  };

  if (signed) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-elegant text-center">
          <CardContent className="pt-6 space-y-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-success">Document Signed!</h2>
              <p className="text-muted-foreground">
                Your signature has been successfully applied to the document.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleComplete} className="w-full">
                View Status & Download
              </Button>
              <p className="text-xs text-muted-foreground">
                You will be redirected to track the document status.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Demo Mode:</strong> This is a simulated signature interface for demonstration purposes.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Document Preview */}
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Document Preview</span>
              </CardTitle>
              <CardDescription>Review the document before signing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium">{documentName}</p>
                  <p className="text-xs text-muted-foreground">PDF Document Preview</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature Panel */}
          <div className="space-y-6">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Signer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">john@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Digital Signature</CardTitle>
                <CardDescription>
                  Click below to apply your digital signature to this document.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg text-center">
                  <div className="space-y-2">
                    <Calendar className="h-8 w-8 text-primary mx-auto" />
                    <p className="text-sm font-medium">Signature Area</p>
                    <p className="text-xs text-muted-foreground">
                      Your signature will be applied here
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleSign}
                  disabled={loading}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {loading ? (
                    "Applying Signature..."
                  ) : (
                    <>
                      Sign Document
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By signing, you agree to the terms and conditions of this document.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureDemo;