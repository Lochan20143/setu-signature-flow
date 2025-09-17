import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface SignatureStatus {
  id: string;
  documentId: string;
  status: "pending" | "completed" | "failed" | "expired";
  createdAt: string;
  completedAt?: string;
  signedDocumentUrl?: string;
  signers: Array<{
    name: string;
    email: string;
    status: "pending" | "signed" | "declined";
    signedAt?: string;
  }>;
}

const statusConfig = {
  pending: { color: "bg-warning", icon: Clock, label: "Pending" },
  completed: { color: "bg-success", icon: CheckCircle, label: "Completed" },
  failed: { color: "bg-destructive", icon: XCircle, label: "Failed" },
  expired: { color: "bg-muted", icon: XCircle, label: "Expired" }
};

const Status = () => {
  const [searchParams] = useSearchParams();
  const [requestId, setRequestId] = useState(searchParams.get("id") || "");
  const [statusData, setStatusData] = useState<SignatureStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
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

  const simulateStatusCheck = async (id: string): Promise<SignatureStatus> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isCompleted = Math.random() > 0.7; // 30% chance of completion for demo
    
    return {
      id,
      documentId: `doc_${id.slice(-6)}`,
      status: isCompleted ? "completed" : "pending",
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      completedAt: isCompleted ? new Date().toISOString() : undefined,
      signedDocumentUrl: isCompleted ? `https://sandbox.setu.co/documents/${id}/download` : undefined,
      signers: [
        {
          name: "John Doe",
          email: "john@example.com",
          status: isCompleted ? "signed" : "pending",
          signedAt: isCompleted ? new Date().toISOString() : undefined
        }
      ]
    };
  };

  const handleStatusCheck = async () => {
    if (!requestId.trim()) {
      toast({
        title: "Missing Request ID",
        description: "Please enter a signature request ID.",
        variant: "destructive",
      });
      return;
    }

    const credentials = validateCredentials();
    if (!credentials) {
      toast({
        title: "Missing Credentials",
        description: "Please configure your API credentials first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const status = await simulateStatusCheck(requestId);
      setStatusData(status);
      
      if (status.status === "completed") {
        setAutoRefresh(false);
        toast({
          title: "Document Signed!",
          description: "The document has been successfully signed.",
        });
      }
    } catch (error) {
      toast({
        title: "Status Check Failed",
        description: "Unable to retrieve signature status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && requestId && statusData?.status === "pending") {
      const interval = setInterval(() => {
        handleStatusCheck();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, requestId, statusData?.status]);

  // Auto-check if ID is in URL params
  useEffect(() => {
    if (requestId) {
      handleStatusCheck();
    }
  }, []);

  const handleDownload = () => {
    if (statusData?.signedDocumentUrl) {
      // In a real app, this would download the file
      toast({
        title: "Download Started",
        description: "Your signed document is being downloaded.",
      });
      // Simulate download
      window.open(statusData.signedDocumentUrl, '_blank');
    }
  };

  const credentials = validateCredentials();

  if (!credentials) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Signature Status</h1>
          <Alert className="border-warning/20 bg-warning/5">
            <Settings className="h-4 w-4 text-warning" />
            <AlertDescription>
              You need to configure your API credentials before checking signature status.
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
        <h1 className="text-3xl font-bold">Signature Status</h1>
        <p className="text-muted-foreground">
          Check the status of your signature requests and download completed documents.
        </p>
      </div>

      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Check Request Status</CardTitle>
          <CardDescription>
            Enter a signature request ID to check its current status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestId">Signature Request ID</Label>
            <Input
              id="requestId"
              type="text"
              placeholder="sig_..."
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleStatusCheck}
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Check Status
            </Button>
            
            {statusData?.status === "pending" && (
              <Button
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? "Stop Auto-refresh" : "Start Auto-refresh"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {statusData && (
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Signature Request Details</span>
              <Badge 
                variant="secondary" 
                className={`${statusConfig[statusData.status].color} text-white`}
              >
                {React.createElement(statusConfig[statusData.status].icon, { className: "h-4 w-4 mr-1" })}
                {statusConfig[statusData.status].label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Request ID</p>
                <p className="font-mono">{statusData.id}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Document ID</p>
                <p className="font-mono">{statusData.documentId}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Created</p>
                <p>{new Date(statusData.createdAt).toLocaleDateString()}</p>
              </div>
              {statusData.completedAt && (
                <div>
                  <p className="font-medium text-muted-foreground">Completed</p>
                  <p>{new Date(statusData.completedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Signers</h4>
              {statusData.signers.map((signer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{signer.name}</p>
                    <p className="text-sm text-muted-foreground">{signer.email}</p>
                  </div>
                  <Badge variant={signer.status === "signed" ? "default" : "secondary"}>
                    {signer.status}
                  </Badge>
                </div>
              ))}
            </div>

            {statusData.status === "completed" && statusData.signedDocumentUrl && (
              <div className="pt-4 border-t">
                <Button onClick={handleDownload} className="w-full bg-gradient-primary hover:opacity-90">
                  <Download className="h-4 w-4 mr-2" />
                  Download Signed Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This application simulates API responses. 
          Status checks have a random chance of showing completion for demonstration purposes.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Status;