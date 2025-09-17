import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload as UploadIcon, FileText, ExternalLink, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface UploadResponse {
  documentId: string;
  signatureId: string;
  signatureUrl: string;
  status: string;
}

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const validateCredentials = () => {
    const saved = localStorage.getItem("setu-credentials");
    if (!saved) return null;
    try {
      const credentials = JSON.parse(saved);
      if (!credentials.clientId || !credentials.clientSecret || !credentials.productInstanceId) {
        return null;
      }
      return credentials;
    } catch {
      return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const simulateApiCall = async (endpoint: string, data?: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different responses based on endpoint
    if (endpoint === "/api/documents") {
      return { documentId: `doc_${Date.now()}` };
    } else if (endpoint === "/api/signature") {
      return {
        signatureId: `sig_${Date.now()}`,
        signatureUrl: `https://sandbox.setu.co/sign/${Date.now()}`,
        status: "pending"
      };
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const credentials = validateCredentials();
    if (!credentials) {
      toast({
        title: "Missing Credentials",
        description: "Please configure your API credentials first.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Upload document
      setProgress(25);
      const documentResponse = await simulateApiCall("/api/documents", {
        name: file.name,
        document: file
      });

      setProgress(50);

      // Step 2: Create signature request
      const signatureResponse = await simulateApiCall("/api/signature", {
        documentId: documentResponse.documentId,
        redirectUrl: window.location.origin + "/status",
        signers: [{
          name: "John Doe",
          email: "john@example.com"
        }]
      });

      setProgress(100);

      const response: UploadResponse = {
        documentId: documentResponse.documentId,
        signatureId: signatureResponse.signatureId,
        signatureUrl: signatureResponse.signatureUrl,
        status: signatureResponse.status
      };

      setUploadResponse(response);
      
      toast({
        title: "Upload Successful",
        description: "Document uploaded and signature request created.",
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error processing your document.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const credentials = validateCredentials();

  if (!credentials) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Upload Contract</h1>
          <Alert className="border-warning/20 bg-warning/5">
            <Settings className="h-4 w-4 text-warning" />
            <AlertDescription>
              You need to configure your API credentials before uploading documents.
              <div className="mt-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/settings">Go to Settings</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Upload Contract</h1>
        <p className="text-muted-foreground">
          Upload a PDF document to initiate the signature process.
        </p>
      </div>

      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Select a PDF file to upload and create a signature request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select PDF Document</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-4">
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Choose a PDF file to upload</p>
                </div>
              )}
              <Input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="max-w-xs mx-auto"
              />
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {uploading ? "Processing..." : "Upload & Create Signature Request"}
          </Button>
        </CardContent>
      </Card>

      {uploadResponse && (
        <Card className="shadow-professional border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="text-success flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Upload Successful</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Document ID</p>
                <p className="font-mono">{uploadResponse.documentId}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Signature ID</p>
                <p className="font-mono">{uploadResponse.signatureId}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <Button asChild className="w-full">
                <a href={uploadResponse.signatureUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Signature Page
                </a>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to={`/status?id=${uploadResponse.signatureId}`}>
                  Track Status
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This application simulates API calls for demonstration purposes. 
          In a real implementation, these would be actual calls to Setu's API endpoints.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Upload;