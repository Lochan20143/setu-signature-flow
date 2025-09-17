import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiCredentials {
  clientId: string;
  clientSecret: string;
  productInstanceId: string;
}

const Settings = () => {
  const [credentials, setCredentials] = useState<ApiCredentials>({
    clientId: "",
    clientSecret: "",
    productInstanceId: "",
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load credentials from localStorage on component mount
    const saved = localStorage.getItem("setu-credentials");
    if (saved) {
      try {
        setCredentials(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved credentials:", error);
      }
    }
  }, []);

  const handleSave = () => {
    if (!credentials.clientId || !credentials.clientSecret || !credentials.productInstanceId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("setu-credentials", JSON.stringify(credentials));
    toast({
      title: "Credentials Saved",
      description: "Your API credentials have been saved to local storage.",
    });
  };

  const handleClear = () => {
    setCredentials({
      clientId: "",
      clientSecret: "",
      productInstanceId: "",
    });
    localStorage.removeItem("setu-credentials");
    toast({
      title: "Credentials Cleared",
      description: "All API credentials have been removed.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">API Settings</h1>
        <p className="text-muted-foreground">
          Configure your Setu API credentials for document signing integration.
        </p>
      </div>

      {/* Security Warning */}
      <Alert className="border-warning/20 bg-warning/5">
        <Shield className="h-4 w-4 text-warning" />
        <AlertDescription className="text-warning-foreground">
          <strong>Security Warning:</strong> This is a demo application. Your API credentials 
          will be stored in your browser's local storage, which is not secure for production use. 
          In a real application, these should be handled by a secure backend service.
        </AlertDescription>
      </Alert>

      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Setu API Credentials</CardTitle>
          <CardDescription>
            Enter your Setu API credentials. You can find these in your Setu dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              type="text"
              placeholder="Enter your client ID"
              value={credentials.clientId}
              onChange={(e) =>
                setCredentials({ ...credentials, clientId: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <div className="relative">
              <Input
                id="clientSecret"
                type={showSecrets ? "text" : "password"}
                placeholder="Enter your client secret"
                value={credentials.clientSecret}
                onChange={(e) =>
                  setCredentials({ ...credentials, clientSecret: e.target.value })
                }
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowSecrets(!showSecrets)}
              >
                {showSecrets ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productInstanceId">Product Instance ID</Label>
            <Input
              id="productInstanceId"
              type="text"
              placeholder="Enter your product instance ID"
              value={credentials.productInstanceId}
              onChange={(e) =>
                setCredentials({ ...credentials, productInstanceId: e.target.value })
              }
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
              <Save className="h-4 w-4 mr-2" />
              Save Credentials
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Saved Credentials Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  credentials.clientId ? "bg-success" : "bg-muted"
                }`}
              />
              <span className="text-muted-foreground">Client ID</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  credentials.clientSecret ? "bg-success" : "bg-muted"
                }`}
              />
              <span className="text-muted-foreground">Client Secret</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  credentials.productInstanceId ? "bg-success" : "bg-muted"
                }`}
              />
              <span className="text-muted-foreground">Product Instance</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;